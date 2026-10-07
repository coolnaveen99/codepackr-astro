import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_KEY = '7e3c91a4d8f64b2e9a17c5d03f68ab21';
const KEY = process.env.INDEXNOW_KEY || DEFAULT_KEY;
const HOST = process.env.HOST || 'astro.codepackr.com';
const PROTOCOL = process.env.PROTOCOL || 'https';
const BASE_URL = `${PROTOCOL}://${HOST}`;
const KEY_LOCATION = `${BASE_URL}/${KEY}.txt`;
const SITEMAP_URL = `${BASE_URL}/sitemap.xml`;
const sitemapPath = path.resolve('public/sitemap.xml');
if (!fs.existsSync(sitemapPath)) { console.error('Error: public/sitemap.xml not found.'); process.exit(1); }
const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
const urlList = [...sitemapContent.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
const uniqueUrls = [...new Set(urlList)];
console.log(`IndexNow: ${HOST} — ${uniqueUrls.length} URLs`);
const payload = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: uniqueUrls };
const endpoints = [
  { name: 'Yandex Webmaster IndexNow', url: 'https://yandex.com/indexnow' },
  { name: 'Naver Search Advisor IndexNow', url: 'https://searchadvisor.naver.com/indexnow' },
  { name: 'IndexNow Master API', url: 'https://api.indexnow.org/indexnow' },
  { name: 'Bing Webmaster IndexNow', url: 'https://www.bing.com/indexnow' },
];
for (const endpoint of endpoints) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(endpoint.url, { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8', 'User-Agent': `Codepackr-IndexNow/1.0 (+${BASE_URL})` }, body: JSON.stringify(payload), signal: controller.signal });
    clearTimeout(timer);
    if (response.status === 200 || response.status === 202) console.log(`[SUCCESS] ${endpoint.name}: ${response.status}`);
    else if (response.status === 403) console.log(`[PENDING] ${endpoint.name}: HTTP 403 — verification/key activation pending`);
    else console.log(`[STATUS] ${endpoint.name}: HTTP ${response.status}`);
  } catch (error) { console.log(`[INFO] ${endpoint.name}: unavailable/timed out — ${error.message}`); }
}
console.log(`Google discovery: ${SITEMAP_URL} is published and declared in robots.txt.`);
console.log('Google sitemap ping is intentionally not used because the legacy ping endpoint is retired.');
console.log('Use Google Search Console for authoritative submission/inspection.');
