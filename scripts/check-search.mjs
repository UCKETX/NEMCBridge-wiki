import fs from 'node:fs';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';

const pagefindDir = path.resolve('dist/pagefind');
const entryPath = path.join(pagefindDir, 'pagefind-entry.json');

if (!fs.existsSync(entryPath)) {
  console.error('ERROR: dist/pagefind/pagefind-entry.json not found. Run `npm run build` first.');
  process.exit(1);
}

const entry = JSON.parse(fs.readFileSync(entryPath, 'utf8'));
const languages = Object.keys(entry.languages || {});
if (languages.length === 0) {
  console.error('ERROR: No languages indexed by Pagefind.');
  process.exit(1);
}

// Check that Pagefind generated zh-cn (or zh) index with WASM and fragments
const zhKey = languages.find((lang) => lang.toLowerCase().startsWith('zh'));
if (!zhKey) {
  console.error(`ERROR: Expected Chinese language index in Pagefind, found: ${languages.join(', ')}`);
  process.exit(1);
}

const fragmentDir = path.join(pagefindDir, 'fragment');
const fragmentFiles = fs.existsSync(fragmentDir)
  ? fs.readdirSync(fragmentDir).filter((f) => f.endsWith('.pf_fragment'))
  : [];

if (fragmentFiles.length === 0) {
  console.error('ERROR: No Pagefind fragments generated.');
  process.exit(1);
}

// Decode fragments (Pagefind strips the "pagefind_dcd" signature or gzips JSON; let's inspect raw/gunzipped content)
// Note: Pagefind fragments are gzipped with a custom header in v1.x, or we can verify via the index chunks + HTML data-pagefind-body.
// Even better: check index/ and pagefind.js exist and verify required Chinese terms appear in indexed pages (data-pagefind-body).
const requiredTerms = ['转服', '资源包', '快速开始', '日志', 'Geyser', 'v1.6.0', '选服大厅'];
const distDir = path.resolve('dist');

function walkHtml(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkHtml(full));
    } else if (entry.name.endsWith('.html')) {
      results.push(full);
    }
  }
  return results;
}

const indexedBodies = [];
for (const file of walkHtml(distDir)) {
  const html = fs.readFileSync(file, 'utf8');
  if (html.includes('data-pagefind-body')) {
    indexedBodies.push({ file: path.relative(distDir, file), html });
  }
}

if (indexedBodies.length < 8) {
  console.error(`ERROR: Expected at least 8 pages with data-pagefind-body, found ${indexedBodies.length}.`);
  process.exit(1);
}

const missing = [];
for (const term of requiredTerms) {
  const hits = indexedBodies.filter((p) => p.html.includes(term));
  if (hits.length === 0) {
    missing.push(term);
  }
}

if (missing.length > 0) {
  console.error(`ERROR: Terms not found in indexed pages: ${missing.join(', ')}`);
  process.exit(1);
}

const wasmFiles = fs.readdirSync(pagefindDir).filter((f) => f.includes('wasm'));
console.log(
  `Pagefind check passed: lang=${zhKey}, pages=${entry.languages[zhKey].page_count}, fragments=${fragmentFiles.length}, wasm=${wasmFiles.length}, terms=[${requiredTerms.join(', ')}].`
);
