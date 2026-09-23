// src/components/CodepackrFamilyBar.tsx
import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  ExternalLink,
  Code2,
  BookOpen,
  Scale,
  TrendingUp,
  Sparkles,
  LayoutGrid,
  ShieldCheck,
  Check,
} from "lucide-react";
import {
  CODEPACKR_FAMILY,
  CURRENT_PRODUCT,
  FamilyProductId,
} from "../lib/codepackr-family";

const ACTIVE_PILL_STYLES: Record<FamilyProductId, { pill: string; dot: string }> = {
  tools: {
    pill: "text-blue-700 bg-blue-500/10 ring-1 ring-inset ring-blue-500/30 font-semibold shadow-xs",
    dot: "bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.7)]",
  },
  study: {
    pill: "text-indigo-700 bg-indigo-500/10 ring-1 ring-inset ring-indigo-500/30 font-semibold shadow-xs",
    dot: "bg-indigo-600 shadow-[0_0_8px_rgba(99,102,241,0.7)]",
  },
  law: {
    pill: "text-amber-800 bg-amber-500/10 ring-1 ring-inset ring-amber-500/30 font-semibold shadow-xs",
    dot: "bg-amber-700 shadow-[0_0_8px_rgba(217,119,6,0.7)]",
  },
  finance: {
    pill: "text-emerald-800 bg-emerald-500/10 ring-1 ring-inset ring-emerald-500/30 font-semibold shadow-xs",
    dot: "bg-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.7)]",
  },
  astro: {
    pill: "text-[#8b2b18] bg-[#8b2b18]/10 ring-1 ring-inset ring-[#8b2b18]/25 font-semibold shadow-xs",
    dot: "bg-[#8b2b18] shadow-[0_0_8px_rgba(139,43,24,0.6)]",
  },
};

function FamilyIcon({ id, size = 14, className = "" }: { id: FamilyProductId; size?: number; className?: string }) {
  const p = { size, strokeWidth: 2, className: `shrink-0 ${className}`, "aria-hidden": "true" as const };
  switch (id) {
    case "tools":
      return <Code2 {...p} />;
    case "study":
      return <BookOpen {...p} />;
    case "law":
      return <Scale {...p} />;
    case "finance":
      return <TrendingUp {...p} />;
    case "astro":
      return <Sparkles {...p} />;
    default:
      return null;
  }
}

export interface CodepackrFamilyBarProps {
  language?: "en" | "ta";
  showIcons?: boolean;
  linkTarget?: "_self" | "_blank";
  className?: string;
}

