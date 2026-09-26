// Codepackr Astro — Multi-Year & Multi-Domain Forecast View
import { useState, useMemo } from "react";
import { generateHorizonForecast, type HorizonType } from "@/lib/astro/prediction/horizons";
import { DOMAIN_METADATA } from "@/lib/astro/prediction/domains";
import type { ChartResult } from "@/lib/astro/engine";
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  Layers,
  ShieldCheck,
  Hash,
  Activity,
  Briefcase,
  DollarSign,
  Heart,
  GraduationCap,
  Home,
  Car,
  Plane,
  HeartHandshake,
} from "lucide-react";

interface ForecastViewProps {
  lang: "ta" | "en";
  result?: ChartResult | null;
}

export function ForecastView({ lang, result }: ForecastViewProps) {
  const isTa = lang === "ta";
  const [horizon, setHorizon] = useState<HorizonType>("1yr");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [expandedWhy, setExpandedWhy] = useState<Record<string, boolean>>({});

  // Prepare chart evaluation data from result or sample default
  const chartData = useMemo(() => {
    if (result) {
      return {
        lagnaSign: result.list.find((b) => b.id === "lagna")?.sign ?? 0,
        moonSign: result.list.find((b) => b.id === "moon")?.sign ?? 0,
        activeMahaDasaLord: result.dasa.periods[0]?.lord ?? "saturn",
        activeBhuktiLord: "mercury",
        bodies: result.list.reduce(
          (acc, b) => ({
            ...acc,
            [b.id]: { sign: b.sign, house: b.house, retrograde: b.retrograde },
          }),
          {}
        ),
        yogas: [{ nameTa: "கஜகேசரி யோகம்", nameEn: "Gaja Kesari Yoga" }],
        sadeSatiActive: false,
      };
    }
    // Default fallback baseline
    return {
      lagnaSign: 0,
      moonSign: 6,
      activeMahaDasaLord: "jupiter",
      activeBhuktiLord: "saturn",
      bodies: {},
      yogas: [{ nameTa: "புத-ஆதித்ய யோகம்", nameEn: "Budha-Aditya Yoga" }],
      sadeSatiActive: false,
    };
  }, [result]);

  const forecast = useMemo(() => {
    return generateHorizonForecast(chartData, horizon);
  }, [chartData, horizon]);

  const toggleWhy = (key: string) => {
    setExpandedWhy((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getDomainIcon = (id: string) => {
    switch (id) {
      case "career":
        return <Briefcase className="h-4 w-4 text-blue-600" />;
      case "finance":
        return <DollarSign className="h-4 w-4 text-emerald-600" />;
      case "marriage":
        return <Heart className="h-4 w-4 text-rose-600" />;
      case "education":
        return <GraduationCap className="h-4 w-4 text-indigo-600" />;
      case "property":
        return <Home className="h-4 w-4 text-amber-600" />;
      case "vehicle":
        return <Car className="h-4 w-4 text-purple-600" />;
      case "travel":
      case "foreign":
        return <Plane className="h-4 w-4 text-sky-600" />;
      case "wellness":
        return <Activity className="h-4 w-4 text-teal-600" />;
      default:
        return <Sparkles className="h-4 w-4 text-blue-600" />;
    }
  };

  const badgeColor = (level: string) => {
    switch (level) {
      case "strong":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "caution":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "mixed":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const badgeLabel = (level: string) => {
    switch (level) {
      case "strong":
        return isTa ? "வலுவான ஆதரவு" : "Strong Support";
      case "caution":
        return isTa ? "நிதானக் காலம்" : "Caution Period";
      case "mixed":
        return isTa ? "கலவையான நிலை" : "Mixed Factors";
      default:
        return isTa ? "மிதமான ஆதரவு" : "Moderate Support";
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="rounded-3xl border border-blue-200 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 sm:p-10 text-white shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3.5 py-1 text-xs font-semibold text-blue-200 backdrop-blur-md">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{isTa ? "சான்றுடன் கூடிய பாரம்பரிய விளக்கம்" : "Traceable Evidence Architecture"}</span>
            </div>
            <h1 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight">
              {isTa ? "பல ஆண்டு ஜோதிட வழிகாட்டல் & பலன்கள்" : "Multi-Year Astrological Forecast"}
            </h1>
            <p className="mt-2 max-w-2xl text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isTa
                ? "தசா-புத்தி, கோச்சாரம் மற்றும் பாரம்பரிய ஜோதிட விதிமுறைகளின் சான்றுகளுடன் கூடிய 16 வாழ்வியல் பிரிவுகளின் காலக்கட்ட ஆய்வு."
                : "Multi-horizon forecast across 16 life domains based on deterministic classical rules, Dasa timeline, and Gochara transits."}
            </p>
          </div>

          {forecast.metadata?.reportCalculationHash && (
            <div className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 p-3.5 backdrop-blur-md text-xs font-mono">
              <Hash className="h-4 w-4 text-blue-300" />
              <div>
                <span className="text-[10px] text-blue-200 uppercase block font-sans">
                  {isTa ? "கணக்கீட்டு குறியீடு" : "Report Hash"}
                </span>
                <span className="font-bold text-white">{forecast.metadata.reportCalculationHash}</span>
              </div>
            </div>
          )}
        </div>

        {/* Horizon Picker */}
        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
          <span className="text-xs font-semibold text-blue-200 mr-2">
            {isTa ? "கால அளவு:" : "Forecast Horizon:"}
          </span>
          {[
            { id: "1yr", ta: "1 ஆண்டு (மாதாந்திரம்)", en: "1 Year (Monthly)" },
            { id: "3yr", ta: "3 ஆண்டுகள்", en: "3 Years" },
            { id: "5yr", ta: "5 ஆண்டுகள் (ஆண்டுதோறும்)", en: "5 Years (Yearly)" },
            { id: "10yr", ta: "10 ஆண்டுகள்", en: "10 Years" },
            { id: "20yr", ta: "20 ஆண்டுகள்", en: "20 Years" },
            { id: "60yr", ta: "60 ஆண்டுகள் (வாழ்வியல் சுழற்சி)", en: "60 Years (Lifecycle)" },
          ].map((h) => (
            <button
              key={h.id}
              type="button"
              onClick={() => setHorizon(h.id as HorizonType)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                horizon === h.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-2 ring-blue-400"
                  : "bg-white/10 text-blue-100 hover:bg-white/20"
              }`}
            >
              {isTa ? h.ta : h.en}
            </button>
          ))}
        </div>
      </div>

      {/* Domain Quick Filters */}
      <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setSelectedDomain("all")}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
            selectedDomain === "all"
              ? "bg-slate-900 text-white"
              : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          {isTa ? "அனைத்துப் பிரிவுகள் (16)" : "All Domains (16)"}
        </button>
        {DOMAIN_METADATA.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setSelectedDomain(d.id)}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              selectedDomain === d.id
                ? "bg-blue-700 text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {getDomainIcon(d.id)}
            <span>{isTa ? d.nameTa : d.nameEn}</span>
          </button>
        ))}
      </div>

      {/* Forecast Periods Stream */}
      <div className="space-y-6">
        {forecast.periods.map((period, pIdx) => {
          const displayedDomains =
            selectedDomain === "all"
              ? Object.values(period.domains)
              : [period.domains[selectedDomain]].filter(Boolean);

          return (
            <section
              key={pIdx}
              className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs"
            >
              {/* Period Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      {isTa ? period.labelTa : period.labelEn}
                    </h2>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span>
                      {isTa ? "தசா: " : "Dasa: "}
                      <b className="text-slate-800 uppercase">{period.mahaDasa ?? "N/A"}</b>
                    </span>
                    {period.bhukti && (
                      <span>
                        {isTa ? "புத்தி: " : "Bhukti: "}
                        <b className="text-slate-800 uppercase">{period.bhukti}</b>
                      </span>
                    )}
                    {period.tamilYear && (
                      <span>
                        {isTa ? "தமிழ் வருடம்: " : "Tamil Year: "}
                        <b className="text-slate-800">{period.tamilYear}</b>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{period.start} → {period.end}</span>
                </div>
              </div>

              {/* Domain Prediction Cards Grid */}
              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                {displayedDomains.map((dom) => {
                  const whyKey = `${pIdx}-${dom.id}`;
                  const isWhyOpen = !!expandedWhy[whyKey];

                  return (
                    <div
                      key={dom.id}
                      className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-4 hover:border-blue-200 transition-colors"
                    >
                      <div>
                        {/* Domain Card Header */}
                        <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                          <div className="flex items-center gap-2">
                            {getDomainIcon(dom.id)}
                            <h3 className="font-bold text-sm text-slate-900">
                              {isTa ? dom.titleTa : dom.titleEn}
                            </h3>
                          </div>
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${badgeColor(
                              dom.supportLevel
                            )}`}
                          >
                            {badgeLabel(dom.supportLevel)}
                          </span>
                        </div>

                        {/* Theme & Synthesis */}
                        <div className="mt-3 text-xs font-semibold text-blue-900">
                          {isTa ? dom.themeTa : dom.theme}
                        </div>
                        <p className="mt-2 text-xs text-slate-700 leading-relaxed">
                          {dom.traditionalInterpretation}
                        </p>

                        {/* Medical Disclaimer Banner if wellness */}
                        {dom.medicalDisclaimer && (
                          <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-[11px] text-amber-900">
                            <span className="font-bold block">
                              {isTa ? "மருத்துவப் பொறுப்புத் துறப்பு:" : "Health Disclaimer:"}
                            </span>
                            {isTa
                              ? "ஜோதிட விளக்கம் மருத்துவ பரிசோதனை அல்லது தகுதிபெற்ற மருத்துவர் ஆலோசனைக்கு மாற்றாகாது."
                              : "Astrological guidance is for cultural and lifestyle awareness only and does not substitute for qualified medical diagnosis or professional healthcare advice."}
                          </div>
                        )}
                      </div>

                      {/* Expandable "Why this result?" Trust Section */}
                      <div className="mt-4 border-t border-slate-200/60 pt-2.5">
                        <button
                          type="button"
                          onClick={() => toggleWhy(whyKey)}
                          className="flex w-full items-center justify-between text-xs font-bold text-indigo-700 hover:text-indigo-800"
                        >
                          <span className="flex items-center gap-1.5">
                            <HelpCircle className="h-3.5 w-3.5 text-indigo-600" />
                            {isTa ? "இந்த முடிவு ஏன்? (சான்றுகள்)" : "Why this result? (Evidence)"}
                          </span>
                          {isWhyOpen ? (
                            <ChevronUp className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5" />
                          )}
                        </button>

                        {isWhyOpen && (
                          <div className="mt-3 space-y-2 rounded-lg border border-indigo-100 bg-white p-3 text-[11px] text-slate-700">
                            {dom.evidence.natalFactors.length > 0 && (
                              <div>
                                <span className="font-bold text-slate-900 block">
                                  {isTa ? "ஜாதக அடிப்படை காரணிகள்:" : "Natal Factors:"}
                                </span>
                                <ul className="mt-0.5 list-disc list-inside space-y-0.5 text-slate-600">
                                  {dom.evidence.natalFactors.map((f, i) => (
                                    <li key={i}>{f}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {dom.evidence.supportingRules.length > 0 && (
                              <div>
                                <span className="font-bold text-emerald-800 block">
                                  {isTa ? "ஆதரிக்கும் பாரம்பரிய விதிகள்:" : "Supporting Traditional Rules:"}
                                </span>
                                <ul className="mt-0.5 list-disc list-inside space-y-0.5 text-emerald-700">
                                  {dom.evidence.supportingRules.map((f, i) => (
                                    <li key={i}>{f}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {dom.evidence.conflictingRules.length > 0 && (
                              <div>
                                <span className="font-bold text-amber-800 block">
                                  {isTa ? "எதிர் அல்லது நிதானக் காரணிகள்:" : "Caution / Conflicting Factors:"}
                                </span>
                                <ul className="mt-0.5 list-disc list-inside space-y-0.5 text-amber-700">
                                  {dom.evidence.conflictingRules.map((f, i) => (
                                    <li key={i}>{f}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <div className="pt-1 text-[10px] text-slate-400">
                              {isTa
                                ? "பாரம்பரிய ஜோதிட விதிமுறைகளின் அடிப்படையிலான விளக்கம். எதிர்கால முடிவுகள் எந்த நிலையிலும் உத்தரவாதப்படுத்தப்படவில்லை."
                                : "Interpretation based on traditional Jyotish principles. Future events are not deterministic or guaranteed."}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
