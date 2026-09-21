// Codepackr Astro - Marriage Biodata Generator
import { ArrowLeftRight, Download, Printer, Upload } from "lucide-react";
import { useMemo, useRef, useState, type ReactNode, type Ref } from "react";
import { analyse } from "@/lib/astro/analysis";
import {
  BLOODS,
  COMPLEXIONS,
  DEFAULT_BIODATA,
  HEIGHT_OPTIONS,
  formatCm,
  formatFtInch,
  parseHeightToInches,
  type Biodata,
} from "@/lib/astro/biodata";
import { compute } from "@/lib/astro/engine";
import { t, type Lang } from "@/lib/astro/i18n";
import { DateTimeFields, FieldSelect, PlaceSearch } from "@/components/birth-fields";
import { PrintDialog } from "@/components/print-dialog";
import { Watermark } from "@/components/watermark";
import { BiodataSheet } from "@/components/biodata-sheet";
import { useGanesh } from "@/lib/ganesh-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function BiodataMaker({ lang }: { lang: Lang }) {
  const [bio, setBio] = useState<Biodata>(DEFAULT_BIODATA);
  const [busy, setBusy] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [heightUnit, setHeightUnit] = useState<"ft" | "cm">(() =>
    bio.height.toLowerCase().includes("cm") ? "cm" : "ft"
  );
  const sheetRef = useRef<HTMLDivElement>(null);

  function patch(p: Partial<Biodata>) {
    setBio((b) => ({ ...b, ...p }));
  }

  function handleToggleHeightUnit() {
    const nextUnit = heightUnit === "ft" ? "cm" : "ft";
    setHeightUnit(nextUnit);
    const totalInches = parseHeightToInches(bio.height);
    if (totalInches) {
      patch({ height: nextUnit === "cm" ? formatCm(totalInches) : formatFtInch(totalInches) });
    }
  }

  const chart = useMemo(() => {
    try {
      return compute(bio.birth);
    } catch {
      return null;
    }
  }, [bio.birth]);
  const analysis = useMemo(() => (chart ? analyse(chart) : null), [chart]);

  async function downloadPdf() {
    const el = sheetRef.current;
    if (!el) return;
    setBusy(true);
    try {
      const { default: html2canvas } = await import("html2canvas-pro");
      const { jsPDF } = await import("jspdf");
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#fffaf3",
        logging: false,
      });
      const img = canvas.toDataURL("image/jpeg", 0.93);
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = 210;
      const pageH = 297;
      const imgH = (canvas.height * pageW) / canvas.width;
      if (imgH <= pageH) {
        pdf.addImage(img, "JPEG", 0, 0, pageW, imgH);
      } else {
        let y = 0;
        let left = imgH;
        while (left > 0) {
          pdf.addImage(img, "JPEG", 0, y === 0 ? 0 : -(imgH - left), pageW, imgH);
          left -= pageH;
          if (left > 0) {
            pdf.addPage();
            y = 1;
          }
        }
      }
      const role = bio.birth.sex === "M" ? "Groom" : "Bride";
      const file = (bio.birth.name ? `${bio.birth.name}-${role}` : `${role}-marriage-biodata`).replace(/\s+/g, "-");
      pdf.save(`${file}.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
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

  const isGroom = bio.birth.sex === "M";

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-10">
      <div className="no-print mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl">
            {isGroom
              ? (lang === "ta" ? "மணமகன் திருமண விவரப் படிவம்" : "Groom's Marriage Biodata")
              : (lang === "ta" ? "மணமகள் திருமண விவரப் படிவம்" : "Bride's Marriage Biodata")}
          </h2>
          <p className="mt-1 max-w-xl text-sm text-muted">
            {lang === "ta"
              ? "சுயவிவரம், ராசி & நவாம்சம், குடும்பம் — PDF பதிவிறக்க."
              : "Profile, Rasi & Navamsa, family — download PDF."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-accent text-accent" onClick={() => setShowPrintModal(true)}>
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
                <div className="flex gap-1">
                  <FieldSelect value={bio.height} onChange={(v) => patch({ height: v })} className="flex-1">
                    {HEIGHT_OPTIONS.map((o) => (
                      <option key={o.ft} value={heightUnit === "cm" ? o.cmLabel : o.ftLabel}>
                        {heightUnit === "cm" ? o.cmLabel : o.ftLabel}
                      </option>
                    ))}
                  </FieldSelect>
                  <Button type="button" variant="outline" size="icon" onClick={handleToggleHeightUnit} title="ft/cm">
                    <ArrowLeftRight className="size-4" />
                  </Button>
                </div>
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
            <Field label={t(lang, "marital")}>
              <FieldSelect value={bio.marital} onChange={(v) => patch({ marital: v as Biodata["marital"] })}>
                <option value="unmarried">{t(lang, "unmarried")}</option>
                <option value="divorced">{t(lang, "divorced")}</option>
                <option value="widowed">{t(lang, "widowed")}</option>
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

        <BiodataSheet sheetRef={sheetRef} lang={lang} bio={bio} chart={chart} analysis={analysis} />
      </div>

      {showPrintModal && (
        <PrintDialog open={showPrintModal} onClose={() => setShowPrintModal(false)} lang={lang}>
          <BiodataSheet sheetRef={null} lang={lang} bio={bio} chart={chart} analysis={analysis} />
        </PrintDialog>
      )}
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

function Field({ label, children, action }: { label: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted">{label}</Label>
        {action}
      </div>
      {children}
    </div>
  );
}
