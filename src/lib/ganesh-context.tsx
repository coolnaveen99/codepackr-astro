// Codepackr Astro - Ganesh Deity Branding Context
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface GaneshContextType {
  ganeshSrc: string;
  setGaneshSrc: (src: string) => void;
  resetGaneshSrc: () => void;
}

const DEFAULT_SRC = "/ganesh.png?v=3";
const STORAGE_KEY = "codepackr_custom_ganesh_image";

const GaneshContext = createContext<GaneshContextType>({
  ganeshSrc: DEFAULT_SRC,
  setGaneshSrc: () => {},
  resetGaneshSrc: () => {},
});

export function GaneshProvider({ children }: { children: ReactNode }) {
  const [ganeshSrc, setGaneshSrcState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return saved;
      } catch {
        // ignore
      }
    }
    return DEFAULT_SRC;
  });

  const setGaneshSrc = (src: string) => {
    setGaneshSrcState(src);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, src);
      } catch {
        // ignore
      }
    }
  };

  const resetGaneshSrc = () => {
    setGaneshSrcState(DEFAULT_SRC);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  };

  return (
    <GaneshContext.Provider value={{ ganeshSrc, setGaneshSrc, resetGaneshSrc }}>
      {children}
    </GaneshContext.Provider>
  );
}

export function useGanesh() {
  return useContext(GaneshContext);
}
