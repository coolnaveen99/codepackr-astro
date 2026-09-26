// Codepackr Astro - Top Navigation & Semantic URL Routing Context
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

export type Page =
  | "home"
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
  "home",
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
  home: "/",
  jathagam: "/jathagam",
  porutham: "/porutham",
  biodata: "/biodata",
  panchangam: "/tamil-calendar",
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
  if (typeof window === "undefined") return "home";

  const searchParams = new URLSearchParams(window.location.search);
  const queryPage = searchParams.get("page");
  if (queryPage && PAGE_SET.has(queryPage)) {
    if (queryPage === "panchangam") return "tamil-calendar";
    return queryPage as Page;
  }

  const rawPath = window.location.pathname
    .replace(/\/+$/, "")
    .replace(/^\/+/, "")
    .replace(/\.html$/i, "")
    .toLowerCase();

  // Legacy root query check (e.g. /?d=20&m=5&y=1990 or /?print=auto)
  // Safely migrate historical shared links to jathagam page
  const hasBirthParams = (searchParams.has("d") && searchParams.has("m") && searchParams.has("y")) || searchParams.has("print");
  if ((rawPath === "" || rawPath === "index") && hasBirthParams) {
    return "jathagam";
  }

  if (rawPath === "" || rawPath === "index" || rawPath === "home") {
    return "home";
  }

  if (rawPath === "jathagam" || rawPath === "horoscope") {
    return "jathagam";
  }

  if (rawPath === "panchangam") {
    return "tamil-calendar";
  }

  if (rawPath === "dev/astro-validation" || rawPath === "astro-validation") {
    return "astro-validation";
  }

  if (PAGE_SET.has(rawPath)) {
    return rawPath as Page;
  }

  return "home";
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
    const canonicalPage = targetPage === "panchangam" ? "tamil-calendar" : targetPage;
    setPage(canonicalPage);
    if (typeof window !== "undefined") {
      const targetUrl = getPageUrl(canonicalPage);
      const currentParams = new URLSearchParams(window.location.search);
      const printMode = currentParams.get("print");
      const finalUrl = printMode ? `${targetUrl}?print=${printMode}` : targetUrl;

      if (window.location.pathname !== targetUrl) {
        if (replace) {
          window.history.replaceState({ page: canonicalPage }, "", finalUrl);
        } else {
          window.history.pushState({ page: canonicalPage }, "", finalUrl);
        }
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const searchParams = new URLSearchParams(window.location.search);
    const rawPath = window.location.pathname
      .replace(/\/+$/, "")
      .replace(/^\/+/, "")
      .replace(/\.html$/i, "")
      .toLowerCase();

    // 1. URL Migration for /panchangam -> /tamil-calendar
    if (rawPath === "panchangam") {
      const finalUrl = `/tamil-calendar${window.location.search}`;
      window.history.replaceState({ page: "tamil-calendar" }, "", finalUrl);
      setPage("tamil-calendar");
      return;
    }

    // 2. URL Migration for legacy root queries -> /jathagam
    const hasBirthParams =
      (searchParams.has("d") && searchParams.has("m") && searchParams.has("y")) ||
      searchParams.has("print") ||
      searchParams.get("page") === "jathagam";
    if ((rawPath === "" || rawPath === "index") && hasBirthParams) {
      searchParams.delete("page");
      const qs = searchParams.toString();
      const finalUrl = qs ? `/jathagam?${qs}` : "/jathagam";
      window.history.replaceState({ page: "jathagam" }, "", finalUrl);
      setPage("jathagam");
      return;
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
