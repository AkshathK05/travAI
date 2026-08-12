import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatMessage } from '../types';

const API_KEY_STORAGE_KEY = 'travai_gemini_api_key';

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

const SYSTEM_INSTRUCTION = 'Output ONLY your direct response to the user. Never output internal thoughts, preambles, reasoning steps, goals, or draft options.';

export interface StreamResponseResult {
  stream: AsyncGenerator<string, void, unknown>;
  getFullText: () => Promise<string>;
}

/**
 * Cleans response text to strip any internal preambles or draft monologues if generated.
 */
export function cleanResponseText(rawText: string): string {
  if (!rawText) return '';

  // If the model outputted chain-of-thought preambles or draft options
  if (
    rawText.includes('The user said') ||
    rawText.includes('Draft 1') ||
    rawText.includes('Draft 2') ||
    rawText.includes('Goal:') ||
    rawText.includes('This is a standard greeting')
  ) {
    // Extract the final quoted response if available
    const quotes = rawText.match(/"([^"]{3,300})"/g);
    if (quotes && quotes.length > 0) {
      const lastQuote = quotes[quotes.length - 1].replace(/^"/, '').replace(/"$/, '').trim();
      if (lastQuote.length > 2) {
        return lastQuote;
      }
    }

    // Or extract the final non-empty line
    const lines = rawText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.toLowerCase().startsWith('draft') && !l.toLowerCase().startsWith('goal:') && !l.toLowerCase().startsWith('the user said'));

    if (lines.length > 0) {
      return lines[lines.length - 1].replace(/^"/, '').replace(/"$/, '').trim();
    }
  }

  return rawText;
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
 * Sends a query directly to the Gemini model.
 */
export async function streamGeminiQuery(
  userQuery: string,
  _chatHistory: ChatMessage[] = [],
  _metadata?: { budget?: string; travelers?: string },
  _modelName: string = 'Gemini 2.5 Flash',
  overrideApiKey?: string
): Promise<StreamResponseResult> {
  const apiKey = overrideApiKey || getStoredApiKey();

  if (!apiKey) {
    throw new Error('MISSING_API_KEY');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const validModels = await discoverValidModelNames(apiKey);

  const contents = [
    {
      role: 'user',
      parts: [{ text: userQuery }],
    },
  ];

  let lastError: any = null;

  for (const candidateModel of validModels) {
    try {
      const model = genAI.getGenerativeModel({
        model: candidateModel,
        systemInstruction: SYSTEM_INSTRUCTION,
      });

      const result = await model.generateContentStream({
        contents,
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
          return cleanResponseText(fullResponseText);
        },
      };
    } catch (error: any) {
      console.warn(`Attempt with candidate model ${candidateModel} failed:`, error?.message || error);
      lastError = error;

      const errStr = (error?.message || '').toLowerCase();

      if (
        errStr.includes('api_key_invalid') ||
        errStr.includes('api key not valid') ||
        errStr.includes('invalid api key') ||
        errStr.includes('unauthorized')
      ) {
        throw new Error('INVALID_API_KEY');
      }

      if (
        errStr.includes('404') ||
        errStr.includes('429') ||
        errStr.includes('not found') ||
        errStr.includes('not supported') ||
        error?.status === 404 ||
        error?.status === 429
      ) {
        continue;
      }

      throw error;
    }
  }

  throw lastError || new Error('MODEL_NOT_FOUND');
}

export function extractFollowUpSuggestions(text: string): string[] {
  const followUpMatch = text.match(/\*\*Follow-up suggestions:\*\*([\s\S]*?)$/i);
  if (!followUpMatch) return [];

  const lines = followUpMatch[1]
    .split('\n')
    .map((l) => l.replace(/^[\s*-]+/, '').trim())
    .filter((l) => l.length > 3 && l.length < 100);

  return lines.length > 0 ? lines.slice(0, 4) : [];
}
