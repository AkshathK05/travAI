import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatMessage } from '../types';

const API_KEY_STORAGE_KEY = 'travai_gemini_api_key';

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
 * Candidate models to try in order if one returns 404 model not found.
 */
const GET_CANDIDATE_MODELS = (modelName: string): string[] => {
  const lower = modelName.toLowerCase();
  
  if (lower.includes('pro')) {
    return ['gemini-1.5-pro-latest', 'gemini-1.5-pro', 'gemini-2.0-flash-exp', 'gemini-1.5-flash-latest'];
  }
  if (lower.includes('2.0')) {
    return ['gemini-2.0-flash', 'gemini-2.0-flash-exp', 'gemini-1.5-flash-latest', 'gemini-1.5-flash'];
  }
  // Default flash fallback chain
  return [
    'gemini-1.5-flash-latest',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-2.5-flash',
    'gemini-1.5-pro-latest'
  ];
};

/**
 * Sends a query to the Gemini model and yields chunks as they stream.
 * Automatically tries fallback model names if 404 is encountered.
 */
export async function streamGeminiQuery(
  userQuery: string,
  chatHistory: ChatMessage[] = [],
  metadata?: { budget?: string; travelers?: string },
  modelName: string = 'Gemini 2.5 Flash',
  overrideApiKey?: string
): Promise<StreamResponseResult> {
  const apiKey = overrideApiKey || getStoredApiKey();

  if (!apiKey) {
    throw new Error('MISSING_API_KEY');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const candidates = GET_CANDIDATE_MODELS(modelName);

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

  // Try candidate models in order until one succeeds
  for (const candidateModel of candidates) {
    try {
      const model = genAI.getGenerativeModel({
        model: candidateModel,
        systemInstruction: SYSTEM_INSTRUCTION,
      });

      const result = await model.generateContentStream({
        contents: formattedHistory,
      });

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
      console.warn(`Model candidate ${candidateModel} failed:`, error?.message || error);
      lastError = error;

      // If it's an API Key invalid error, stop fallback immediately
      if (
        error?.message?.includes('API_KEY_INVALID') ||
        error?.status === 400 ||
        error?.status === 403 ||
        error?.message?.includes('API key not valid')
      ) {
        throw new Error('INVALID_API_KEY');
      }

      // If it's a 404 model not found, continue to next candidate
      if (error?.message?.includes('404') || error?.status === 404 || error?.message?.includes('not found')) {
        continue;
      }

      // For other errors, throw immediately
      throw error;
    }
  }

  // If all candidates failed
  if (lastError?.message?.includes('404')) {
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
