// Codepackr Astro - Marriage Biodata Generator
import { Download, Printer, Upload } from "lucide-react";
import { useMemo, useRef, useState, type ReactNode, type Ref } from "react";
import { NAK_EN, NAK_TA, SIGNS_EN, SIGNS_TA } from "@/lib/astro/constants";
import {
  BLOODS,
  COMPLEXIONS,
  DEFAULT_BIODATA,
  HEIGHT_OPTIONS,
  type Biodata,
} from "@/lib/astro/biodata";
import { compute } from "@/lib/astro/engine";
import { t, type Lang } from "@/lib/astro/i18n";
import { SouthChart } from "@/components/south-chart";
import { DateTimeFields, FieldSelect, PlaceSearch } from "@/components/birth-fields";
import { Watermark } from "@/components/watermark";
import { useGanesh } from "@/lib/ganesh-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

function signName(lang: Lang, i: number) {
  return lang === "ta" ? SIGNS_TA[i] : SIGNS_EN[i];
}
function nakName(lang: Lang, i: number) {
  return lang === "ta" ? NAK_TA[i] : NAK_EN[i];
}

export function BiodataMaker({ lang }: { lang: Lang }) {
  const [bio, setBio] = useState<Biodata>(DEFAULT_BIODATA);
  const [busy, setBusy] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const { ganeshSrc } = useGanesh();

  function patch(p: Partial<Biodata>) {
    setBio((b) => ({ ...b, ...p }));
  }

  const chart = useMemo(() => {
    try {
      return compute(bio.birth);
    } catch {
      return null;
    }
  }, [bio.birth]);
  const isGroom = bio.birth.sex === "M";

  async function downloadPdf() {
    const el = sheetRef.current;
    if (!el) return;
    setBusy(true);
    try {
      const { exportBiodataPdf } = await import("@/lib/biodata-pdf");
      const role = isGroom ? "Groom" : "Bride";
      const file = (bio.birth.name ? `${bio.birth.name}-${role}` : `${role}-marriage-biodata`).replace(/\s+/g, "-");
      await exportBiodataPdf(el, file);
    } catch (err) {
      console.error("PDF generation error, falling back to print:", err);
      window.print();
    } finally {
      setBusy(false);
    }
  }

  function onPhoto(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => patch({ photo: String(reader.result || "") });
    reader.readAsDataURL(file);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-10">
      <div className="no-print mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl">
            {isGroom
              ? lang === "ta" ? "மணமகன் திருமண விவரப் படிவம்" : "Groom's Marriage Biodata"
              : lang === "ta" ? "மணமகள் திருமண விவரப் படிவம்" : "Bride's Marriage Biodata"}
          </h2>
          <p className="mt-1 max-w-xl text-sm text-muted">
            {lang === "ta"
              ? "சுயவிவரம், ஜாதகம், குடும்பம் — ஒரு பக்க PDF."
              : "Profile, horoscope, family — single-page PDF."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-accent text-accent" onClick={() => window.print()}>
            <Printer className="size-4 mr-1" />
            {t(lang, "print")}
          </Button>
          <Button onClick={downloadPdf} disabled={busy}>
            <Download className="size-4 mr-1" />
            {t(lang, "downloadPdf")}
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_1fr]">
        <form className="no-print flex flex-col gap-4 rounded-xl bg-surface p-4 shadow-card sm:p-5">
          <Section title={lang === "ta" ? "வரன் தேர்வு" : "Profile"}>
            <div className="grid grid-cols-2 gap-2">
              {(["M", "F"] as const).map((sex) => (
                <button
                  key={sex}
                  type="button"
                  onClick={() => patch({ birth: { ...bio.birth, sex } })}
                  className={cn(
                    "rounded-lg border p-3 text-sm font-medium",
                    bio.birth.sex === sex
                      ? "bg-accent text-accent-fg border-accent"
                      : "border-border hover:bg-elevated",
                  )}
                >
                  {sex === "M"
                    ? lang === "ta" ? "மணமகன்" : "Groom"
                    : lang === "ta" ? "மணமகள்" : "Bride"}
                </button>
              ))}
            </div>
          </Section>

          <Section title={t(lang, "photo")}>
            <label className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md bg-elevated text-sm">
              <Upload className="size-4" />
              {bio.photo
                ? lang === "ta" ? "மாற்றுக" : "Change"
                : lang === "ta" ? "புகைப்படம் சேர்" : "Add photo"}
              <input type="file" accept="image/*" className="sr-only" onChange={(e) => onPhoto(e.target.files?.[0])} />
            </label>
          </Section>

          <Section title={t(lang, "personalSec")}>
            <Field label={t(lang, "name")}>
              <Input value={bio.birth.name} onChange={(e) => patch({ birth: { ...bio.birth, name: e.target.value } })} />
            </Field>
            <DateTimeFields lang={lang} value={bio.birth} onChange={(birth) => patch({ birth })} />
            <PlaceSearch lang={lang} value={bio.birth} onChange={(birth) => patch({ birth })} id="bio-place" />
            <div className="grid grid-cols-2 gap-2">
              <Field label={t(lang, "height")}>
                <FieldSelect value={bio.height} onChange={(v) => patch({ height: v })}>
                  {HEIGHT_OPTIONS.map((o) => (
                    <option key={o.ft} value={o.ft}>{o.ftLabel}</option>
                  ))}
                </FieldSelect>
              </Field>
              <Field label={t(lang, "complexion")}>
                <FieldSelect value={bio.complexion} onChange={(v) => patch({ complexion: v as Biodata["complexion"] })}>
                  {COMPLEXIONS.map((c) => (
                    <option key={c.id} value={c.id}>{lang === "ta" ? c.ta : c.en}</option>
                  ))}
                </FieldSelect>
              </Field>
            </div>
            <Field label={t(lang, "blood")}>
              <FieldSelect value={bio.blood} onChange={(v) => patch({ blood: v })}>
                {BLOODS.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </FieldSelect>
            </Field>
            <Field label={t(lang, "religion")}>
              <Input value={bio.religion} onChange={(e) => patch({ religion: e.target.value })} />
            </Field>
            <Field label={t(lang, "caste")}>
              <Input value={bio.caste} onChange={(e) => patch({ caste: e.target.value })} />
            </Field>
            <Field label={t(lang, "gotra")}>
              <Input value={bio.gotra} onChange={(e) => patch({ gotra: e.target.value })} />
            </Field>
            <Field label={t(lang, "native")}>
              <Input value={bio.native} onChange={(e) => patch({ native: e.target.value })} />
            </Field>
          </Section>

          <Section title={t(lang, "workSec")}>
            <Field label={t(lang, "education")}>
              <Input value={bio.education} onChange={(e) => patch({ education: e.target.value })} />
            </Field>
            <Field label={t(lang, "work")}>
              <Input value={bio.work} onChange={(e) => patch({ work: e.target.value })} />
            </Field>
            <Field label={t(lang, "company")}>
              <Input value={bio.company} onChange={(e) => patch({ company: e.target.value })} />
            </Field>
          </Section>

          <Section title={t(lang, "familySec")}>
            <Field label={t(lang, "father")}>
              <Input value={bio.father} onChange={(e) => patch({ father: e.target.value })} />
            </Field>
            <Field label={t(lang, "mother")}>
              <Input value={bio.mother} onChange={(e) => patch({ mother: e.target.value })} />
            </Field>
            <Field label={t(lang, "siblings")}>
              <Input value={bio.siblings} onChange={(e) => patch({ siblings: e.target.value })} />
            </Field>
          </Section>

          <Section title={t(lang, "contactSec")}>
            <Field label={t(lang, "phone")}>
              <Input value={bio.phone} onChange={(e) => patch({ phone: e.target.value })} />
            </Field>
            <Field label={t(lang, "email")}>
              <Input value={bio.email} onChange={(e) => patch({ email: e.target.value })} />
            </Field>
            <Field label={t(lang, "address")}>
              <Input value={bio.address} onChange={(e) => patch({ address: e.target.value })} />
            </Field>
          </Section>
        </form>

        <BiodataSheet ref={sheetRef} lang={lang} bio={bio} chart={chart} ganeshSrc={ganeshSrc} isGroom={isGroom} />
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">{title}</h3>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-xs text-muted">{label}</Label>
      {children}
    </div>
  );
}

function BiodataSheet({
  ref,
  lang,
  bio,
  chart,
  ganeshSrc,
  isGroom,
}: {
  ref: Ref<HTMLDivElement>;
  lang: Lang;
  bio: Biodata;
  chart: ReturnType<typeof compute> | null;
  ganeshSrc: string;
  isGroom: boolean;
}) {
  const moon = chart?.list?.find((b) => b.id === "moon");
  const lagnaBody = chart?.list?.find((b) => b.id === "lagna");
  const rasi = moon ? signName(lang, moon.sign) : "—";
  const nak = moon ? `${nakName(lang, moon.nak)} · ${moon.pada || ""}` : "—";
  const lagna = lagnaBody ? signName(lang, lagnaBody.sign) : "—";

  return (
    <div
      ref={ref}
      id="biodata-sheet"
      className="biodata-sheet relative mx-auto w-full max-w-[210mm] overflow-hidden bg-surface px-6 py-6 shadow-card sm:px-8 sm:py-8"
    >
      <div className="pointer-events-none absolute inset-3 rounded-sm border-2 border-accent/50" />
      <Watermark />
      <div className="relative z-1">
        <div className="flex flex-col items-center">
          <img src={ganeshSrc} alt="" className="h-14 w-auto object-contain" />
          <h2 className="font-display mt-1 text-center text-xl font-bold text-accent">
            {isGroom
              ? lang === "ta" ? "மணமகன் திருமண விவரப் படிவம்" : "Groom's Marriage Biodata"
              : lang === "ta" ? "மணமகள் திருமண விவரப் படிவம்" : "Bride's Marriage Biodata"}
          </h2>
        </div>

        <div className="mt-4 grid grid-cols-[1fr_auto] gap-4">
          <div className="space-y-1 text-sm">
            <Row k={t(lang, "name")} v={bio.birth.name || "—"} />
            <Row k={t(lang, "date")} v={`${bio.birth.day}/${bio.birth.month}/${bio.birth.year}`} />
            <Row k={t(lang, "time")} v={`${bio.birth.hour}:${String(bio.birth.minute).padStart(2, "0")}`} />
            <Row k={t(lang, "place")} v={bio.birth.place || "—"} />
            <Row k={t(lang, "height")} v={bio.height} />
            <Row k={t(lang, "complexion")} v={( () => {
              const cx = COMPLEXIONS.find((c) => c.id === bio.complexion);
              return cx ? (lang === "ta" ? cx.ta : cx.en) : bio.complexion;
            })()} />
            <Row k={t(lang, "blood")} v={bio.blood} />
            <Row k={t(lang, "religion")} v={bio.religion} />
            <Row k={t(lang, "caste")} v={bio.caste} />
            <Row k={t(lang, "gotra")} v={bio.gotra} />
            <Row k={t(lang, "native")} v={bio.native} />
            <Row k={t(lang, "education")} v={bio.education} />
            <Row k={t(lang, "work")} v={bio.work} />
            <Row k={t(lang, "company")} v={bio.company} />
            <Row k={t(lang, "father")} v={bio.father} />
            <Row k={t(lang, "mother")} v={bio.mother} />
            <Row k={t(lang, "siblings")} v={bio.siblings} />
            <Row k={t(lang, "phone")} v={bio.phone} />
            <Row k={t(lang, "email")} v={bio.email} />
          </div>
          {bio.photo ? (
            <img src={bio.photo} alt="" className="biodata-photo h-40 w-32 rounded object-cover border border-border" />
          ) : (
            <div className="biodata-photo flex h-40 w-32 items-center justify-center rounded border border-dashed border-border text-xs text-muted">
              {lang === "ta" ? "புகைப்படம்" : "Photo"}
            </div>
          )}
        </div>

        <div className="mt-4 border-t border-border/60 pt-3">
          <h3 className="font-display text-sm font-semibold text-accent mb-2">
            {lang === "ta" ? "ஜாதக விவரம்" : "Horoscope"}
          </h3>
          <div className="grid grid-cols-3 gap-2 text-sm mb-3">
            <Row k={t(lang, "rasi")} v={rasi} />
            <Row k={t(lang, "nakshatra")} v={nak} />
            <Row k={t(lang, "lagna")} v={lagna} />
          </div>
          {chart && (
            <div className="mx-auto max-w-[200px]">
              <SouthChart positions={chart.list} lang={lang} mode="sign" />
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-[10px] text-muted">
          {t(lang, "biodataDisclaimer")}
        </p>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-2 text-xs sm:text-sm">
      <span className="w-[40%] shrink-0 text-muted">{k}</span>
      <span className="font-medium">{v || "—"}</span>
    </div>
  );
}
