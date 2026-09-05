import type { VercelRequest, VercelResponse } from '@vercel/node';
import { searchFlights } from '../../server/services/flightsService.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use POST or GET.' });
  }

  try {
    let params: any = {};

    if (req.method === 'POST') {
      params = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    } else {
      params = req.query || {};
    }

    const result = await searchFlights({
      origin: params.origin,
      destination: params.destination || params.query,
      departureDate: params.departureDate,
      travelers: params.travelers,
      currency: params.currency,
      query: params.query,
    });

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Flights API route error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to search flights.',
      flights: [],
    });
  }
}
