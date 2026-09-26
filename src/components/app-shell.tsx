// Codepackr Astro - Elevated App Shell & Auspicious Header Navigation
import { useState, useRef, useEffect, type ReactNode } from "react";
import {
  Compass,
  HeartHandshake,
  CalendarDays,
  Sparkles,
  Hash,
  HelpCircle,
  FileText,
  BookOpen,
  Mail,
  Menu,
  X,
  ShieldCheck,
  ChevronDown,
  Moon,
  Orbit,
  Baby,
  Clock,
} from "lucide-react";
import { t } from "@/lib/astro/i18n";
import { useLang } from "@/lib/lang";
import { useNav, type Page } from "@/lib/nav";
import { RotatingQuote } from "@/components/rotating-quote";
import { cn } from "@/lib/utils";
import { CodepackrFamilyBar } from "@/components/CodepackrFamilyBar";

// Primary Navigation (Core Vedic Astrological Services)
const PRIMARY_NAV: { id: Page; labelKey: string; shortTa: string; shortEn: string; icon: typeof Compass }[] = [
  { id: "jathagam", labelKey: "navChart", shortTa: "ஜாதகம்", shortEn: "Horoscope", icon: Compass },
  { id: "porutham", labelKey: "navPorutham", shortTa: "பொருத்தம்", shortEn: "Porutham", icon: HeartHandshake },
  { id: "panchangam", labelKey: "navPanchang", shortTa: "பஞ்சாங்கம்", shortEn: "Panchangam", icon: CalendarDays },
  { id: "biodata", labelKey: "navBiodata", shortTa: "பயோடேட்டா", shortEn: "Biodata", icon: FileText },
  { id: "rasipalan", labelKey: "navRasiPalan", shortTa: "ராசி பலன்", shortEn: "Rasi Palan", icon: Sparkles },
];
