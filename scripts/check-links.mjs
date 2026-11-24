import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const origin = 'https://wiki-build.invalid';
const base = (process.env.SITE_BASE || '/').replace(/\/$/, '');

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
  for (const [, rawHref] of html.matchAll(/\b(?:href|src|srcset)="([^"]+)"/g)) {
    if (!rawHref || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(rawHref)) continue;
    checkedCount++;
    const url = new URL(rawHref, origin + base + route);
    if (base && url.pathname !== base && !url.pathname.startsWith(base + '/')) {
      errors.push(`${route} -> outside deployment base: ${rawHref}`);
      continue;
    }
    const targetRoute = decodeURIComponent(url.pathname.slice(base.length)) || '/';
    const hash = decodeURIComponent(url.hash.slice(1));
    const normalized = targetRoute.endsWith('/') || path.posix.extname(targetRoute)
      ? targetRoute : `${targetRoute}/`;

    if (!idsByRoute.has(normalized) && path.posix.extname(targetRoute)) {
      if (!fs.existsSync(path.join(distDir, targetRoute))) {
        errors.push(`${route} -> missing asset: ${rawHref}`);
      }
      continue;
    }

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
