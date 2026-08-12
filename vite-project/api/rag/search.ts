import type { VercelRequest, VercelResponse } from '@vercel/node';
import { searchChunksInPinecone } from '../../server/services/pineconeService.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use POST or GET.' });
  }

  try {
    let queryText = '';

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      queryText = body?.query || '';
    } else {
      queryText = (req.query?.query as string) || '';
    }

    if (!queryText || !queryText.trim()) {
      return res.status(400).json({
        error: 'Missing query. Provide a JSON body { "query": "your question here" } or ?query=...',
      });
    }

    const matches = await searchChunksInPinecone(queryText.trim(), 3);

    return res.status(200).json({ matches });
  } catch (error: any) {
    console.error('Search error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to perform semantic vector search',
    });
  }
}
