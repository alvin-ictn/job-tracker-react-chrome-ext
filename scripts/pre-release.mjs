import { mkdir } from 'fs/promises';
import { access } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const releasePath = `${__dirname}/../release`;

try {
  access(releasePath, () => {});
} catch {
  await mkdir(releasePath, { recursive: true });
}
