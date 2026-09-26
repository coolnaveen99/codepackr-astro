// Codepackr Astro - Top Navigation & Semantic URL Routing Context
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

export type Page =
  | "jathagam"
  | "porutham"
  | "biodata"
  | "panchangam"
  | "rasipalan"
  | "chandrashtama"
  | "gochara"
  | "nakshatra"
  | "babynames"
  | "nazhigai"
  | "numerology"
  | "glossary"
  | "prasna"
  | "contact"
  | "disclaimer"
  | "privacy"
  | "about"
  | "tamil-calendar"
  | "forecast"
  | "calculation-method"
  | "astro-validation";

export const PAGE_SET = new Set<string>([
  "jathagam",
  "porutham",
  "biodata",
  "panchangam",
  "rasipalan",
  "chandrashtama",
  "gochara",
  "nakshatra",
  "babynames",
  "nazhigai",
  "numerology",
  "glossary",
  "prasna",
  "contact",
  "disclaimer",
  "privacy",
  "about",
  "tamil-calendar",
  "forecast",
  "calculation-method",
  "astro-validation",
]);

export const PAGE_PATHS: Record<Page, string> = {
  jathagam: "/",
  porutham: "/porutham",
  biodata: "/biodata",
  panchangam: "/panchangam",
  rasipalan: "/rasipalan",
  chandrashtama: "/chandrashtama",
  gochara: "/gochara",
  nakshatra: "/nakshatra",
  babynames: "/babynames",
  nazhigai: "/nazhigai",
  numerology: "/numerology",
  glossary: "/glossary",
  prasna: "/prasna",
  contact: "/contact",
  disclaimer: "/disclaimer",
  privacy: "/privacy",
  about: "/about",
  "tamil-calendar": "/tamil-calendar",
  forecast: "/forecast",
  "calculation-method": "/calculation-method",
  "astro-validation": "/dev/astro-validation",
};

export function getPageUrl(p: Page): string {
  return PAGE_PATHS[p] || "/";
}

export function resolvePageFromUrl(): Page {
  if (typeof window === "undefined") return "jathagam";

  const queryPage = new URLSearchParams(window.location.search).get("page");
  if (queryPage && PAGE_SET.has(queryPage)) {
    return queryPage as Page;
  }

  const rawPath = window.location.pathname
    .replace(/\/+$/, "")
    .replace(/^\/+/, "")
    .replace(/\.html$/i, "")
    .toLowerCase();
  if (rawPath && PAGE_SET.has(rawPath)) {
    return rawPath as Page;
  }
  if (rawPath === "jathagam" || rawPath === "horoscope") {
    return "jathagam";
  }
  if (rawPath === "dev/astro-validation" || rawPath === "astro-validation") {
    return "astro-validation";
  }

  return "jathagam";
}

interface NavContextType {
  page: Page;
  go: (p: Page, replace?: boolean) => void;
  getUrl: (p: Page) => string;
}

const NavCtx = createContext<NavContextType | null>(null);

export function NavProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<Page>(resolvePageFromUrl);

  const go = useCallback((targetPage: Page, replace = false) => {
    setPage(targetPage);
    if (typeof window !== "undefined") {
      const targetUrl = getPageUrl(targetPage);
      const currentParams = new URLSearchParams(window.location.search);
      const printMode = currentParams.get("print");
      const finalUrl = printMode ? `${targetUrl}?print=${printMode}` : targetUrl;

      if (window.location.pathname !== targetUrl) {
        if (replace) {
          window.history.replaceState({ page: targetPage }, "", finalUrl);
        } else {
          window.history.pushState({ page: targetPage }, "", finalUrl);
        }
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handlePopState = () => {
      setPage(resolvePageFromUrl());
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("print") === "auto") {
        const timer = setTimeout(() => {
          try {
            window.print();
          } catch {
            // ignore
          }
        }, 600);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  return (
    <NavCtx.Provider value={{ page, go, getUrl: getPageUrl }}>
      {children}
    </NavCtx.Provider>
  );
}

export function useNav() {
  const ctx = useContext(NavCtx);
  if (!ctx) throw new Error("useNav must be used within NavProvider");
  return ctx;
}
