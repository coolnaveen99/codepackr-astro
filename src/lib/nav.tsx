// Codepackr Astro - Top Navigation Context
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Page = "jathagam" | "porutham" | "biodata" | "contact" | "disclaimer";

const NavCtx = createContext<{ page: Page; go: (p: Page) => void } | null>(null);

export function NavProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<Page>(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("page");
      if (p === "porutham" || p === "biodata" || p === "contact" || p === "disclaimer") return p;
    }
    return "jathagam";
  });

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

  return <NavCtx.Provider value={{ page, go: setPage }}>{children}</NavCtx.Provider>;
}

export function useNav() {
  const ctx = useContext(NavCtx);
  if (!ctx) throw new Error("useNav");
  return ctx;
}
