import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.cwd(), "dist");
const src = resolve(root, "index.html");
const pages = [
  "privacy",
  "disclaimer",
  "panchangam",
  "porutham",
  "contact",
  "about",
  "biodata",
  "rasipalan",
  "numerology",
  "prasna",
  "glossary",
  "chandrashtama",
  "gochara",
  "nakshatra",
  "babynames",
  "nazhigai",
  "jathagam",
  "tamil-calendar",
  "forecast",
  "calculation-method",
  "astro-validation",
];

if (!existsSync(src)) {
  console.error("dist/index.html missing; run vite build first");
  process.exit(1);
}

for (const page of pages) {
  copyFileSync(src, resolve(root, `${page}.html`));
  console.log(`copied dist/${page}.html`);
}

// Ensure /dev/astro-validation.html is also available for static hosts
const devDir = resolve(root, "dev");
if (!existsSync(devDir)) {
  mkdirSync(devDir, { recursive: true });
}
copyFileSync(src, resolve(devDir, "astro-validation.html"));
console.log("copied dist/dev/astro-validation.html");
