import fs from 'node:fs';
import path from 'node:path';

const SITE_URL = 'https://amazon-hike.com';
const BASE_PATH = '/chapter22';
const TODAY = new Date().toISOString().split('T')[0];

// All indexable pages (excluding progress)
const indexableRoutes = [
  '/',
  '/curriculum/',
  '/curriculum/ch01/',
  '/curriculum/ch02/',
  '/curriculum/ch03/',
  '/curriculum/ch04/',
  '/curriculum/ch05/',
  '/curriculum/ch06/',
  '/curriculum/ch07/',
  '/curriculum/ch08/',
  '/curriculum/ch09/',
  '/curriculum/ch10/',
  '/curriculum/ch11/',
  '/curriculum/ch12/',
  '/cases/',
  '/practice/',
  '/diagnostic/',
  '/methodology/',
  '/knowledge/',
];

const xmlEntries = indexableRoutes.map(route => {
  const loc = `${SITE_URL}${BASE_PATH}${route}`;
  const priority = route === '/' ? '1.0' : (route.startsWith('/curriculum/') ? '0.8' : '0.7');
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
}).join('\n');

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<!-- 亞馬遜國家山岳協會 第 22 章 Chapter 22 Sitemap 條目片段 -->
<!-- 請將以下內容合併至 https://amazon-hike.com/sitemap.xml -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>
`;

// Write to public/
fs.writeFileSync('public/chapter22-sitemap-entries.xml', sitemapContent);
console.log('✓ Created public/chapter22-sitemap-entries.xml');

// Write to dist/chapter22/ if dist exists or dist/chapter22 exists
if (fs.existsSync('dist/chapter22')) {
  fs.writeFileSync('dist/chapter22/chapter22-sitemap-entries.xml', sitemapContent);
  console.log('✓ Created dist/chapter22/chapter22-sitemap-entries.xml');
} else if (fs.existsSync('dist')) {
  fs.mkdirSync('dist/chapter22', { recursive: true });
  fs.writeFileSync('dist/chapter22/chapter22-sitemap-entries.xml', sitemapContent);
  console.log('✓ Created dist/chapter22/chapter22-sitemap-entries.xml');
}
