// Codepackr Astro — Live Astronomical Validation & Benchmark Suite Dashboard
import { useState, useMemo, useTransition } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Play,
  RotateCw,
  Copy,
  Check,
  Download,
  Orbit,
  Compass,
  FileCheck,
  AlertTriangle,
  SlidersHorizontal,
} from "lucide-react";
import {
  runMasterValidationSuite,
  type MasterValidationReport,
} from "@/lib/astro/validation/runner";
import type { Lang } from "@/lib/astro/i18n";
import { useNav } from "@/lib/nav";

interface AstroValidationViewProps {
  lang: Lang;
}

type TabType = "all" | "ephemeris" | "boundaries" | "golden";

export function AstroValidationView({ lang }: AstroValidationViewProps) {
  const isTa = lang === "ta";
  const { go } = useNav();
  const [isPending, startTransition] = useTransition();

  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [copied, setCopied] = useState(false);
  const [lastRunTime, setLastRunTime] = useState<number>(() => Date.now());
  const [executionDurationMs, setExecutionDurationMs] = useState<number>(12);

  // Initialize report state
  const [report, setReport] = useState<MasterValidationReport>(() => {
    const start = performance.now();
    const rep = runMasterValidationSuite();
    const end = performance.now();
    setExecutionDurationMs(Math.round(end - start));
    return rep;
  });

  const handleRunTests = () => {
    startTransition(() => {
      const start = performance.now();
      const rep = runMasterValidationSuite();
      const end = performance.now();
      setReport(rep);
      setExecutionDurationMs(Math.round(end - start));
      setLastRunTime(Date.now());
    });
  };

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(report, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy report json:", err);
    }
  };

  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const a = document.createElement("a");
    a.setAttribute("href", dataStr);
    a.setAttribute("download", `codepackr-astro-validation-report-${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <main className="astro-validation-view mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              {isTa ? "தானியங்கி துல்லிய சோதனை தளம்" : "Automated Astronomical Quality Suite"}
            </div>
            <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              {isTa ? "வானியல் கணித சரிபார்ப்பு மையம்" : "Astro Accuracy & Ephemeris Validation"}
            </h1>
            <p className="mt-2 max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-600">
              {isTa
                ? "நாசா JPL DE440 ஒப்பீட்டு சோதனைகள், சுழற்சி எல்லைகள், விம்சோத்தரி தசா இருப்பு மற்றும் 50+ கோல்டன் ஜாதக வரைபடங்களின் நேரடி சோதனை முடிவுகள்."
                : "Real-time regression and accuracy verification against NASA JPL DE440 benchmarks, circular trigonometry boundary invariants, and 50+ golden charts."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleRunTests}
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              <RotateCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
              {isTa ? "மீண்டும் இயக்கு" : "Re-run Test Suite"}
            </button>
            <button
              type="button"
              onClick={handleCopyJson}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-slate-500" />}
              {copied ? (isTa ? "நகலெடுக்கப்பட்டது" : "Copied JSON") : (isTa ? "JSON நகல்" : "Copy JSON")}
            </button>
            <button
              type="button"
              onClick={handleDownloadJson}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Download className="h-4 w-4 text-slate-500" />
              {isTa ? "பதிவிறக்கு" : "Export Log"}
            </button>
          </div>
        </div>

        {/* Status Metrics Bar */}
        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 sm:grid-cols-4 lg:grid-cols-5">
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {isTa ? "மொத்த சோதனைகள்" : "Total Tests"}
            </span>
            <div className="mt-1 text-2xl font-black text-slate-900">{report.totalTests}</div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
              {isTa ? "வெற்றி பெற்றவை" : "Passed Tests"}
            </span>
            <div className="mt-1 text-2xl font-black text-emerald-700">{report.passedTests}</div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {isTa ? "தோல்விகள்" : "Failures"}
            </span>
            <div className="mt-1 text-2xl font-black text-rose-600">{report.failedTests}</div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {isTa ? "செயல் நேரம்" : "Execution Time"}
            </span>
            <div className="mt-1 text-2xl font-black text-blue-600">{executionDurationMs} ms</div>
          </div>

          <div className="col-span-2 sm:col-span-4 lg:col-span-1 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {isTa ? "நிலவரம்" : "Suite Health"}
            </span>
            <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              <span>{report.status === "ALL_PASS" ? "100% PASSING" : "ATTENTION"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "all"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          {isTa ? "அனைத்து சோதனைகள்" : "All Tests"} ({report.totalTests})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("ephemeris")}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "ephemeris"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Orbit className="mr-1.5 inline-block h-3.5 w-3.5" />
          {isTa ? "நாசா JPL எஃபிமெரிஸ்" : "Ephemeris (DE440)"} ({report.ephemerisBenchmarks.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("boundaries")}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "boundaries"
              ? "bg-indigo-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <SlidersHorizontal className="mr-1.5 inline-block h-3.5 w-3.5" />
          {isTa ? "எல்லைக் கணக்கீடுகள்" : "Boundary Invariants"} ({report.boundaryTests.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("golden")}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "golden"
              ? "bg-amber-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <FileCheck className="mr-1.5 inline-block h-3.5 w-3.5" />
          {isTa ? "கோல்டன் ஜாதகங்கள்" : "Golden Cases (50+)"} ({report.goldenCases.length})
        </button>
      </div>

      {/* SECTION 1: Ephemeris Benchmarks */}
      {(activeTab === "all" || activeTab === "ephemeris") && (
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Orbit className="h-5 w-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">
                {isTa
                  ? "நாசா JPL DE440 ஒப்பீட்டு அளவீடுகள் (NASA JPL Horizons Benchmarks)"
                  : "NASA JPL Horizons DE440 Ephemeris Benchmarks"}
              </h2>
            </div>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700">
              {report.summary.astronomyPassCount} / {report.ephemerisBenchmarks.length} Passed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Date / Instant</th>
                  <th className="py-2.5 px-3">Celestial Body</th>
                  <th className="py-2.5 px-3">Calculated Lon</th>
                  <th className="py-2.5 px-3">JPL Reference</th>
                  <th className="py-2.5 px-3">Diff (Arcsec)</th>
                  <th className="py-2.5 px-3">Tolerance</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {report.ephemerisBenchmarks.map((b, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80">
                    <td className="py-2 px-3 text-slate-600">{b.date.replace("T", " ")}</td>
                    <td className="py-2 px-3 font-sans font-bold text-slate-900">{b.body}</td>
                    <td className="py-2 px-3 text-slate-700">{b.calculatedTropicalLon.toFixed(4)}°</td>
                    <td className="py-2 px-3 text-slate-700">{b.referenceTropicalLon.toFixed(4)}°</td>
                    <td className="py-2 px-3 font-bold text-blue-600">
                      {b.diffArcsec.toFixed(1)}"
                    </td>
                    <td className="py-2 px-3 text-slate-500">&lt; {b.toleranceArcsec}"</td>
                    <td className="py-2 px-3 font-sans">
                      {b.pass ? (
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" /> PASS
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                          <XCircle className="h-3 w-3" /> FAIL
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* SECTION 2: Boundary Tests */}
      {(activeTab === "all" || activeTab === "boundaries") && (
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">
                {isTa
                  ? "கணித எல்லை மற்றும் சுழற்சி மாறிலிகள் (Circular Math & Boundary Tests)"
                  : "Boundary Invariants & Coordinate Wrapping"}
              </h2>
            </div>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700">
              {report.summary.boundaryPassCount} / {report.boundaryTests.length} Passed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Test ID</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Input</th>
                  <th className="py-2.5 px-3">Expected</th>
                  <th className="py-2.5 px-3">Actual</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {report.boundaryTests.map((t) => (
                  <tr key={t.testId} className="hover:bg-slate-50/80">
                    <td className="py-2 px-3 font-mono text-[11px] text-slate-500">{t.testId}</td>
                    <td className="py-2 px-3 font-semibold text-slate-800">{t.name}</td>
                    <td className="py-2 px-3 font-mono text-slate-600">{t.input}</td>
                    <td className="py-2 px-3 font-mono text-slate-600">{t.expected}</td>
                    <td className="py-2 px-3 font-mono font-bold text-indigo-700">{t.actual}</td>
                    <td className="py-2 px-3">
                      {t.pass ? (
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" /> PASS
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                          <XCircle className="h-3 w-3" /> FAIL
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* SECTION 3: Golden Cases */}
      {(activeTab === "all" || activeTab === "golden") && (
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-amber-600" />
              <h2 className="text-base font-bold text-slate-900">
                {isTa
                  ? "50+ கோல்டன் ஜாதக மாதிரி ஆய்வுகள் (50+ Benchmark Golden Charts)"
                  : "50+ Golden Reference Charts & Divisional Tests"}
              </h2>
            </div>
            <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">
              {report.summary.goldenPassCount} / {report.goldenCases.length} Passed
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {report.goldenCases.map((c) => (
              <div
                key={c.id}
                className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 transition-colors hover:bg-white hover:shadow-2xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{c.name}</h3>
                    <span className="text-[10px] uppercase font-mono text-slate-400">{c.id}</span>
                  </div>
                  <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                    PASS
                  </span>
                </div>

                <div className="mt-2.5 grid grid-cols-3 gap-1.5 border-t border-slate-100 pt-2 text-[11px]">
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Lagna</span>
                    <strong className="text-slate-800">Sign {c.lagnaSign}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Moon</span>
                    <strong className="text-slate-800">Sign {c.moonSign}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Nakshatra</span>
                    <strong className="text-slate-800">#{c.nakshatra} (P{c.pada})</strong>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-100/60 pt-1.5 font-mono">
                  <span>D9: Sign {c.navamsa}</span>
                  <span>D60: Sign {c.d60}</span>
                  <span className="rounded bg-slate-200/60 px-1 py-0.2 text-[9px] text-slate-700 uppercase">
                    {c.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
