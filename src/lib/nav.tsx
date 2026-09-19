import { createContext, useContext, useState, type ReactNode } from "react";

export type Page = "jathagam" | "porutham" | "biodata";

const NavCtx = createContext<{ page: Page; go: (p: Page) => void } | null>(null);

export function NavProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<Page>("jathagam");
  return <NavCtx.Provider value={{ page, go: setPage }}>{children}</NavCtx.Provider>;
}

export function useNav() {
  const ctx = useContext(NavCtx);
  if (!ctx) throw new Error("useNav");
  return ctx;
}
