import type { VercelRequest, VercelResponse } from '@vercel/node';
import { searchPlaces } from '../../server/services/placesService.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { query, maxResults } = req.body || {};

    if (!query || typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({ error: 'Missing or invalid "query" string parameter.' });
    }

    const limit = typeof maxResults === 'number' ? maxResults : 5;
    const result = await searchPlaces(query, limit);

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Places API route error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to complete places search.',
    });
  }
}
