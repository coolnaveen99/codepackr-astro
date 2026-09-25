// Codepackr Astro - Language Switcher Context (persists preference client-side only)
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Lang } from "@/lib/astro/i18n";

const LANG_KEY = "codepackr_astro_lang";

function readStoredLang(): Lang {
  try {
    if (typeof window === "undefined") return "ta";
    const v = window.localStorage.getItem(LANG_KEY);
    if (v === "en" || v === "ta") return v;
  } catch {
    /* private mode / blocked storage */
  }
  return "ta";
}

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void } | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ta");

  useEffect(() => {
    setLangState(readStoredLang());
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(LANG_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  return <LangCtx.Provider value={{ lang, setLang }}>{children}</LangCtx.Provider>;
}

export function useLang() {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error("useLang");
  return ctx;
}
