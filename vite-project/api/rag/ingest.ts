import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';
import { chunkMarkdown } from '../../src/services/chunker.js';
import { upsertChunksToPinecone } from '../../server/services/pineconeService.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use POST or GET.' });
  }

  try {
    let dataPath = path.join(process.cwd(), 'data', 'japan.md');
    if (!fs.existsSync(dataPath)) {
      dataPath = path.join(__dirname, '..', '..', 'data', 'japan.md');
    }

    if (!fs.existsSync(dataPath)) {
      return res.status(404).json({
        error: `Source data file not found at ${dataPath}`,
      });
    }

    const markdown = fs.readFileSync(dataPath, 'utf-8');
    const chunks = chunkMarkdown(markdown, 'japan.md', 'Japan');

    if (chunks.length === 0) {
      return res.status(400).json({
        error: 'No chunks generated from source data.',
      });
    }

    const upsertedCount = await upsertChunksToPinecone(chunks);

    return res.status(200).json({
      success: true,
      processed: chunks.length,
      upserted: upsertedCount,
      chunks: chunks.map((c) => ({ id: c.id, section: c.section })),
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
