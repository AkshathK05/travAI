import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatMessage } from '../types';

const API_KEY_STORAGE_KEY = 'travai_gemini_api_key';

// Rate limiting configuration
const MAX_REQUESTS_PER_MINUTE = 10;
const MIN_COOLDOWN_MS = 2000; // 2 seconds between consecutive requests
const requestTimestamps: number[] = [];

/**
 * Checks client-side rate limit rules before dispatching an API call.
 * Returns { allowed: true } or { allowed: false, remainingSeconds, reason }.
 */
export function checkRateLimit(): { allowed: boolean; remainingSeconds?: number; reason?: string } {
  const now = Date.now();

  // Remove timestamps older than 60 seconds (1 minute window)
  while (requestTimestamps.length > 0 && requestTimestamps[0] <= now - 60000) {
    requestTimestamps.shift();
  }

  // Check 1: Minimum cooldown between requests
  if (requestTimestamps.length > 0) {
    const lastRequest = requestTimestamps[requestTimestamps.length - 1];
    const timeSinceLast = now - lastRequest;
    if (timeSinceLast < MIN_COOLDOWN_MS) {
      const waitSec = Math.ceil((MIN_COOLDOWN_MS - timeSinceLast) / 1000);
      return {
        allowed: false,
        remainingSeconds: waitSec,
        reason: `Please wait ${waitSec} second${waitSec > 1 ? 's' : ''} between queries.`
      };
    }
  }

  // Check 2: Maximum requests per minute
  if (requestTimestamps.length >= MAX_REQUESTS_PER_MINUTE) {
    const oldestInWindow = requestTimestamps[0];
    const resetTimeMs = oldestInWindow + 60000 - now;
    const remainingSeconds = Math.ceil(resetTimeMs / 1000);
    return {
      allowed: false,
      remainingSeconds,
      reason: `Rate limit reached (${MAX_REQUESTS_PER_MINUTE} requests/min). Please wait ${remainingSeconds} seconds.`
    };
  }

  return { allowed: true };
}

/**
 * Records a successful request timestamp for rate limit tracking.
 */
function recordRequestTimestamp(): void {
  requestTimestamps.push(Date.now());
}

/**
 * Retrieves the stored Gemini API key from localStorage or Vite environment variables.
 */
export function getStoredApiKey(): string {
  return (
    localStorage.getItem(API_KEY_STORAGE_KEY) ||
    (import.meta.env.VITE_GEMINI_API_KEY as string) ||
    ''
  );
}

/**
 * Saves a user-provided Gemini API key to localStorage.
 */
export function saveApiKey(key: string): void {
  localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
}

/**
 * Removes the stored Gemini API key.
 */
export function removeApiKey(): void {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
}

/**
 * System instruction tailored for travel concierge assistant.
 */
const SYSTEM_INSTRUCTION = `You are TravAI, a world-class autonomous AI Travel Concierge and Trip Planner powered by Google Gemini.

Your mission:
- Create detailed, engaging, and practical travel plans, destination comparisons, flight recommendations, and day-by-day itineraries based on user queries.
- Format all text cleanly with GitHub Flavored Markdown (use bold text, bullet points, headers like ###, tables where helpful).
- Always address constraints specified by the user such as budget, number of travelers, interests (e.g., food, culture, adventure, relaxation).
- Use local currency formatting (e.g., ₹ INR, $ USD) according to user preference.
- Provide practical travel advice, transit tips, and local insider food recommendations.
- End your response with 3 to 4 short follow-up suggestions for the user starting with bullet point list under "**Follow-up suggestions:**".`;

export interface StreamResponseResult {
  stream: AsyncGenerator<string, void, unknown>;
  getFullText: () => Promise<string>;
}

/**
 * Dynamically queries Google's ListModels API for the key to discover valid models.
 */
async function discoverValidModelNames(apiKey: string): Promise<string[]> {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data.models)) {
        const available = data.models
          .filter((m: any) => 
            Array.isArray(m.supportedGenerationMethods) && 
            m.supportedGenerationMethods.includes('generateContent')
          )
          .map((m: any) => m.name.replace(/^models\//, ''));

        if (available.length > 0) {
          console.log('Discovered supported Gemini models for key:', available);
          return available;
        }
      }
    }
  } catch (err) {
    console.warn('Could not auto-discover Gemini models via REST API:', err);
  }

  // Universal hardcoded fallback model names
  return [
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash-8b',
    'gemini-2.0-flash-exp',
    'gemini-1.5-flash',
    'gemini-pro',
    'gemini-1.5-pro-latest',
    'gemini-1.5-pro',
    'gemini-1.5-flash-001',
    'gemini-1.5-flash-002'
  ];
}

