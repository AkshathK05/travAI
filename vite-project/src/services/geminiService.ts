import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatMessage } from '../types';

const API_KEY_STORAGE_KEY = 'travai_gemini_api_key';

// Rate limiting configuration
const MAX_REQUESTS_PER_MINUTE = 10;
const MIN_COOLDOWN_MS = 2000;
const requestTimestamps: number[] = [];

/**
 * Checks client-side rate limit rules before dispatching an API call.
 */
export function checkRateLimit(): { allowed: boolean; remainingSeconds?: number; reason?: string } {
  const now = Date.now();
  while (requestTimestamps.length > 0 && requestTimestamps[0] <= now - 60000) {
    requestTimestamps.shift();
  }

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

function recordRequestTimestamp(): void {
  requestTimestamps.push(Date.now());
}

export function getStoredApiKey(): string {
  return (
    localStorage.getItem(API_KEY_STORAGE_KEY) ||
    (import.meta.env.VITE_GEMINI_API_KEY as string) ||
    ''
  );
}

export function saveApiKey(key: string): void {
  localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
}

export function removeApiKey(): void {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
}

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

  return [
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash-8b',
    'gemini-2.0-flash-exp',
    'gemini-pro',
    'gemini-1.5-pro'
  ];
}

/**
 * Sends a query to the Gemini model and yields chunks as they stream.
 */
export async function streamGeminiQuery(
  userQuery: string,
  chatHistory: ChatMessage[] = [],
  metadata?: { budget?: string; travelers?: string },
  modelName: string = 'Gemini 2.5 Flash',
  overrideApiKey?: string
): Promise<StreamResponseResult> {
  const rateLimitStatus = checkRateLimit();
  if (!rateLimitStatus.allowed) {
    throw new Error(`RATE_LIMIT_EXCEEDED: ${rateLimitStatus.reason}`);
  }

  const apiKey = overrideApiKey || getStoredApiKey();

  if (!apiKey) {
    throw new Error('MISSING_API_KEY');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const validModels = await discoverValidModelNames(apiKey);

  // Prepare message history for Gemini chat format
  const formattedHistory = chatHistory
    .filter((msg) => msg.content && msg.content.trim().length > 0)
    .map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

  let promptWithMeta = userQuery;
  if (metadata?.budget || metadata?.travelers) {
    promptWithMeta += `\n\n[Travel Parameters: Budget=${metadata.budget || 'Not specified'}, Travelers=${metadata.travelers || 'Not specified'}]`;
  }

  formattedHistory.push({
    role: 'user',
    parts: [{ text: promptWithMeta }],
  });

  let lastError: any = null;

  for (const candidateModel of validModels) {
    try {
      // Configure model with system instruction safely formatted
      const model = genAI.getGenerativeModel({
        model: candidateModel,
        systemInstruction: {
          role: 'system',
          parts: [{ text: SYSTEM_INSTRUCTION }]
        }
      });

      const result = await model.generateContentStream({
        contents: formattedHistory,
      });

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

      const errStr = (error?.message || '').toLowerCase();

      // Only throw INVALID_API_KEY if error explicitly mentions invalid API key
      if (
        errStr.includes('api_key_invalid') ||
        errStr.includes('api key not valid') ||
        errStr.includes('invalid api key') ||
        errStr.includes('unauthorized')
      ) {
        throw new Error('INVALID_API_KEY');
      }

      if (
        error?.status === 429 ||
        errStr.includes('429') ||
        errStr.includes('resource_exhausted') ||
        errStr.includes('quota exceeded')
      ) {
        throw new Error('API_RATE_LIMIT_EXCEEDED');
      }

      // Continue trying other candidate models if 404 or payload/system instruction issue
      if (
        errStr.includes('404') ||
        errStr.includes('not found') ||
        errStr.includes('not supported') ||
        error?.status === 404
      ) {
        continue;
      }

      throw error;
    }
  }

  throw lastError || new Error('MODEL_NOT_FOUND');
}

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
