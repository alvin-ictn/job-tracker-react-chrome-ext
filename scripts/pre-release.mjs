import { mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const releasePath = join(__dirname, '..', 'release');

try {
  await mkdir(releasePath, { recursive: true });
  console.log('✅ release directory created or already exists:', releasePath);
} catch (err) {
  console.error('❌ Failed to create release directory:', err);
  process.exit(1);
}
