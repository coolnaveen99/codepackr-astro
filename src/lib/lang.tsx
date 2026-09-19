import { createContext, useContext, useState, type ReactNode } from "react";
import type { Lang } from "@/lib/astro/i18n";

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void } | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ta");
  return <LangCtx.Provider value={{ lang, setLang }}>{children}</LangCtx.Provider>;
}

export function useLang() {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error("useLang");
  return ctx;
}
