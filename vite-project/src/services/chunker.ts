export interface ChunkRecord {
  id: string;
  _id: string;
  text: string;
  source: string;
  destination: string;
  section: string;
}

/**
 * Helper to slugify section titles for deterministic IDs.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Splits markdown document by `## ` headings into structured chunks.
 *
 * @param markdown - Full raw text of the markdown file.
 * @param source - File name or identifier (e.g. "japan.md").
 * @param destination - Target destination name (e.g. "Japan").
 * @returns Array of chunk objects with deterministic IDs.
 */
export function chunkMarkdown(
  markdown: string,
  source: string,
  destination: string
): ChunkRecord[] {
  if (!markdown || !markdown.trim()) {
    return [];
  }

  // Split by level-2 markdown headings (`## `)
  const sections = markdown.split(/^##\s+/m);
  const chunks: ChunkRecord[] = [];

  for (const rawSection of sections) {
    const trimmed = rawSection.trim();
    if (!trimmed) continue;

    // If section starts with `# ` (e.g. title line), skip header or extract
    if (trimmed.startsWith('# ')) {
      continue;
    }

    const lines = trimmed.split('\n');
    const sectionTitle = lines[0].trim();
    const sectionContent = lines.slice(1).join('\n').trim();

    if (!sectionTitle || !sectionContent) continue;

    const sectionSlug = slugify(sectionTitle);
    const destinationSlug = slugify(destination);
    const deterministicId = `${destinationSlug}-${sectionSlug}`;

    const textToEmbed = `${destination} - ${sectionTitle}\n${sectionContent}`;

    chunks.push({
      id: deterministicId,
      _id: deterministicId,
      text: textToEmbed,
      source: source,
      destination: destination,
      section: sectionTitle,
    });
  }

  return chunks;
}
