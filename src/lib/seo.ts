// Codepackr Astro - Advanced SEO & Structured Metadata Engine
import { useEffect } from "react";
import type { Page } from "./nav";
import type { Lang } from "./astro/i18n";

export interface ToolSeoConfig {
  titleTa: string;
  titleEn: string;
  descTa: string;
  descEn: string;
  keywordsTa: string;
  keywordsEn: string;
  category: string;
  featureListTa: string[];
  featureListEn: string[];
}

export const SEO_DATA: Partial<Record<Page, ToolSeoConfig>> & { jathagam: ToolSeoConfig } = {
  jathagam: {
    titleTa: "Free Tamil Jathagam | Codepackr Astro",
    titleEn: "Free Tamil Jathagam | Codepackr Astro",
    descTa: "Tamil jathagam, porutham, panchangam.",
    descEn: "Tamil jathagam, porutham, panchangam.",
    keywordsTa: "jathagam",
    keywordsEn: "jathagam",
    category: "AstrologyApplication",
    featureListTa: ["Jathagam"],
    featureListEn: ["Jathagam"]
  }
};

const BASE_URL = "https://astro.codepackr.com";

export function getToolCanonicalUrl(page: Page): string {
  if (page === "jathagam") return `${BASE_URL}/`;
  return `${BASE_URL}/${page}`;
}

export function updatePageMeta(page: Page, lang: Lang): void {
  if (typeof document === "undefined") return;
  const data = SEO_DATA[page] || SEO_DATA.jathagam;
  const isTa = lang === "ta";
  const title = isTa ? data.titleTa : data.titleEn;
  const desc = isTa ? data.descTa : data.descEn;
  const keywords = isTa ? data.keywordsTa : data.keywordsEn;
  const canonicalUrl = getToolCanonicalUrl(page);
  document.title = title;
  setMetaTag("name", "description", desc);
  setMetaTag("name", "keywords", keywords);
  let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalLink) {
    canonicalLink = document.createElement("link");
    canonicalLink.rel = "canonical";
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.href = canonicalUrl;
  setMetaTag("property", "og:title", title);
  setMetaTag("property", "og:description", desc);
  setMetaTag("property", "og:url", canonicalUrl);
  setMetaTag("property", "og:type", "website");
  setMetaTag("name", "twitter:title", title);
  setMetaTag("name", "twitter:description", desc);
  updateJsonLd(page, lang, title, desc, canonicalUrl, data);
}

function setMetaTag(attrName: string, attrVal: string, content: string): void {
  let tag = document.querySelector(`meta[${attrName}="${attrVal}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attrName, attrVal);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

function updateJsonLd(
  page: Page,
  lang: Lang,
  title: string,
  desc: string,
  canonicalUrl: string,
  data: ToolSeoConfig
): void {
  const scriptId = "codepackr-tool-jsonld";
  let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
  if (!scriptTag) {
    scriptTag = document.createElement("script");
    scriptTag.id = scriptId;
    scriptTag.type = "application/ld+json";
    document.head.appendChild(scriptTag);
  }
  const features = lang === "ta" ? data.featureListTa : data.featureListEn;
  scriptTag.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: title,
    url: canonicalUrl,
    description: desc,
    featureList: features
  });
}

export function usePageSeo(page: Page, lang: Lang) {
  useEffect(() => {
    updatePageMeta(page, lang);
  }, [page, lang]);
}
