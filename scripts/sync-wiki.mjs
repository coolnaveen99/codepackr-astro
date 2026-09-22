import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'docs', 'wiki');
const target = path.resolve(process.argv[2] || path.join(root, 'wiki'));

if (!fs.existsSync(source)) throw new Error(`Wiki source directory not found: ${source}`);
fs.mkdirSync(target, { recursive: true });

for (const entry of fs.readdirSync(target)) {
  if (entry.endsWith('.md')) fs.rmSync(path.join(target, entry));
}

for (const entry of fs.readdirSync(source)) {
  if (!entry.endsWith('.md')) continue;
  fs.copyFileSync(path.join(source, entry), path.join(target, entry));
}

console.log(`Synced ${fs.readdirSync(source).filter(f => f.endsWith('.md')).length} Astro wiki pages.`);
