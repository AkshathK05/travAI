import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chunkMarkdown, ChunkRecord } from '../../src/services/chunker.js';
import { upsertChunksToPinecone } from '../../server/services/pineconeService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Recursively scans directory for markdown files.
 */
function getAllMarkdownFiles(dirPath: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dirPath)) return results;

  const list = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const dirent of list) {
    const fullPath = path.join(dirPath, dirent.name);
    if (dirent.isDirectory()) {
      results = results.concat(getAllMarkdownFiles(fullPath));
    } else if (dirent.isFile() && dirent.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }

  return results;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use POST or GET.' });
  }

  try {
    let baseDir = path.join(process.cwd(), '.tmp', 'japan');
    if (!fs.existsSync(baseDir)) {
      baseDir = path.join(process.cwd(), 'data', 'japan');
    }
    if (!fs.existsSync(baseDir)) {
      baseDir = path.join(__dirname, '..', '..', '.tmp', 'japan');
    }
    if (!fs.existsSync(baseDir)) {
      baseDir = path.join(__dirname, '..', '..', 'data', 'japan');
    }

    let files = getAllMarkdownFiles(baseDir);

    // Fallback if data/japan directory not present but single file is
    if (files.length === 0) {
      let legacyFile = path.join(process.cwd(), 'data', 'japan.md');
      if (!fs.existsSync(legacyFile)) {
        legacyFile = path.join(__dirname, '..', '..', 'data', 'japan.md');
      }
      if (fs.existsSync(legacyFile)) {
        files = [legacyFile];
      }
    }

    if (files.length === 0) {
      return res.status(404).json({
        error: `No markdown data files found under ${baseDir}`,
      });
    }

    const allChunks: ChunkRecord[] = [];
    const fileSummaries: { file: string; chunks: number }[] = [];

    for (const filePath of files) {
      const markdown = fs.readFileSync(filePath, 'utf-8');
      const relativePath = path.relative(baseDir, filePath).replace(/\\/g, '/');
      const fileName = path.basename(filePath, '.md');

      const chunks = chunkMarkdown(
        markdown,
        'Japan National Tourism Organization (JNTO)',
        fileName
      );

      allChunks.push(...chunks);
      fileSummaries.push({ file: relativePath, chunks: chunks.length });
    }

    if (allChunks.length === 0) {
      return res.status(400).json({
        error: 'No valid chunks generated from source data files.',
      });
    }

    const totalUpserted = await upsertChunksToPinecone(allChunks, 100);

    return res.status(200).json({
      success: true,
      filesProcessed: files.length,
      chunksCreated: allChunks.length,
      recordsUpserted: totalUpserted,
      files: fileSummaries,
      errors: [],
    });
  } catch (error: any) {
    console.error('Ingestion error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to complete RAG ingestion',
    });
  }
}
