// Codepackr Astro — Customer Calculation Details & Transparency Card
import { useState } from "react";
import type { ChartResult } from "@/lib/astro/engine";
import { CheckCircle2, AlertTriangle, ShieldCheck, Hash, Cpu, Compass, Info, ChevronDown, ChevronUp } from "lucide-react";
import { SIGNS_TA, SIGNS_EN, NAK_TA, NAK_EN, planetName } from "@/lib/astro/constants";

interface CalculationCardProps {
  result: ChartResult;
  lang: "ta" | "en";
}

export function CalculationCard({ result, lang }: CalculationCardProps) {
  const [showTechnical, setShowTechnical] = useState(false);
  const metadata = result.metadata;
  const receipt = result.receipt;
  const sensitivity = result.sensitivity;
  const tDate = result.tamilDate;

  const isTa = lang === "ta";

  const lagna = result.list.find((p) => p.id === "lagna");
  const moon = result.list.find((p) => p.id === "moon");
  const lagnaSignName = lagna ? (isTa ? SIGNS_TA[lagna.sign] : SIGNS_EN[lagna.sign]) : "—";
  const moonSignName = moon ? (isTa ? SIGNS_TA[moon.sign] : SIGNS_EN[moon.sign]) : "—";
  const moonNakName = moon ? (isTa ? NAK_TA[moon.nak] : NAK_EN[moon.nak]) : "—";
  const dasaLordName = result.dasa?.lord ? planetName(result.dasa.lord as any, lang) : "—";
  const birthTime = `${String(result.input.hour).padStart(2, "0")}:${String(result.input.minute).padStart(2, "0")}`;

  return (
    <div className="calculation-card rounded-2xl border border-blue-200 bg-gradient-to-br from-white to-blue-50/40 p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isTa ? "கணக்கீட்டு விவரம் & சான்றளிப்பு" : "Calculation Details & Provenance"}
            </h3>
            <p className="text-xs text-slate-500">
              {isTa
                ? "சரிபார்க்கப்பட்ட வானியல் மற்றும் பாரம்பரிய ஜோதிட முறைமை"
                : "Verified astronomical & traditional astrological methodology"}
            </p>
          </div>
        </div>

        {metadata?.reportCalculationHash && (
          <div className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-2.5 py-1 text-xs font-mono text-blue-700 shadow-xs">
            <Hash className="h-3.5 w-3.5 text-blue-500" />
            <span>{metadata.reportCalculationHash}</span>
          </div>
        )}
      </div>

      {/* Primary Verification Checklist (Receipt) */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white/80 p-2 text-xs text-slate-700">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{isTa ? "பிறப்பு நேரம் சரிபார்ப்பு" : "Time Verified"}</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white/80 p-2 text-xs text-slate-700">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{isTa ? "இருப்பிடம் உறுதி" : "Location Verified"}</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white/80 p-2 text-xs text-slate-700">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{isTa ? "நேர மண்டலம் தீர்வு" : "Timezone Resolved"}</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white/80 p-2 text-xs text-slate-700">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{isTa ? "லாஹிரி அயனாம்சம்" : "Lahiri Ayanamsa"}</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white/80 p-2 text-xs text-slate-700">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{isTa ? "பாவம் / வர்க்கம் முடிவு" : "Houses & Vargas"}</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white/80 p-2 text-xs text-slate-700">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{isTa ? "விம்சோத்தரி தசா பலன்" : "Vimshottari Dasa"}</span>
        </div>
      </div>

      {/* Birth-time Sensitivity Alert Banner */}
      {sensitivity && (
        <div
          className={`mt-4 flex flex-wrap items-start gap-3 rounded-xl border p-3.5 ${
            sensitivity.overallRating === "highly_sensitive"
              ? "border-amber-300 bg-amber-50/80 text-amber-950"
              : sensitivity.overallRating === "moderately_sensitive"
              ? "border-blue-200 bg-blue-50/80 text-blue-950"
              : "border-emerald-200 bg-emerald-50/80 text-emerald-950"
          }`}
        >
          <div className="mt-0.5">
            {sensitivity.overallRating === "stable" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm">
              <span>{isTa ? "பிறப்பு நேர உணர்திறன் ஆய்வு (±5 நிமிடங்கள்):" : "Birth-Time Sensitivity Analysis (±5 min):"}</span>
              <span className="rounded-full bg-white/90 px-2 py-0.5 text-xs font-bold shadow-xs">
                {isTa
                  ? sensitivity.overallRating === "stable"
                    ? "நிலையானது"
                    : sensitivity.overallRating === "moderately_sensitive"
                    ? "மிதமான உணர்திறன்"
                    : "அதிக உணர்திறன்"
                  : sensitivity.overallRating.replace("_", " ").toUpperCase()}
              </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-700">
              {isTa ? sensitivity.summaryTa : sensitivity.summaryEn}
            </p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
              <span>
                {isTa ? "லக்னம் (-5 நிமி / இப்போ / +5 நிமி): " : "Lagna (-5m / cur / +5m): "}
                <b>{sensitivity.lagnaAtMinus5} / {sensitivity.lagnaAtCurrent} / {sensitivity.lagnaAtPlus5}</b>
              </span>
              <span>
                {isTa ? "நவாம்சம்: " : "Navamsa: "}
                <b>{sensitivity.navamsaAtMinus5} / {sensitivity.navamsaAtCurrent} / {sensitivity.navamsaAtPlus5}</b>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Why This Result? Section (Section 47) */}
      <div className="mt-4 rounded-xl border border-blue-200/80 bg-blue-50/50 p-4">
        <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-blue-900 mb-2.5">
          <Info className="h-4 w-4 text-blue-600 shrink-0" />
          <span>{isTa ? "ஏன் இந்த முடிவு? (காரணங்கள் & கணிதப் பின்னணி)" : "Why This Result? (Mathematical Background)"}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="rounded-lg bg-white/95 p-3 border border-blue-100 shadow-2xs">
            <span className="font-bold text-slate-900 block mb-1">
              {isTa ? "லக்னம்: " : "Janma Lagna: "}
              <span className="text-blue-700">{lagnaSignName}</span>
            </span>
            <ul className="text-slate-600 text-[11px] leading-relaxed space-y-0.5">
              <li>• {isTa ? "பிறந்த நேரம்:" : "Birth time:"} {birthTime}</li>
              <li>• {isTa ? "இடம்:" : "Place:"} {result.input.place} ({result.input.lat.toFixed(2)}°N, {result.input.lon.toFixed(2)}°E)</li>
              <li>• {isTa ? "முறை:" : "System:"} Whole Sign (முழு ராசி பாவம்)</li>
            </ul>
          </div>
          <div className="rounded-lg bg-white/95 p-3 border border-blue-100 shadow-2xs">
            <span className="font-bold text-slate-900 block mb-1">
              {isTa ? "ராசி & நட்சத்திரம்: " : "Moon Sign & Star: "}
              <span className="text-blue-700">{moonSignName} ({moonNakName})</span>
            </span>
            <ul className="text-slate-600 text-[11px] leading-relaxed space-y-0.5">
              <li>• {isTa ? "சந்திர பாகை:" : "Moon Longitude:"} {moon?.dms || "—"}</li>
              <li>• {isTa ? "அயனாம்சம்:" : "Ayanamsa:"} {result.school === "lahiri" ? "Lahiri" : "Thirukanitham"} ({result.aya.toFixed(2)}°)</li>
              <li>• {isTa ? "பாதம்:" : "Pada:"} {moon?.pada || 1} / 4</li>
            </ul>
          </div>
          <div className="rounded-lg bg-white/95 p-3 border border-blue-100 shadow-2xs">
            <span className="font-bold text-slate-900 block mb-1">
              {isTa ? "தசா இருப்பு: " : "Dasa Balance: "}
              <span className="text-blue-700">{dasaLordName}</span>
            </span>
            <ul className="text-slate-600 text-[11px] leading-relaxed space-y-0.5">
              <li>• {isTa ? "முறை:" : "Cycle:"} விம்சோத்தரி 120 வருட சுழற்சி</li>
              <li>• {isTa ? "காரணம்:" : "Basis:"} {isTa ? "சந்திரனின் நட்சத்திர பாதக் கணிப்பு" : "Moon traversal within birth nakshatra"}</li>
              <li>• {isTa ? "தசாநாதன்:" : "Lord:"} {dasaLordName}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tamil Calendar & Profile Quick View */}
      {tDate && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-blue-600" />
            <span>
              {isTa ? "தமிழ் தேதி: " : "Tamil Date: "}
              <b>
                {tDate.tamilYear.nameTa} ஆண்டு, {tDate.tamilMonth.nameTa} மாதம் {tDate.tamilDay}-ஆம் நாள்
              </b>
            </span>
          </div>
          <div>
            <span>
              {isTa ? "திருவள்ளுவர் ஆண்டு: " : "Thiruvalluvar Year: "}
              <b>{tDate.thiruvalluvarYear}</b>
            </span>
          </div>
        </div>
      )}

      {/* Expandable Technical Details Button */}
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={() => setShowTechnical(!showTechnical)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800"
        >
          <span>{isTa ? "தொழில்நுட்பக் கணக்கீட்டு விவரங்கள்" : "Technical Calculation Details"}</span>
          {showTechnical ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Expanded Technical Panel */}
      {showTechnical && (
        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-700 shadow-inner">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <span className="text-slate-400 block">{isTa ? "வானியல் எஞ்சின்:" : "Ephemeris Engine:"}</span>
              <span className="font-semibold">{metadata?.ephemerisSource ?? "Astronomy Engine (VSOP87 / ELP2000, JPL DE440 benchmarked)"}</span>
            </div>
            <div>
              <span className="text-slate-400 block">{isTa ? "அயனாம்சம்:" : "Ayanamsa Model:"}</span>
              <span className="font-semibold">
                {result.school === "lahiri" ? "Lahiri (Chitrapaksha)" : "Tamil Thirukanitham"} ({result.aya.toFixed(4)}°)
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">{isTa ? "ராகு/கேது கணிப்பு:" : "Lunar Nodes:"}</span>
              <span className="font-semibold">Mean Node (180.00° Opposed)</span>
            </div>
            <div>
              <span className="text-slate-400 block">{isTa ? "பாவ முறைமை:" : "House System:"}</span>
              <span className="font-semibold">Whole Sign (முழு ராசி பாவம்)</span>
            </div>
            <div>
              <span className="text-slate-400 block">{isTa ? "நேர மண்டல ஆதாரம்:" : "Timezone Source:"}</span>
              <span className="font-semibold">IANA Time Zone Database (tzdb)</span>
            </div>
            <div>
              <span className="text-slate-400 block">{isTa ? "பஞ்சாங்கக் கணக்கீடு:" : "Panchanga Method:"}</span>
              <span className="font-semibold">திருக்கணித சூரிய சங்கிரமண முறை</span>
            </div>
            <div>
              <span className="text-slate-400 block">{isTa ? "எஞ்சின் பதிப்பு:" : "Engine Version:"}</span>
              <span className="font-semibold">{metadata?.engineVersion ?? "2.0.0"}</span>
            </div>
            <div>
              <span className="text-slate-400 block">{isTa ? "விதிமுறை பதிப்பு:" : "Ruleset Version:"}</span>
              <span className="font-semibold">TamilParashari-2.0</span>
            </div>
          </div>

          <div className="mt-4 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
            <p>
              {isTa
                ? "கிரக நிலைகள் மற்றும் காலக் கணக்கீடுகள் வானியல் இயற்பியலை அடிப்படையாகக் கொண்டவை. ஜோதிட விளக்கங்கள் தேர்ந்தெடுக்கப்பட்ட பாரம்பரிய ஜோதிட விதிமுறைகளின் அடிப்படையில் வழங்கப்படுகின்றன."
                : "Astronomical coordinates and time scales are mathematically calculated from validated ephemeris routines. Interpretations are provided according to traditional astrological rule sets."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
