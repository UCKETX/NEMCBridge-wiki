import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');

if (!fs.existsSync(distDir)) {
  console.error('ERROR: dist/ directory not found. Run `npm run build` first.');
  process.exit(1);
}

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

const htmlFiles = walkHtml(distDir);
const idsByRoute = new Map();

function fileToRoute(filePath) {
  const rel = path.relative(distDir, filePath).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return '/' + rel.slice(0, -'index.html'.length);
  return '/' + rel;
}

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const ids = new Set();
  for (const match of html.matchAll(/\bid="([^"]+)"/g)) {
    ids.add(match[1]);
  }
  idsByRoute.set(fileToRoute(file), ids);
}

const errors = [];
let checkedCount = 0;

for (const file of htmlFiles) {
  const route = fileToRoute(file);
  const html = fs.readFileSync(file, 'utf8');
  for (const match of html.matchAll(/\bhref="([^"]+)"/g)) {
    const rawHref = match[1];
    if (
      !rawHref ||
      rawHref.startsWith('http://') ||
      rawHref.startsWith('https://') ||
      rawHref.startsWith('mailto:') ||
      rawHref.startsWith('tel:') ||
      rawHref.startsWith('javascript:')
    ) {
      continue;
    }

    checkedCount++;
    const [rawPath, rawHash] = rawHref.split('#');
    const hash = rawHash ? decodeURIComponent(rawHash) : '';

    let targetRoute = route;
    if (rawPath) {
      const resolved = rawPath.startsWith('/')
        ? rawPath
        : path.posix.resolve(route, rawPath);
      targetRoute = resolved;
    }

    // Static assets (CSS/JS/SVG/XML/favicon/etc.)
    if (targetRoute !== '/' && path.posix.extname(targetRoute)) {
      const assetPath = path.join(distDir, targetRoute.replace(/^\//, ''));
      if (!fs.existsSync(assetPath)) {
        errors.push(`${route} -> missing asset: ${rawHref}`);
      }
      continue;
    }

    const normalized = targetRoute.endsWith('/') ? targetRoute : `${targetRoute}/`;
    const targetIds = idsByRoute.get(normalized);
    if (!targetIds) {
      errors.push(`${route} -> broken internal route: ${rawHref}`);
      continue;
    }

    if (hash && !targetIds.has(hash)) {
      errors.push(`${route} -> missing anchor #${hash} on ${normalized}`);
    }
  }
}

if (errors.length > 0) {
  console.error(`Link check failed with ${errors.length} error(s):`);
  for (const err of errors) console.error('  -', err);
  process.exit(1);
}

console.log(`Link check passed: ${htmlFiles.length} HTML pages, ${checkedCount} internal links verified.`);
