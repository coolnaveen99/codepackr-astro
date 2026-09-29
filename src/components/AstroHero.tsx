import type { Lang } from "@/lib/astro/i18n";
import { ArrowRight, ShieldCheck, Sparkles, Orbit } from "lucide-react";
import { useNav } from "@/lib/nav";

interface AstroHeroProps {
  lang: Lang;
}

/** Unique chart-centric Tamil-first hero — not the shared split + 3-card pattern */
export function AstroHero({ lang }: AstroHeroProps) {
  const { go } = useNav();
  const isTa = lang === "ta";

  return (
    <section className="relative overflow-hidden rounded-3xl border border-amber-200/80 bg-gradient-to-b from-amber-50 via-orange-50/40 to-white shadow-md">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-amber-600 via-orange-500 to-yellow-500" />
      <div className="pointer-events-none absolute -right-16 top-10 size-64 rounded-full bg-amber-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-12 bottom-0 size-48 rounded-full bg-orange-400/15 blur-3xl" />

      <div className="relative z-10 px-5 py-8 sm:px-10 sm:py-12">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/90 px-3 py-1 text-xs font-bold text-amber-800 shadow-2xs mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isTa ? "Next-Gen தமிழ் வேத ஜோதிடம் · 100% தனியுரிமை" : "Next-Gen Tamil Vedic Astrology · 100% Private"}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            {isTa ? (
              <>
                கோட்பேக்கர் ஆஸ்ட்ரோ
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-600 text-xl sm:text-3xl lg:text-4xl">
                  நவீன தலைமுறை ஜாதகம், பஞ்சாங்கம் &amp; ஜோதிட கருவிகள்
                </span>
              </>
            ) : (
              <>
                Codepackr Astro
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-600 text-xl sm:text-3xl lg:text-4xl">
                  Modern Tamil Jathagam, Panchangam &amp; Vedic Tools
                </span>
              </>
            )}
          </h1>

          <p className="mt-4 text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
            {isTa
              ? "நாசா JPL DE440 & VSOP87 விண்வெளி கணிதங்கள். மெக்கிர-செகண்ட் துல்லியம். 100% இலவசம் · Zero Data Tracking."
              : "NASA JPL DE440 & VSOP87 ephemeris. Arc-second precision. 100% free · Zero data tracking."}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => go("jathagam")}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-700 px-6 py-3 text-sm font-bold text-white shadow-md shadow-amber-700/25 hover:bg-amber-800 active:scale-95 transition cursor-pointer"
            >
              {isTa ? "ஜாதகம் உருவாக்க" : "Create Jathagam"}
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => document.getElementById("all-tools-section")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 hover:border-amber-400 transition cursor-pointer"
            >
              {isTa ? "அனைத்து கருவிகள் 20+" : "All tools 20+"}
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => go("jathagam")}
            className="rounded-2xl border border-amber-200/80 bg-white/95 p-4 text-left shadow-sm hover:border-amber-400 hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full border-2 border-amber-300 bg-amber-50 text-amber-800">
                <Orbit className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">{isTa ? "ஜாதகச் சக்கரம்" : "Birth Chart"}</div>
                <div className="text-xs text-slate-500">{isTa ? "1 · 6 · 30 பக்கங்கள் · HD PDF" : "1 · 6 · 30 pages · HD PDF"}</div>
              </div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => go("porutham")}
            className="rounded-2xl border border-orange-200/80 bg-white/95 p-4 text-left shadow-sm hover:border-orange-400 hover:shadow-md transition cursor-pointer"
          >
            <div className="text-sm font-bold text-slate-900 mb-1">{isTa ? "பொருத்தம்" : "Porutham"}</div>
            <div className="text-xs text-slate-500 mb-2">{isTa ? "10 பொருத்தங்கள்" : "10 match factors"}</div>
            <div className="flex gap-1">
              {[1,1,1,1,1,1,1,0,0,0].map((v,i) => (
                <div key={i} className={`h-2 flex-1 rounded ${v ? "bg-emerald-500" : "bg-slate-200"}`} />
              ))}
            </div>
          </button>
          <button
            type="button"
            onClick={() => go("daily-rasi")}
            className="rounded-2xl border border-yellow-200/80 bg-white/95 p-4 text-left shadow-sm hover:border-yellow-400 hover:shadow-md transition cursor-pointer"
          >
            <div className="text-sm font-bold text-slate-900">{isTa ? "தினசரி ராசிபலன்" : "Daily Rasi"}</div>
            <div className="text-xs text-slate-500 mt-1">{isTa ? "12 ராசிகள் · பஞ்சாங்கம்" : "12 signs · Panchangam"}</div>
            <div className="mt-2 flex items-end gap-0.5 h-6">
              {[40,55,35,70,50,80,45,60,55,75,40,65].map((h,i) => (
                <div key={i} className="flex-1 rounded-t bg-amber-400/70" style={{ height: `${h}%` }} />
              ))}
            </div>
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold text-slate-600">
          <span className="inline-flex items-center gap-1 rounded-lg bg-white/90 border border-slate-200 px-2 py-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            {isTa ? "100% தனியுரிமை" : "100% Privacy"}
          </span>
          <span className="rounded-lg bg-white/90 border border-slate-200 px-2 py-1">NASA JPL DE440</span>
          <span className="rounded-lg bg-white/90 border border-slate-200 px-2 py-1">VSOP87</span>
        </div>
      </div>
    </section>
  );
}
