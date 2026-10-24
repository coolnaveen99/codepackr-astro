// Codepackr Astro - Language Switcher Context (persists preference client-side only)
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Lang } from "@/lib/astro/i18n";

const LANG_KEY = "codepackr_astro_lang";

function readStoredLang(): Lang {
  try {
    if (typeof window === "undefined") return "ta";
    const v = window.localStorage.getItem(LANG_KEY);
    const valid: Lang[] = ["ta", "en"];
    if (v && (valid as string[]).includes(v)) return v as Lang;
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
    const target = l === "en" ? "en" : "ta";
    setLangState(target);
    try {
      window.localStorage.setItem(LANG_KEY, target);
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
