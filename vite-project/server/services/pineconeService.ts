import { Pinecone } from '@pinecone-database/pinecone';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ChunkRecord } from '../../src/services/chunker.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'travai-knowledge';
const NAMESPACE_NAME = 'knowledge';

/**
 * Ensures process.env.PINECONE_API_KEY is populated locally if running without vercel env injection.
 */
function getApiKey(): string {
  if (process.env.PINECONE_API_KEY) {
    return process.env.PINECONE_API_KEY;
  }

  // Attempt to load from .env.local
  const envPaths = [
    path.join(process.cwd(), '.env.local'),
    path.join(process.cwd(), 'vite-project', '.env.local'),
    path.join(__dirname, '..', '..', '.env.local'),
  ];

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8');
      for (const line of envContent.split('\n')) {
        const match = line.trim().match(/^PINECONE_API_KEY=(.+)$/);
        if (match) {
          const key = match[1].trim().replace(/^["']|["']$/g, '');
          process.env.PINECONE_API_KEY = key;
          return key;
        }
      }
    }
  }

  throw new Error(
    'PINECONE_API_KEY environment variable is missing. Ensure it is set in .env.local or environment variables.'
  );
}

/**
 * Initializes Pinecone client and target namespace.
 */
export function getKnowledgeNamespace() {
  const apiKey = getApiKey();
  const pc = new Pinecone({ apiKey });
  return pc.index(INDEX_NAME).namespace(NAMESPACE_NAME);
}

export interface PineconeMatch {
  id: string;
  score?: number;
  text: string;
  source: string;
  sourceUrl?: string;
  country?: string;
  region?: string;
  prefecture?: string;
  destination: string;
  section: string;
  lastVerified?: string;
}

/**
 * Upserts markdown chunk records into Pinecone using integrated embeddings in batches.
 */
export async function upsertChunksToPinecone(chunks: ChunkRecord[], batchSize = 100) {
  const ns = getKnowledgeNamespace();
  let totalUpserted = 0;

  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    const records = batch.map((c) => ({
      id: c.id,
      text: c.text,
      source: c.source,
      sourceUrl: c.sourceUrl,
      country: c.country,
      region: c.region,
      prefecture: c.prefecture,
      destination: c.destination,
      section: c.section,
      lastVerified: c.lastVerified,
    }));

    await ns.upsertRecords({ records });
    totalUpserted += records.length;
  }

  return totalUpserted;
}

/**
 * Performs integrated embedding semantic search on the Pinecone knowledge namespace.
 */
export async function searchChunksInPinecone(
  queryText: string,
  topK = 3
): Promise<PineconeMatch[]> {
  const ns = getKnowledgeNamespace();

  const response = await ns.searchRecords({
    query: {
      inputs: { text: queryText },
      topK,
    },
    fields: [
      'text',
      'source',
      'sourceUrl',
      'country',
      'region',
      'prefecture',
      'destination',
      'section',
      'lastVerified',
    ],
  });

  const hits = response.result?.hits || [];

  return hits.map((hit) => {
    const fields = (hit.fields || {}) as Record<string, any>;
    return {
      id: hit.id,
      score: hit.score,
      text: fields.text || '',
      source: fields.source || '',
      sourceUrl: fields.sourceUrl || '',
      country: fields.country || 'Japan',
      region: fields.region || '',
      prefecture: fields.prefecture || '',
      destination: fields.destination || '',
      section: fields.section || '',
      lastVerified: fields.lastVerified || '',
    };
  });
}