/**
 * Sends a query to the Gemini model and yields chunks as they stream.
 * Includes rate limit checks and API 429 error handling.
 */
export async function streamGeminiQuery(
  userQuery: string,
  chatHistory: ChatMessage[] = [],
  metadata?: { budget?: string; travelers?: string },
  modelName: string = 'Gemini 2.5 Flash',
  overrideApiKey?: string
): Promise<StreamResponseResult> {
  // Check client-side rate limit first
  const rateLimitStatus = checkRateLimit();
  if (!rateLimitStatus.allowed) {
    throw new Error(`RATE_LIMIT_EXCEEDED: ${rateLimitStatus.reason}`);
  }

  const apiKey = overrideApiKey || getStoredApiKey();

  if (!apiKey) {
    throw new Error('MISSING_API_KEY');
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  // Discover valid model names for this specific API key
  const validModels = await discoverValidModelNames(apiKey);

  // Prepare message history for Gemini chat format
  const formattedHistory = chatHistory
    .filter((msg) => msg.content && msg.content.trim().length > 0)
    .map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

  // Build prompt context with any metadata attached (budget, travelers)
  let promptWithMeta = userQuery;
  if (metadata?.budget || metadata?.travelers) {
    promptWithMeta += `\n\n[Travel Parameters: Budget=${metadata.budget || 'Not specified'}, Travelers=${metadata.travelers || 'Not specified'}]`;
  }

  formattedHistory.push({
    role: 'user',
    parts: [{ text: promptWithMeta }],
  });

  let lastError: any = null;

  // Try discovered models in order until one succeeds
  for (const candidateModel of validModels) {
    try {
      const model = genAI.getGenerativeModel({
        model: candidateModel,
        systemInstruction: SYSTEM_INSTRUCTION,
      });

      const result = await model.generateContentStream({
        contents: formattedHistory,
      });

      // Record request timestamp for rate limiting on success
      recordRequestTimestamp();

      let fullResponseText = '';

      async function* generateStreamChunks() {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          fullResponseText += text;
          yield text;
        }
      }

      return {
        stream: generateStreamChunks(),
        getFullText: async () => {
          if (!fullResponseText) {
            const response = await result.response;
            fullResponseText = response.text();
          }
          return fullResponseText;
        },
      };
    } catch (error: any) {
      console.warn(`Attempt with candidate model ${candidateModel} failed:`, error?.message || error);
      lastError = error;

      // Handle 429 Too Many Requests / Resource Exhausted from Google API
      if (
        error?.status === 429 ||
        error?.message?.includes('429') ||
        error?.message?.includes('RESOURCE_EXHAUSTED') ||
        error?.message?.includes('Quota exceeded')
      ) {
        throw new Error('API_RATE_LIMIT_EXCEEDED');
      }

      // If it's an API Key invalid error, stop fallback immediately
      if (
        error?.message?.includes('API_KEY_INVALID') ||
        error?.status === 400 ||
        error?.status === 403 ||
        error?.message?.includes('API key not valid')
      ) {
        throw new Error('INVALID_API_KEY');
      }

      // If 404 or unsupported method, continue to next candidate
      if (
        error?.message?.includes('404') ||
        error?.status === 404 ||
        error?.message?.includes('not found') ||
        error?.message?.includes('not supported')
      ) {
        continue;
      }

      throw error;
    }
  }

  // If all candidates failed
  if (lastError?.message?.includes('404') || lastError?.message?.includes('not found')) {
    throw new Error('MODEL_NOT_FOUND');
  }
  throw lastError;
}

/**
 * Extracts follow-up suggestions from Gemini output if present.
 */
export function extractFollowUpSuggestions(text: string): string[] {
  const defaultSuggestions = [
    '⚡ Make this itinerary cheaper',
    '🏨 Recommend top boutique hotels',
    '✈️ Find cheapest flight routes',
    '🗺️ Add 2 extra days for exploration'
  ];

  const followUpMatch = text.match(/\*\*Follow-up suggestions:\*\*([\s\S]*?)$/i);
  if (!followUpMatch) return defaultSuggestions;

  const lines = followUpMatch[1]
    .split('\n')
    .map((l) => l.replace(/^[\s*-]+/, '').trim())
    .filter((l) => l.length > 3 && l.length < 100);

  return lines.length > 0 ? lines.slice(0, 4) : defaultSuggestions;
}
