export interface ChunkRecord {
  id: string;
  _id: string;
  text: string;
  source: string;
  sourceUrl: string;
  country: string;
  region: string;
  prefecture: string;
  destination: string;
  section: string;
  lastVerified: string;
}

/**
 * Helper to slugify section titles and identifiers for deterministic IDs.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Parses simple YAML frontmatter delimited by `---` at start of Markdown string.
 */
function parseFrontmatter(markdown: string): {
  frontmatter: Record<string, string>;
  body: string;
} {
  const frontmatter: Record<string, string> = {};
  const trimmed = markdown.trim();

  if (!trimmed.startsWith('---')) {
    return { frontmatter, body: markdown };
  }

  const endIndex = trimmed.indexOf('\n---', 3);
  if (endIndex === -1) {
    return { frontmatter, body: markdown };
  }

  const yamlBlock = trimmed.slice(3, endIndex).trim();
  const body = trimmed.slice(endIndex + 4).trim();

  for (const line of yamlBlock.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx !== -1) {
      const key = line.slice(0, colonIdx).trim();
      const val = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');
      if (key && val) {
        frontmatter[key] = val;
      }
    }
  }

  return { frontmatter, body };
}

/**
 * Subdivides large text blocks into paragraph-bounded chunks of max ~1200 chars.
 */
function splitLargeSection(content: string, maxLen = 1200): string[] {
  if (content.length <= maxLen) {
    return [content];
  }

  const paragraphs = content.split(/\n\s*\n/);
  const chunks: string[] = [];
  let current = '';

  for (const p of paragraphs) {
    const paragraph = p.trim();
    if (!paragraph) continue;

    if ((current + '\n\n' + paragraph).length <= maxLen) {
      current = current ? current + '\n\n' + paragraph : paragraph;
    } else {
      if (current) {
        chunks.push(current);
      }
      current = paragraph;
    }
  }

  if (current) {
    chunks.push(current);
  }

  return chunks.length > 0 ? chunks : [content];
}

/**
 * Splits markdown document by `## ` headings into structured chunks with frontmatter metadata.
 *
 * @param rawMarkdown - Full raw text of the markdown file.
 * @param defaultSource - Fallback source identifier if frontmatter missing.
 * @param defaultDestination - Fallback destination identifier if frontmatter missing.
 * @returns Array of ChunkRecord objects with deterministic IDs.
 */
export function chunkMarkdown(
  rawMarkdown: string,
  defaultSource = 'Japan National Tourism Organization',
  defaultDestination = 'Japan'
): ChunkRecord[] {
  if (!rawMarkdown || !rawMarkdown.trim()) {
    return [];
  }

  const { frontmatter, body } = parseFrontmatter(rawMarkdown);

  const source = frontmatter.source || defaultSource;
  const sourceUrl = frontmatter.sourceUrl || 'https://www.japan.travel/en/';
  const country = frontmatter.country || 'Japan';
  const region = frontmatter.region || 'National';
  const prefecture = frontmatter.prefecture || defaultDestination;
  const destination = frontmatter.destination || defaultDestination;
  const lastVerified = frontmatter.lastVerified || '2026-08-12';

  // Split by level-2 markdown headings (`## `)
  const rawSections = body.split(/^##\s+/m);
  const chunks: ChunkRecord[] = [];

  for (const rawSection of rawSections) {
    const trimmed = rawSection.trim();
    if (!trimmed) continue;

    // Skip top level title if present
    if (trimmed.startsWith('# ')) {
      const headerLines = trimmed.split('\n');
      const remaining = headerLines.slice(1).join('\n').trim();
      if (!remaining) continue;
    }

    const lines = trimmed.split('\n');
    let sectionTitle = lines[0].trim().replace(/^#+\s*/, '');
    let sectionContent = lines.slice(1).join('\n').trim();

    if (!sectionTitle && lines.length > 0) {
      sectionTitle = 'Overview';
      sectionContent = trimmed;
    }

    if (!sectionContent) continue;

    const destSlug = slugify(destination);
    const prefSlug = slugify(prefecture);
    const regSlug = slugify(region);
    const secSlug = slugify(sectionTitle);

    const baseSlug = `japan-${regSlug}-${prefSlug}-${destSlug}-${secSlug}`
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const subChunks = splitLargeSection(sectionContent, 1200);

    subChunks.forEach((subText, idx) => {
      const deterministicId = subChunks.length > 1 ? `${baseSlug}-p${idx + 1}` : baseSlug;
      const textToEmbed = `${destination} (${prefecture}, ${region}) - ${sectionTitle}\n${subText}`;

      chunks.push({
        id: deterministicId,
        _id: deterministicId,
        text: textToEmbed,
        source,
        sourceUrl,
        country,
        region,
        prefecture,
        destination,
        section: sectionTitle,
        lastVerified,
      });
    });
  }

  return chunks;
}
