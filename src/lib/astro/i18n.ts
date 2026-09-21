// RESTORED - use local file
export type Lang = "ta" | "en";
const COPY = { brand: { ta: "Codepackr Astro", en: "Codepackr Astro" } } as const;
export type CopyKey = keyof typeof COPY;
export function t(lang: Lang, key: CopyKey): string { return COPY[key][lang]; }
