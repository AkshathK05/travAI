/**
 * Security utilities for input sanitization and URL validation.
 */

/**
 * Validates and sanitizes external URLs to prevent XSS (e.g. javascript: or data: URIs).
 * Only permits HTTP and HTTPS protocols.
 */
export function sanitizeUrl(url?: string | null): string {
  if (!url || typeof url !== 'string') {
    return '#';
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return '#';
  }

  try {
    // Relative anchors or valid HTTP/HTTPS URLs
    if (trimmed.startsWith('/') || trimmed.startsWith('#')) {
      return trimmed;
    }

    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return trimmed;
    }
  } catch {
    // If URL parsing fails, reject
    return '#';
  }

  return '#';
}

/**
 * Sanitizes user prompt input to neutralize delimiter spoofing and control characters.
 */
export function sanitizeUserInput(input: string, maxLength = 2000): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input
    // Remove control characters (except newline, carriage return, tab)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Neutralize prompt instruction boundary attempts
    .replace(/---+/g, ' - ')
    .replace(/===+/g, ' = ')
    .replace(/```(?:system|instruction|developer)?/gi, "'''")
    .trim()
    .slice(0, maxLength);
}
