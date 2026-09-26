import { useEffect, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MobileBottomNav, ASTRO_MOBILE_TABS } from "./MobileBottomNav";

function AstroMobileNavHost() {
  const [tab, setTab] = useState("home");

  const onSelect = (t: string) => {
    setTab(t);
    // Dispatch navigation for AppShell / useNav consumers
    const page =
      t === "home" || t === "jathagam"
        ? "jathagam"
        : t === "predictions"
          ? "rasipalan"
          : t === "more"
            ? "glossary"
            : "jathagam";
    window.dispatchEvent(new CustomEvent("cp-astro-navigate", { detail: { page } }));
    // Fallback: path-style navigation used by many Codepackr apps
    const path =
      page === "jathagam"
        ? "/"
        : page === "rasipalan"
          ? "/rasipalan"
          : `/${page}`;
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <MobileBottomNav activeTab={tab} onSelectTab={onSelect} tabs={ASTRO_MOBILE_TABS} />
  );
}

let root: Root | null = null;

export function mountAstroMobileNav() {
  if (typeof document === "undefined") return;
  let host = document.getElementById("cp-mobile-nav-root");
  if (!host) {
    host = document.createElement("div");
    host.id = "cp-mobile-nav-root";
    document.body.appendChild(host);
  }
  if (!root) {
    root = createRoot(host);
    root.render(<AstroMobileNavHost />);
  }
  document.documentElement.classList.add("cp-has-mobile-nav");
}
