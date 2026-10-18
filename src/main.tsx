// Codepackr Astro - Client Entry Point
// Keep this entry point tracked as application code for Vercel's ignore-build check.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { mountAstroMobileNav } from "./components/MobileNavBridge";
import "./styles.css";
import "./mobile-tokens.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

mountAstroMobileNav();
