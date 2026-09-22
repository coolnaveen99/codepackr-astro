// Codepackr Astro - Top Navigation & Semantic URL Routing Context
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

export type Page =
  | "jathagam"
  | "porutham"
  | "biodata"
  | "panchangam"
  | "rasipalan"
  | "numerology"
  | "glossary"
  | "prasna"
  | "contact"
  | "disclaimer";

export const PAGE_SET = new Set<string>([
  "jathagam",
  "porutham",
  "biodata",
  "panchangam",
  "rasipalan",
  "numerology",
  "glossary",
  "prasna",
  "contact",
  "disclaimer",
]);

export const PAGE_PATHS: Record<Page, string> = {
  jathagam: "/",
  porutham: "/porutham",
  biodata: "/biodata",
  panchangam: "/panchangam",
  rasipalan: "/rasipalan",
  numerology: "/numerology",
  glossary: "/glossary",
  prasna: "/prasna",
  contact: "/contact",
  disclaimer: "/disclaimer",
};

/**
 * Returns canonical relative URL path for a given tool page
 */
export function getPageUrl(p: Page): string {
  return PAGE_PATHS[p] || "/";
}

/**
 * Resolves current Page from window.location.pathname or window.location.search
 */
export function resolvePageFromUrl(): Page {
  if (typeof window === "undefined") return "jathagam";

  // 1. Check query parameter '?page=...'
  const queryPage = new URLSearchParams(window.location.search).get("page");
  if (queryPage && PAGE_SET.has(queryPage)) {
    return queryPage as Page;
  }

  // 2. Check pathname: e.g. "/porutham", "/biodata", "/panchangam"
  const rawPath = window.location.pathname.replace(/\/+$/, "").replace(/^\/+/, "").toLowerCase();
  if (rawPath && PAGE_SET.has(rawPath)) {
    return rawPath as Page;
  }
  if (rawPath === "jathagam" || rawPath === "horoscope") {
    return "jathagam";
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
      // Preserve print query parameter if present
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

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePopState = () => {
      const resolved = resolvePageFromUrl();
      setPage(resolved);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Handle automatic print modal if ?print=auto
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
