import type { VercelRequest, VercelResponse } from '@vercel/node';
import { searchChunksInPinecone } from '../../server/services/pineconeService.js';

function cleanStr(val: unknown, maxLen = 300): string {
  if (typeof val !== 'string') return '';
  return val.replace(/[\x00-\x1F\x7F<>]/g, '').trim().slice(0, maxLen);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use POST or GET.' });
  }

  try {
    let rawQuery = '';

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      rawQuery = body?.query || '';
    } else {
      rawQuery = (req.query?.query as string) || '';
    }

    const queryText = cleanStr(rawQuery, 300);

    if (!queryText) {
      return res.status(400).json({
        error: 'Missing query. Provide a JSON body { "query": "your question here" } or ?query=...',
      });
    }

    const matches = await searchChunksInPinecone(queryText, 3);

    return res.status(200).json({ matches });
  } catch (error: any) {
    console.error('Search error:', error);
    return res.status(500).json({
      error: 'An internal error occurred while performing semantic vector search.',
      matches: [],
    });
  }
}
