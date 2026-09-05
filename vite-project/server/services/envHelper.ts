import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Safely resolves server-side environment variables from process.env or .env.local
 */
export function getServerEnv(key: string): string {
  if (process.env[key]) {
    return process.env[key]!;
  }

  const envPaths = [
    path.join(process.cwd(), '.env.local'),
    path.join(process.cwd(), 'vite-project', '.env.local'),
    path.join(__dirname, '..', '..', '.env.local'),
    path.join(__dirname, '..', '..', '..', '.env.local'),
  ];

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      try {
        const content = fs.readFileSync(envPath, 'utf-8');
        const regex = new RegExp(`^${key}=(.*)$`, 'm');
        const match = content.match(regex);
        if (match && match[1]) {
          const val = match[1].trim().replace(/^["']|["']$/g, '');
          process.env[key] = val;
          return val;
        }
      } catch {
        // Continue searching next candidate path
      }
    }
  }

  return '';
}
