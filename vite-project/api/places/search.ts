import type { VercelRequest, VercelResponse } from '@vercel/node';
import { searchPlaces } from '../../server/services/placesService.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use POST or GET.' });
  }

  try {
    let query = '';
    let maxResults = 5;

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      query = body?.query || '';
      if (typeof body?.maxResults === 'number') maxResults = body.maxResults;
    } else {
      query = (req.query?.query as string) || '';
      if (req.query?.maxResults) maxResults = parseInt(req.query.maxResults as string, 10) || 5;
    }

    if (!query || typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({ error: 'Missing or invalid "query" string parameter.' });
    }

    const result = await searchPlaces(query, maxResults);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Places API route error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to complete places search.',
    });
  }
}
