import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const distHeadersPath = path.join(distDir, '_headers');
const publicHeadersPath = path.resolve('public/_headers');

console.log('[post-build] Processing Cloudflare headers and cleanup...');

// 1. Copy public/_headers to dist/_headers with /chapter22 prefix
if (fs.existsSync(publicHeadersPath)) {
  const content = fs.readFileSync(publicHeadersPath, 'utf-8');
  const lines = content.split('\n');
  const transformedLines = lines.map(line => {
    // If line starts with a route rule (e.g. /* or /_astro/*)
    if (line.startsWith('/')) {
      return `/chapter22${line}`;
    }
    return line;
  });

  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  fs.writeFileSync(distHeadersPath, transformedLines.join('\n'));
  console.log('✓ Created dist/_headers with /chapter22 route rules');
}

// 2. Ensure NO robots.txt or sitemap.xml in dist/ root
const rootRobots = path.join(distDir, 'robots.txt');
const rootSitemap = path.join(distDir, 'sitemap.xml');

if (fs.existsSync(rootRobots)) {
  fs.unlinkSync(rootRobots);
  console.log('✓ Removed dist/robots.txt (reserved for main site)');
}

if (fs.existsSync(rootSitemap)) {
  fs.unlinkSync(rootSitemap);
  console.log('✓ Removed dist/sitemap.xml (reserved for main site)');
}

console.log('[post-build] Post-build completed successfully.');
