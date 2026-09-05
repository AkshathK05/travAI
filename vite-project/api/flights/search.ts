import type { VercelRequest, VercelResponse } from '@vercel/node';
import { searchFlights } from '../../server/services/flightsService.js';

function cleanStr(val: unknown, maxLen = 100): string {
  if (typeof val !== 'string') return '';
  return val.replace(/[\x00-\x1F\x7F<>]/g, '').trim().slice(0, maxLen);
}

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

    const sanitizedOrigin = cleanStr(params.origin, 100);
    const sanitizedDestination = cleanStr(params.destination || params.query, 100);
    const sanitizedQuery = cleanStr(params.query, 300);
    const sanitizedCurrency = cleanStr(params.currency, 10);
    const sanitizedTravelers = cleanStr(params.travelers, 50);
    const sanitizedDepartureDate = cleanStr(params.departureDate, 30);

    const result = await searchFlights({
      origin: sanitizedOrigin,
      destination: sanitizedDestination || 'Tokyo',
      departureDate: sanitizedDepartureDate,
      travelers: sanitizedTravelers,
      currency: sanitizedCurrency,
      query: sanitizedQuery,
    });

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Flights API route error:', error);
    return res.status(500).json({
      error: 'An internal error occurred while searching flight schedules.',
      flights: [],
    });
  }
}
