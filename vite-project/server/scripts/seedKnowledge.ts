import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chunkMarkdown, ChunkRecord } from '../../src/services/chunker.js';
import { upsertChunksToPinecone } from '../services/pineconeService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Recursively scans directory for markdown files.
 */
function getMarkdownFiles(dirPath: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dirPath)) return results;

  const list = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const dirent of list) {
    const fullPath = path.join(dirPath, dirent.name);
    if (dirent.isDirectory()) {
      results = results.concat(getMarkdownFiles(fullPath));
    } else if (dirent.isFile() && dirent.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }

  return results;
}

async function runSeed() {
  console.log('==================================================');
  console.log(' travAI Pinecone Knowledge Seeding Tool');
  console.log('==================================================');

  // Search candidate dataset locations (.tmp/japan or data/japan)
  const candidateDirs = [
    path.join(process.cwd(), '.tmp', 'japan'),
    path.join(process.cwd(), 'vite-project', '.tmp', 'japan'),
    path.join(__dirname, '..', '..', '.tmp', 'japan'),
    path.join(process.cwd(), 'data', 'japan'),
    path.join(process.cwd(), 'vite-project', 'data', 'japan'),
  ];

  let datasetDir = '';
  for (const dir of candidateDirs) {
    if (fs.existsSync(dir)) {
      datasetDir = dir;
      break;
    }
  }

  if (!datasetDir) {
    console.error('ERROR: Could not locate temporary dataset directory.');
    console.error('Please place your Markdown dataset files under .tmp/japan/');
    process.exit(1);
  }

  console.log(`Source dataset location: ${datasetDir}`);

  const files = getMarkdownFiles(datasetDir);
  if (files.length === 0) {
    console.error(`ERROR: No .md files found in ${datasetDir}`);
    process.exit(1);
  }

  console.log(`Found ${files.length} Markdown dataset files.`);

  const allChunks: ChunkRecord[] = [];
  const fileStats: { file: string; chunks: number }[] = [];

  for (const filePath of files) {
    const markdown = fs.readFileSync(filePath, 'utf-8');
    const relPath = path.relative(datasetDir, filePath).replace(/\\/g, '/');
    const fileName = path.basename(filePath, '.md');

    const chunks = chunkMarkdown(
      markdown,
      'Japan National Tourism Organization (JNTO)',
      fileName
    );

    allChunks.push(...chunks);
    fileStats.push({ file: relPath, chunks: chunks.length });
    console.log(`  - Loaded [${relPath}]: ${chunks.length} chunks`);
  }

  console.log(`\nGenerated ${allChunks.length} chunks across ${files.length} documents.`);
  console.log('Upserting chunks to Pinecone vector database...');

  const indexName = process.env.PINECONE_INDEX_NAME || 'travai-knowledge';
  const namespace = 'knowledge';

  try {
    const totalUpserted = await upsertChunksToPinecone(allChunks, 100);

    console.log('\n==================================================');
    console.log(' SEED COMPLETED SUCCESSFULLY');
    console.log('==================================================');
    console.log(`Files loaded:      ${files.length}`);
    console.log(`Chunks generated:  ${allChunks.length}`);
    console.log(`Records upserted:  ${totalUpserted}`);
    console.log(`Pinecone Index:    ${indexName}`);
    console.log(`Pinecone Namespace:${namespace}`);
    console.log(`Errors:            0`);
    console.log('==================================================\n');
  } catch (upsertErr: any) {
    console.error('\n==================================================');
    console.error(' SEEDING FAILED WITH ERROR');
    console.error('==================================================');
    console.error('Upsert Error:', upsertErr?.message || upsertErr);
    console.error('==================================================\n');
    process.exit(1);
  }
}

runSeed().catch((err) => {
  console.error('FATAL SEEDING ERROR:', err);
  process.exit(1);
});
