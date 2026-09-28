import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.cwd(), "dist");
const src = resolve(root, "index.html");
const seoSource = resolve(process.cwd(), "src/lib/seo.ts");
const pages = [
  "privacy", "disclaimer", "panchangam", "porutham", "contact", "about",
  "biodata", "rasipalan", "numerology", "prasna", "glossary", "chandrashtama",
  "gochara", "nakshatra", "babynames", "nazhigai", "jathagam",
  "tamil-calendar", "forecast", "calculation-method", "astro-validation",
];

if (!existsSync(src)) throw new Error("dist/index.html missing; run vite build first");

const template = readFileSync(src, "utf8");
const seoText = existsSync(seoSource) ? readFileSync(seoSource, "utf8") : "";

function pretty(page) {
  return page.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function getSeo(page) {
  const block = seoText.match(new RegExp(`["']${page.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}["']\\s*:\\s*\\{[\\s\\S]*?(?=\\n\\s*\\},)`))?.[0] || "";
  const titleTa = block.match(/titleTa:\s*["']([^"']+)["']/)?.[1];
  const descTa = block.match(/descTa:\s*["']([^"']+)["']/)?.[1];
  const titleEn = block.match(/titleEn:\s*["']([^"']+)["']/)?.[1];
  const descEn = block.match(/descEn:\s*["']([^"']+)["']/)?.[1];
  return {
    title: titleTa || titleEn || `Codepackr Astro — ${pretty(page)}`,
    description: descTa || descEn || `Codepackr Astro — ${pretty(page)}` 
  };
}

function esc(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function render(page) {
  const { title, description } = getSeo(page);
  const canonical = page === "jathagam" ? "https://astro.codepackr.com/" : `https://astro.codepackr.com/${page}`;
  let html = template;
  html = html.replace(/<title>[^<]*<\\/title>/i, `<title>${esc(title)}</title>`);
  html = html.replace(/<meta name="description" content="[^"]*"/i, `<meta name="description" content="${esc(description)}"`);
  html = html.replace(/<link rel="canonical" href="[^"]*"/i, `<link rel="canonical" href="${canonical}"`);
  html = html.replace(/<meta property="og:title" content="[^"]*"/i, `<meta property="og:title" content="${esc(title)}"`);
  html = html.replace(/<meta property="og:description" content="[^"]*"/i, `<meta property="og:description" content="${esc(description)}"`);
  html = html.replace(/<meta property="og:url" content="[^"]*"/i, `<meta property="og:url" content="${canonical}"`);
  html = html.replace(/<meta property="og:image:alt" content="[^"]*"/i, `<meta property="og:image:alt" content="${esc(title)}"`);
  html = html.replace(/<meta name="twitter:title" content="[^"]*"/i, `<meta name="twitter:title" content="${esc(title)}"`);
  html = html.replace(/<meta name="twitter:description" content="[^"]*"/i, `<meta name="twitter:description" content="${esc(description)}"`);
  html = html.replace(/<meta name="twitter:image:alt" content="[^"]*"/i, `<meta name="twitter:image:alt" content="${esc(title)}"`);
  const crawler = `<div id="root" data-codepackr-prerendered="true"><main style="max-width:900px;margin:40px auto;padding:20px;font-family:system-ui,sans-serif"><p>Codepackr Astro</p><h1>${esc(title)}</h1><p>${esc(description)}</p><p>தமிழில் இலவச ஜோதிடம், ஜாதகம், பஞ்சாங்கம் மற்றும் தொடர்புடைய கருவிகள்.</p></main></div>`;
  return html.replace(/<div id="root">[\\s\\S]*?<\\/div>/i, crawler);
}

for (const page of pages) {
  const html = render(page);
  copyFileSync(src, resolve(root, `${page}.html`));
  writeFileSync(resolve(root, `${page}.html`), html);
  const dir = resolve(root, page);
  mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, "index.html"), html);
  console.log(`prerendered ${page}`);
}

const devDir = resolve(root, "dev");
mkdirSync(devDir, { recursive: true });
writeFileSync(resolve(devDir, "astro-validation.html"), render("astro-validation"));
console.log("prerendered dev/astro-validation.html");
