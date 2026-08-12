import fs from 'fs';
import path from 'path';

export interface NormalizedPlace {
  id: string;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  mapsUrl: string | null;
  type: string;
  typeDisplayName: string;
}

export interface PlaceSearchResponse {
  places: NormalizedPlace[];
}

// In-memory cache to respect public Overpass API infrastructure
const cache = new Map<string, { timestamp: number; data: PlaceSearchResponse }>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// List of public Overpass API mirrors for high availability & rate-limit fallback
const DEFAULT_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.nchc.org.tw/api/interpreter',
];

/**
 * Returns available Overpass API endpoints.
 */
function getOverpassEndpoints(): string[] {
  if (process.env.OVERPASS_API_URL) {
    return [process.env.OVERPASS_API_URL, ...DEFAULT_ENDPOINTS];
  }
  return DEFAULT_ENDPOINTS;
}

/**
 * Extracts target location name from natural language query.
 */
function extractLocation(query: string): string {
  const lower = query.toLowerCase();
  const knownLocations = [
    'kyoto',
    'fukuoka',
    'nagano',
    'hiroshima',
    'okinawa',
    'tokyo',
    'osaka',
    'nara',
    'sapporo',
    'hokkaido',
    'kanazawa',
    'kobe',
    'sendai',
    'takayama',
    'hakone',
    'nikko',
  ];

  for (const loc of knownLocations) {
    if (lower.includes(loc)) {
      return loc.charAt(0).toUpperCase() + loc.slice(1);
    }
  }

  return 'Kyoto';
}

/**
 * Generates Overpass QL statements based on query keywords.
 */
function buildOsmFilters(query: string): string[] {
  const lower = query.toLowerCase();
  const filters: string[] = [];

  if (lower.includes('temple') || lower.includes('shrine') || lower.includes('traditional')) {
    filters.push('["amenity"="place_of_worship"]');
    filters.push('["historic"]');
    filters.push('["tourism"="attraction"]');
  } else if (lower.includes('ramen') || lower.includes('restaurant') || lower.includes('food')) {
    filters.push('["amenity"="restaurant"]');
    filters.push('["amenity"="fast_food"]');
  } else if (lower.includes('hiking') || lower.includes('nature') || lower.includes('mountain')) {
    filters.push('["tourism"="attraction"]');
    filters.push('["natural"]');
    filters.push('["leisure"="park"]');
  } else if (lower.includes('historic') || lower.includes('history') || lower.includes('castle')) {
    filters.push('["historic"]');
    filters.push('["tourism"="attraction"]');
  } else if (lower.includes('beach') || lower.includes('sea') || lower.includes('coast')) {
    filters.push('["natural"="beach"]');
    filters.push('["tourism"="attraction"]');
  } else {
    filters.push('["tourism"="attraction"]');
    filters.push('["amenity"="place_of_worship"]');
    filters.push('["historic"]');
  }

  return filters;
}

/**
 * Performs open place search querying OpenStreetMap via Overpass API.
 *
 * @param query - Natural language place search query (e.g., "traditional temples in Kyoto")
 * @param maxResults - Maximum places to return (default 5, max 10)
 */
export async function searchPlaces(
  query: string,
  maxResults = 5
): Promise<PlaceSearchResponse> {
  if (!query || !query.trim()) {
    return { places: [] };
  }

  const normalizedQuery = query.trim().toLowerCase();
  const limit = Math.min(Math.max(1, maxResults), 10);
  const cacheKey = `${normalizedQuery}_${limit}`;

  // Check in-memory cache
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const location = extractLocation(query);
  const osmFilters = buildOsmFilters(query);
  const endpoints = getOverpassEndpoints();

  const unionStatements = osmFilters
    .map(
      (filter) => `
    node${filter}(area.searchArea);
    way${filter}(area.searchArea);`
    )
    .join('');

  const overpassQuery = `[out:json][timeout:25];
area["name:en"="${location}"]->.searchArea;
(
  ${unionStatements}
);
out center ${limit * 4};`;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'travAI-PlaceSearch/1.0 (https://travai.app)',
          'Accept': 'application/json',
        },
        body: `data=${encodeURIComponent(overpassQuery)}`,
      });

      if (!response.ok) {
        console.warn(`Overpass API endpoint ${endpoint} returned ${response.status}. Trying next mirror...`);
        continue;
      }

      const data = await response.json();
      const elements: any[] = data.elements || [];

      const places: NormalizedPlace[] = [];
      const seenNames = new Set<string>();

      for (const elem of elements) {
        const tags = elem.tags || {};
        const name = tags['name:en'] || tags.name;
        if (!name || seenNames.has(name)) continue;
        seenNames.add(name);

        const lat = elem.lat ?? elem.center?.lat ?? null;
        const lon = elem.lon ?? elem.center?.lon ?? null;

        const type =
          tags.amenity ||
          tags.tourism ||
          tags.historic ||
          tags.natural ||
          tags.leisure ||
          'poi';

        const typeDisplayName =
          tags.cuisine ? `Ramen / Restaurant (${tags.cuisine})` :
          tags.amenity ? `Amenity (${tags.amenity})` :
          tags.historic ? `Historic (${tags.historic})` :
          tags.tourism ? `Tourism (${tags.tourism})` :
          tags.natural ? `Natural (${tags.natural})` :
          'Point of Interest';

        const osmId = `${elem.type}/${elem.id}`;
        const mapsUrl =
          lat && lon
            ? `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=16/${lat}/${lon}`
            : `https://www.openstreetmap.org/${osmId}`;

        const addressParts = [
          tags['addr:suburb'] || tags['addr:district'],
          tags['addr:city'] || location,
          'Japan',
        ].filter(Boolean);

        places.push({
          id: osmId,
          name,
          address: addressParts.join(', '),
          latitude: lat,
          longitude: lon,
          mapsUrl,
          type,
          typeDisplayName,
        });

        if (places.length >= limit) break;
      }

      const result: PlaceSearchResponse = { places };
      cache.set(cacheKey, { timestamp: Date.now(), data: result });
      return result;
    } catch (error: any) {
      console.warn(`Error querying Overpass mirror ${endpoint}: ${error.message}`);
    }
  }

  return { places: [] };
}