export function CodepackrFamilyBar({
  language = "ta",
  showIcons = true,
  linkTarget = "_self",
  className = "",
}: CodepackrFamilyBarProps) {
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const launcherRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (launcherRef.current && !launcherRef.current.contains(e.target as Node)) {
        setLauncherOpen(false);
      }
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    }
    if (launcherOpen || mobileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [launcherOpen, mobileOpen]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setLauncherOpen(false);
        setMobileOpen(false);
      }
    }
    if (launcherOpen || mobileOpen) {
      document.addEventListener("keydown", onKeyDown);
    }
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [launcherOpen, mobileOpen]);

  const currentItem = CODEPACKR_FAMILY.find((item) => item.id === CURRENT_PRODUCT);
  const currentStyles = ACTIVE_PILL_STYLES[CURRENT_PRODUCT];

  return (
    <nav
      id="codepackr-family-navigation"
      aria-label="Codepackr Family Ecosystem"
      className={`relative z-50 w-full select-none text-[12px] font-sans border-b backdrop-blur-md transition-colors bg-[#faf7f2]/95 border-[#e5dcd0] text-[#5c4a3d] ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-9.5 flex items-center justify-between gap-3">
        {/* Left: Brand Identity & Network Beacon */}
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="https://codepackr.com"
            className="flex items-center gap-2 group transition-opacity hover:opacity-90"
            title="Codepackr Ecosystem"
          >
            <div className="relative flex items-center justify-center size-5 rounded-md bg-gradient-to-br from-[#8b2b18] via-amber-600 to-emerald-600 p-0.5 shadow-xs group-hover:scale-105 transition-transform">
              <div className="size-full bg-[#faf7f2] rounded-[3px] flex items-center justify-center">
                <span className="size-2 rounded-full bg-gradient-to-r from-[#8b2b18] to-amber-500 animate-pulse" />
              </div>
            </div>

            <div className="flex items-center gap-1.5 font-semibold tracking-tight text-[#3d2f25]">
              <span className="font-bold">Codepackr</span>
              <span className="text-[#8c7a6e] font-normal">Family</span>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#efe7db] text-[#6b584a] border border-[#dfd5c5]">
            <span className="size-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>5 Free Suites</span>
          </div>
        </div>

        {/* Center: Desktop Navigation Capsules */}
        <ul className="hidden sm:flex items-center gap-1 lg:gap-1.5 h-full">
          {CODEPACKR_FAMILY.map((item) => {
            const isCurrent = item.id === CURRENT_PRODUCT;
            const labelText = language === "ta" && item.labelTa ? item.labelTa : item.label;

            return (
              <li key={item.id} className="h-full flex items-center">
                {isCurrent ? (
                  <span
                    aria-current="page"
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] cursor-default transition-all ${currentStyles.pill}`}
                  >
                    {showIcons && <FamilyIcon id={item.id} size={13} />}
                    <span>{labelText}</span>
                    <span className={`size-1.5 rounded-full ${currentStyles.dot}`} />
                  </span>
                ) : (
                  <a
                    href={item.href}
                    target={linkTarget}
                    rel={linkTarget === "_blank" ? "noopener noreferrer" : undefined}
                    title={item.tagline}
                    className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-medium text-[#6b584a] hover:text-[#2d221b] hover:bg-[#efe7db]/80 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b2b18]"
                  >
                    {showIcons && (
                      <FamilyIcon
                        id={item.id}
                        size={13}
                        className="transition-transform group-hover:scale-115 text-[#9e8d80] group-hover:text-[#5c4a3d]"
                      />
                    )}
                    <span>{labelText}</span>
                  </a>
                )}
              </li>
            );
          })}
        </ul>

        {/* Right: Ecosystem App Launcher Popover */}
        <div className="flex items-center gap-2">
          {/* Desktop Launcher Toggle */}
          <div className="relative hidden sm:block" ref={launcherRef}>
            <button
              type="button"
              onClick={() => setLauncherOpen((prev) => !prev)}
              aria-expanded={launcherOpen}
              aria-haspopup="true"
              aria-label="Toggle Codepackr App Launcher"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-medium transition-all cursor-pointer ${
                launcherOpen
                  ? "bg-[#ebdcca] text-[#2d221b] ring-1 ring-[#dfd5c5]"
                  : "text-[#6b584a] hover:text-[#2d221b] hover:bg-[#efe7db]/80"
              }`}
            >
              <LayoutGrid size={13} className="shrink-0" />
              <span className="hidden lg:inline">{language === "ta" ? "வலைப்பின்னல்" : "Ecosystem"}</span>
              <ChevronDown
                size={12}
                className={`transition-transform duration-200 ${launcherOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Desktop Launcher Popover Card */}
            {launcherOpen && (
              <div className="absolute right-0 top-full mt-2 w-84 p-2.5 rounded-2xl shadow-2xl border border-[#dfd5c5] bg-[#faf7f2]/98 backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-2 pb-2 mb-1.5 border-b border-[#ebdcca]">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-600" />
                    <span className="text-[12px] font-semibold text-[#2d221b]">
                      Codepackr Ecosystem
                    </span>
                  </div>
                  <span className="text-[10px] text-[#8c7a6e] font-mono">100% In-Browser</span>
                </div>

                <div className="space-y-1">
                  {CODEPACKR_FAMILY.map((item) => {
                    const isCurrent = item.id === CURRENT_PRODUCT;
                    const labelText = language === "ta" && item.labelTa ? item.labelTa : item.label;

                    return (
                      <div key={item.id}>
                        {isCurrent ? (
                          <div
                            aria-current="page"
                            className="flex items-center justify-between p-2 rounded-xl bg-[#8b2b18]/10 border border-[#8b2b18]/20 text-[#2d221b]"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className={`size-8 rounded-lg flex items-center justify-center text-white bg-gradient-to-br ${item.gradient} shadow-xs shrink-0`}
                              >
                                <FamilyIcon id={item.id} size={15} />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 font-semibold text-[12px] text-[#8b2b18]">
                                  <span>{labelText}</span>
                                  <span className="text-[9px] px-1.5 py-0.2 rounded-full font-mono uppercase bg-[#8b2b18]/20 text-[#8b2b18] font-bold">
                                    Current
                                  </span>
                                </div>
                                <p className="text-[10.5px] text-[#7a685c] truncate">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                            <Check size={14} className="text-[#8b2b18] shrink-0 mr-1" />
                          </div>
                        ) : (
                          <a
                            href={item.href}
                            target={linkTarget}
                            rel={linkTarget === "_blank" ? "noopener noreferrer" : undefined}
                            className="group flex items-center justify-between p-2 rounded-xl hover:bg-[#efe7db] transition-all text-[#4a3b31]"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className={`size-8 rounded-lg flex items-center justify-center text-white bg-gradient-to-br ${item.gradient} opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all shadow-xs shrink-0`}
                              >
                                <FamilyIcon id={item.id} size={15} />
                              </div>
                              <div className="min-w-0">
                                <div className="font-medium text-[12px] text-[#2d221b] group-hover:text-[#8b2b18] transition-colors">
                                  {labelText}
                                </div>
                                <p className="text-[10.5px] text-[#7a685c] truncate">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                            <ExternalLink
                              size={12}
                              className="text-[#9e8d80] group-hover:text-[#4a3b31] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mr-1"
                            />
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-2 pt-2 border-t border-[#ebdcca] flex items-center justify-between px-2 text-[10px] text-[#8c7a6e]">
                  <div className="flex items-center gap-1">
                    <ShieldCheck size={12} className="text-emerald-600" />
                    <span>Privacy First</span>
                  </div>
                  <span>Zero Server Logging</span>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Switcher Drawer Trigger */}
          <div className="sm:hidden relative" ref={mobileRef}>
            <button
              type="button"
              aria-expanded={mobileOpen}
              aria-haspopup="true"
              aria-label="Toggle Codepackr Family Menu"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="flex items-center gap-1.5 py-1 px-2.5 rounded-full text-[11px] font-semibold border border-[#dfd5c5] bg-[#efe7db] text-[#3d2f25] shadow-2xs hover:bg-[#ebdcca]"
            >
              {showIcons && currentItem && <FamilyIcon id={currentItem.id} size={13} />}
              <span>{language === "ta" && currentItem?.labelTa ? currentItem.labelTa : currentItem?.label}</span>
              <span className={`size-1.5 rounded-full ${currentStyles.dot}`} />
              <ChevronDown
                size={12}
                className={`transition-transform duration-200 ${mobileOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Mobile Dropdown Menu */}
            {mobileOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-72 p-2 rounded-2xl shadow-2xl border border-[#dfd5c5] bg-[#faf7f2]/98 backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-2.5 py-1.5 mb-1 border-b border-[#ebdcca]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#8c7a6e]">
                    Codepackr Family
                  </span>
                  <span className="text-[9.5px] px-1.5 py-0.5 rounded-full bg-emerald-600/10 text-emerald-700 font-mono font-medium">
                    100% Client-Side
                  </span>
                </div>

                <div className="space-y-1">
                  {CODEPACKR_FAMILY.map((item) => {
                    const isCurrent = item.id === CURRENT_PRODUCT;
                    const labelText = language === "ta" && item.labelTa ? item.labelTa : item.label;

                    return (
                      <div key={item.id}>
                        {isCurrent ? (
                          <div
                            aria-current="page"
                            className="flex items-center justify-between p-2 rounded-xl bg-[#8b2b18]/10 text-[#2d221b] font-semibold"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className={`size-7.5 rounded-lg flex items-center justify-center text-white bg-gradient-to-br ${item.gradient} shadow-xs shrink-0`}
                              >
                                <FamilyIcon id={item.id} size={14} />
                              </div>
                              <div className="min-w-0">
                                <div className="text-[12px] text-[#8b2b18] font-bold">
                                  {labelText}
                                </div>
                                <div className="text-[10px] text-[#7a685c] truncate">
                                  {item.description}
                                </div>
                              </div>
                            </div>
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold uppercase bg-[#8b2b18]/20 text-[#8b2b18]">
                              Active
                            </span>
                          </div>
                        ) : (
                          <a
                            href={item.href}
                            target={linkTarget}
                            rel={linkTarget === "_blank" ? "noopener noreferrer" : undefined}
                            className="flex items-center justify-between p-2 rounded-xl hover:bg-[#efe7db] transition-colors text-[#4a3b31]"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className={`size-7.5 rounded-lg flex items-center justify-center text-white bg-gradient-to-br ${item.gradient} opacity-90 shadow-xs shrink-0`}
                              >
                                <FamilyIcon id={item.id} size={14} />
                              </div>
                              <div className="min-w-0">
                                <div className="text-[12px] font-semibold text-[#2d221b]">
                                  {labelText}
                                </div>
                                <div className="text-[10px] text-[#7a685c] truncate">
                                  {item.description}
                                </div>
                              </div>
                            </div>
                            <ExternalLink size={12} className="opacity-40" />
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
