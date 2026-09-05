import type { VercelRequest, VercelResponse } from '@vercel/node';
import { searchPlaces } from '../../server/services/placesService.js';

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
    let maxResults = 5;

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      rawQuery = body?.query || '';
      if (typeof body?.maxResults === 'number') maxResults = body.maxResults;
    } else {
      rawQuery = (req.query?.query as string) || '';
      if (req.query?.maxResults) maxResults = parseInt(req.query.maxResults as string, 10) || 5;
    }

    const query = cleanStr(rawQuery, 300);
    const clampedLimit = Math.min(Math.max(1, maxResults), 10);

    if (!query) {
      return res.status(400).json({ error: 'Missing or invalid "query" string parameter.' });
    }

    const result = await searchPlaces(query, clampedLimit);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Places API route error:', error);
    return res.status(500).json({
      error: 'An internal error occurred while searching places.',
      places: [],
      activities: [],
    });
  }
}
