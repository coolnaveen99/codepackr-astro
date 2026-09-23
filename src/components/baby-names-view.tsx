// Codepackr Astro - Baby Name Finder by Nakshatra & Pada View
import { useState, useMemo } from "react";
import {
  queryBabyNames,
  type BabyGender,
  type NameCategory,
  type BabyNameItem,
} from "@/lib/astro/baby-names";
import { NAKSHATRA_DATA, getNakshatraDetail } from "@/lib/astro/nakshatra-tool";
import { type Lang } from "@/lib/astro/i18n";
import { cn } from "@/lib/utils";
import {
  Baby,
  Search,
  Sparkles,
  Heart,
  Copy,
  Check,
  Filter,
  BookmarkCheck,
  BookOpen,
} from "lucide-react";

export function BabyNamesView({
  lang,
  initialNakIdx = 0,
  initialPada = 1,
}: {
  lang: Lang;
  initialNakIdx?: number;
  initialPada?: number;
}) {
  const [selectedNak, setSelectedNak] = useState<number>(initialNakIdx);
  const [selectedPada, setSelectedPada] = useState<number>(initialPada);
  const [genderFilter, setGenderFilter] = useState<BabyGender | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<NameCategory | "all">("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const starDetail = useMemo(() => {
    return getNakshatraDetail(selectedNak, selectedPada);
  }, [selectedNak, selectedPada]);

  const names = useMemo(() => {
    return queryBabyNames({
      nakshatraIdx: selectedNak,
      pada: selectedPada,
      gender: genderFilter,
      category: categoryFilter,
      searchTerm,
    });
  }, [selectedNak, selectedPada, genderFilter, categoryFilter, searchTerm]);

  const handleCopy = (item: BabyNameItem) => {
    const text = `${item.nameTa} (${item.transliteration}) - ${item.meaningTa}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-10 space-y-6">
      {/* Header */}
      <div className="border-b border-border/70 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent mb-1.5">
          <Baby className="size-4" />
          <span>{lang === "ta" ? "பாரம்பரிய தமிழ்ப் பெயர் வழிகாட்டி" : "Astro Baby Naming Guide"}</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-ink">
          {lang === "ta" ? "குழந்தைப் பெயர் தேர்வு (நட்சத்திரம் & பாதம்)" : "Baby Name Finder by Nakshatra & Pada"}
        </h1>
        <p className="mt-1.5 text-sm sm:text-base text-muted max-w-3xl leading-relaxed">
          {lang === "ta"
            ? "பிறந்த நட்சத்திரம் மற்றும் பாதத்திற்குரிய அதிர்ஷ்ட தொடக்க எழுத்தில் தொடங்கும் தூய தமிழ், பாரம்பரிய மற்றும் நவீன பெயர்கள்."
            : "Explore auspicious Tamil baby names verified by nakshatra and pada syllables, with meanings in Tamil and English."}
        </p>
      </div>

      {/* Nakshatra & Pada Selection */}
      <div className="rounded-xl border border-border/80 bg-surface p-4 sm:p-5 shadow-xs space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2.5">
            {lang === "ta" ? "1. நட்சத்திரத்தைத் தேர்ந்தெடுக்கவும்:" : "1. Select Nakshatra:"}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {NAKSHATRA_DATA.map((n) => {
              const isSelected = selectedNak === n.idx;
              return (
                <button
                  key={n.idx}
                  type="button"
                  onClick={() => setSelectedNak(n.idx)}
                  className={cn(
                    "p-2 rounded-lg border text-center transition-all cursor-pointer",
                    isSelected
                      ? "border-accent bg-accent text-accent-fg font-semibold shadow-xs"
                      : "border-border/70 bg-elevated/40 hover:bg-elevated text-fg"
                  )}
                >
                  <div className="text-xs font-bold leading-tight">
                    {lang === "ta" ? n.ta : n.en}
                  </div>
                  <div className={cn("text-[9.5px] mt-0.5", isSelected ? "text-accent-fg/80" : "text-muted")}>
                    {lang === "ta" ? n.en : n.ta}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pada Selector */}
        <div className="pt-3 border-t border-border/60">
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
            {lang === "ta" ? "2. பாதம் (1 முதல் 4):" : "2. Pada (1 to 4):"}
          </label>
          <div className="grid grid-cols-4 gap-2 max-w-md">
            {[1, 2, 3, 4].map((p) => {
              const isSelected = selectedPada === p;
              const syllable = starDetail.allPadaSyllablesTa[p - 1];
              const syllableEn = starDetail.allPadaSyllablesEn[p - 1];
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSelectedPada(p)}
                  className={cn(
                    "p-2 rounded-lg border text-center cursor-pointer transition-all",
                    isSelected
                      ? "border-accent bg-accent text-accent-fg font-bold shadow-xs"
                      : "border-border/70 bg-elevated/50 hover:bg-elevated text-fg"
                  )}
                >
                  <div className="text-xs font-bold">
                    {lang === "ta" ? `பாதம் ${p}` : `Pada ${p}`}
                  </div>
                  <div className={cn("text-[11px] mt-0.5", isSelected ? "text-accent-fg" : "text-accent font-semibold")}>
                    '{syllable}' ({syllableEn})
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Syllable Announcement Strip */}
      <div className="rounded-xl border border-accent/40 bg-accent/10 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-accent">
            {lang === "ta" ? "பொருத்தமான நட்சத்திர பாதம் & எழுத்து" : "Active Syllable Rule"}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-ink mt-0.5">
            {lang === "ta" ? starDetail.nakTa : starDetail.nakEn} — {lang === "ta" ? `பாதம் ${starDetail.pada}` : `Pada ${starDetail.pada}`}
          </h2>
          <p className="text-xs text-muted mt-1">
            {lang === "ta" ? "இராசி:" : "Sign:"} {lang === "ta" ? starDetail.rasiTa : starDetail.rasiEn} ·{" "}
            {lang === "ta" ? "அதிபதி:" : "Lord:"} {lang === "ta" ? starDetail.lordTa : starDetail.lordEn}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-center rounded-xl bg-surface border border-border/80 px-4 py-2">
            <span className="text-[11px] font-bold text-muted uppercase block">
              {lang === "ta" ? "தொடக்க எழுத்து" : "Starting Letter"}
            </span>
            <span className="text-2xl font-extrabold text-accent">
              {starDetail.syllableTa} / {starDetail.syllableEn}
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="size-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={lang === "ta" ? "பெயர் அல்லது பொருள் தேடுக..." : "Search name or meaning..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-border/80 bg-surface pl-9 pr-3 py-2 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none"
          />
        </div>

        {/* Gender Filter */}
        <div>
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value as any)}
            className="w-full rounded-lg border border-border/80 bg-surface px-3 py-2 text-sm text-fg focus:border-accent focus:outline-none"
          >
            <option value="all">{lang === "ta" ? "அனைத்து பாலினமும் (ஆண் / பெண்)" : "All Genders (Boy / Girl)"}</option>
            <option value="boy">{lang === "ta" ? "ஆண் குழந்தை பெயர்கள்" : "Boy Names Only"}</option>
            <option value="girl">{lang === "ta" ? "பெண் குழந்தை பெயர்கள்" : "Girl Names Only"}</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="w-full rounded-lg border border-border/80 bg-surface px-3 py-2 text-sm text-fg focus:border-accent focus:outline-none"
          >
            <option value="all">{lang === "ta" ? "அனைத்துப் பிரிவுகளும்" : "All Categories"}</option>
            <option value="pure_tamil">{lang === "ta" ? "தூய தமிழ் பெயர்கள்" : "Pure Tamil Names"}</option>
            <option value="traditional">{lang === "ta" ? "பாரம்பரிய & இறைப் பெயர்கள்" : "Traditional Names"}</option>
            <option value="modern">{lang === "ta" ? "நவீன பெயர்கள்" : "Modern Names"}</option>
          </select>
        </div>
      </div>

      {/* Names Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 text-xs text-muted">
          <span>
            {lang === "ta" ? "கிடைத்துள்ள பெயர்கள்:" : "Available names found:"}{" "}
            <strong className="text-ink font-bold">{names.length}</strong>
          </span>
          <span>{lang === "ta" ? "நேரடி தமிழ் பொருள் விளக்கம்" : "Verified Tamil Etymology"}</span>
        </div>

        {names.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/80 p-10 text-center text-muted">
            <BookOpen className="size-8 mx-auto mb-2 text-muted/60" />
            <p className="font-semibold text-ink text-sm">
              {lang === "ta" ? "இந்த வடிகட்டலில் பெயர்கள் இல்லை" : "No names match your current filters"}
            </p>
            <p className="text-xs text-muted mt-1">
              {lang === "ta" ? "வடிகட்டலை மாற்றி அல்லது தேடல் சொல்லை நீக்கி முயற்சிக்கவும்." : "Try clearing your search term or adjusting filters."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {names.map((item) => {
              const isCopied = copiedId === item.id;
              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-border/70 bg-surface p-4 shadow-2xs hover:border-accent/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={cn(
                              "rounded px-1.5 py-0.5 text-[9.5px] font-bold uppercase",
                              item.gender === "boy"
                                ? "bg-blue-500/10 text-blue-700 dark:text-blue-300"
                                : item.gender === "girl"
                                ? "bg-rose-500/10 text-rose-700 dark:text-rose-300"
                                : "bg-purple-500/10 text-purple-700 dark:text-purple-300"
                            )}
                          >
                            {item.gender === "boy"
                              ? (lang === "ta" ? "ஆண்" : "Boy")
                              : item.gender === "girl"
                              ? (lang === "ta" ? "பெண்" : "Girl")
                              : (lang === "ta" ? "இருபாலர்" : "Unisex")}
                          </span>

                          <span className="rounded bg-elevated px-1.5 py-0.5 text-[9.5px] font-medium text-muted">
                            {item.category === "pure_tamil"
                              ? (lang === "ta" ? "தூய தமிழ்" : "Pure Tamil")
                              : item.category === "traditional"
                              ? (lang === "ta" ? "பாரம்பரியம்" : "Traditional")
                              : (lang === "ta" ? "நவீனம்" : "Modern")}
                          </span>
                        </div>

                        <h3 className="font-display text-lg font-bold text-ink mt-1.5">
                          {item.nameTa}
                          <span className="text-xs font-normal text-muted ml-1.5">
                            ({item.transliteration})
                          </span>
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopy(item)}
                        className="rounded-lg border border-border/60 bg-elevated/50 p-1.5 text-muted hover:text-fg hover:bg-elevated transition-colors cursor-pointer"
                        title={lang === "ta" ? "பெயரை நகலெடு" : "Copy Name"}
                      >
                        {isCopied ? (
                          <Check className="size-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </button>
                    </div>

                    <p className="mt-2 text-xs text-fg leading-relaxed">
                      <strong className="text-muted block text-[10.5px] uppercase font-semibold">
                        {lang === "ta" ? "பொருள்:" : "Meaning:"}
                      </strong>
                      {lang === "ta" ? item.meaningTa : item.meaningEn}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-border/40 text-[10.5px] text-muted flex items-center justify-between">
                    <span>
                      {lang === "ta" ? "எழுத்து:" : "Letter:"}{" "}
                      <strong className="text-accent">{item.startingSyllable}</strong>
                    </span>
                    <span>{item.source}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
