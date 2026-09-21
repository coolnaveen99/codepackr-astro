// Codepackr Astro - Marriage Biodata Generator
import { ArrowLeftRight, Download, Printer, Upload } from "lucide-react";
import { useMemo, useRef, useState, type ReactNode, type Ref } from "react";
import { NAK_EN, NAK_TA, SIGNS_EN, SIGNS_TA } from "@/lib/astro/constants";
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
import { SouthChart } from "@/components/south-chart";
import { DateTimeFields, FieldSelect, PlaceSearch } from "@/components/birth-fields";
import { PrintDialog } from "@/components/print-dialog";
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
      console.error("PDF generation error, falling back to print dialog:", err);
      // If canvas generation encounters any unexpected issue, fallback to system print dialog
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
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20">
              {isGroom
                ? (lang === "ta" ? "மணமகன்" : "Groom")
                : (lang === "ta" ? "மணமகள்" : "Bride")}
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl">
            {isGroom
              ? (lang === "ta" ? "மணமகன் திருமண விவரப் படிவம்" : "Groom's Marriage Biodata")
              : (lang === "ta" ? "மணமகள் திருமண விவரப் படிவம்" : "Bride's Marriage Biodata")}
          </h2>
          <p className="mt-1 max-w-xl text-sm text-muted">
            {isGroom
              ? (lang === "ta" ? "மணமகன் திருமண விவரம் — சுயவிவரம், ஜாதகம், குடும்பம் மற்றும் எதிர்பார்ப்பு." : "Groom biodata with photo, horoscope and expectations.")
              : (lang === "ta" ? "மணமகள் திருமண விவரம் — சுயவிவரம், ஜாதகம், குடும்பம் மற்றும் எதிர்பார்ப்பு." : "Bride biodata with photo, horoscope and expectations.")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-accent text-accent hover:bg-accent hover:text-accent-fg font-medium"
            onClick={() => {
              try {
                window.print();
              } catch {
                // ignore
              }
              setShowPrintModal(true);
            }}
          >
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
          {/* Matrimonial Profile: Groom vs Bride Selector */}
          <Section title={lang === "ta" ? "வரன் தேர்வு" : "Profile Selection"}>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => patch({ birth: { ...bio.birth, sex: "M" } })}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-lg border text-sm font-medium transition-all text-center",
                  isGroom
                    ? "bg-accent text-accent-fg border-accent font-semibold shadow-md ring-2 ring-accent/30"
                    : "bg-surface text-fg border-border/80 hover:bg-elevated/60",
                )}
              >
                <span className="font-semibold text-sm">
                  {lang === "ta" ? "மணமகன்" : "Groom"}
                </span>
                <span className={cn("text-[11px] mt-0.5", isGroom ? "text-accent-fg/90" : "text-muted")}>
                  {lang === "ta" ? "Groom" : "Male"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => patch({ birth: { ...bio.birth, sex: "F" } })}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-lg border text-sm font-medium transition-all text-center",
                  !isGroom
                    ? "bg-accent text-accent-fg border-accent font-semibold shadow-md ring-2 ring-accent/30"
                    : "bg-surface text-fg border-border/80 hover:bg-elevated/60",
                )}
              >
                <span className="font-semibold text-sm">
                  {lang === "ta" ? "மணமகள்" : "Bride"}
                </span>
                <span className={cn("text-[11px] mt-0.5", !isGroom ? "text-accent-fg/90" : "text-muted")}>
                  {lang === "ta" ? "Bride" : "Female"}
                </span>
              </button>
            </div>
          </Section>

          {/* Photo Section (God image upload section removed) */}
          <Section
            title={
              isGroom
                ? (lang === "ta" ? "மணமகன் புகைப்படம்" : "Groom's Photo")
                : (lang === "ta" ? "மணமகள் புகைப்படம்" : "Bride's Photo")
            }
          >
            <label className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md bg-elevated text-sm font-medium hover:bg-elevated/80 transition-colors">
              <Upload className="size-4" />
              {bio.photo
                ? (lang === "ta" ? "புகைப்படத்தை மாற்றுக" : "Change Photo")
                : isGroom
                  ? (lang === "ta" ? "மணமகன் புகைப்படம் சேர்க்க" : "Upload Groom Photo")
                  : (lang === "ta" ? "மணமகள் புகைப்படம் சேர்க்க" : "Upload Bride Photo")}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => onPhoto(e.target.files?.[0])}
              />
            </label>
            {bio.photo && (
              <button
                type="button"
                onClick={() => patch({ photo: undefined })}
                className="text-xs text-red-600 hover:underline self-end"
              >
                {lang === "ta" ? "புகைப்படத்தை நீக்குக" : "Remove Photo"}
              </button>
            )}
          </Section>

          <Section title={t(lang, "personalSec")}>
            <Field
              label={
                isGroom
                  ? (lang === "ta" ? "மணமகன் பெயர்" : "Groom's Name")
                  : (lang === "ta" ? "மணமகள் பெயர்" : "Bride's Name")
              }
            >
              <Input
                value={bio.birth.name}
                placeholder={
                  isGroom
                    ? (lang === "ta" ? "மணமகன் பெயர் உள்ளிடவும்" : "Enter groom's name")
                    : (lang === "ta" ? "மணமகள் பெயர் உள்ளிடவும்" : "Enter bride's name")
                }
                onChange={(e) => patch({ birth: { ...bio.birth, name: e.target.value } })}
              />
            </Field>
            <DateTimeFields
              lang={lang}
              value={bio.birth}
              onChange={(birth) => patch({ birth })}
            />
            <PlaceSearch lang={lang} value={bio.birth} onChange={(birth) => patch({ birth })} id="bio-place" />
            <div className="grid grid-cols-2 gap-2">
              <Field
                label={t(lang, "height")}
                action={
                  <button
                    type="button"
                    onClick={handleToggleHeightUnit}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-accent hover:text-accent-hover px-1.5 py-0.5 rounded border border-accent/40 bg-accent/5 hover:bg-accent/15 transition-colors"
                    title={lang === "ta" ? "அளவை மாற்று (அடி ⇄ செ.மீ)" : "Swap unit (ft/in ⇄ cm)"}
                  >
                    <ArrowLeftRight className="h-3 w-3" />
                    <span>{heightUnit === "ft" ? (lang === "ta" ? "செ.மீ (cm)" : "cm") : (lang === "ta" ? "அடி (ft/in)" : "ft/in")}</span>
                  </button>
                }
              >
                <FieldSelect value={bio.height} onChange={(v) => patch({ height: v })}>
                  {!HEIGHT_OPTIONS.some((o) => (heightUnit === "ft" ? o.ft === bio.height : o.cm === bio.height)) && (
                    <option value={bio.height}>{bio.height}</option>
                  )}
                  {HEIGHT_OPTIONS.map((opt) => (
                    <option
                      key={opt.ft}
                      value={heightUnit === "ft" ? opt.ft : opt.cm}
                    >
                      {heightUnit === "ft" ? opt.ftLabel : opt.cmLabel}
                    </option>
                  ))}
                </FieldSelect>
              </Field>
              <Field label={t(lang, "complexion")}>
                <FieldSelect
                  value={bio.complexion}
                  onChange={(v) => patch({ complexion: v as Biodata["complexion"] })}
                >
                  {COMPLEXIONS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {lang === "ta" ? c.ta : c.en}
                    </option>
                  ))}
                </FieldSelect>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field label={t(lang, "blood")}>
                <FieldSelect value={bio.blood} onChange={(v) => patch({ blood: v })}>
                  {BLOODS.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </FieldSelect>
              </Field>
              <Field label={t(lang, "marital")}>
                <FieldSelect
                  value={bio.marital}
                  onChange={(v) => patch({ marital: v as Biodata["marital"] })}
                >
                  <option value="unmarried">{t(lang, "unmarried")}</option>
                  <option value="divorced">{t(lang, "divorced")}</option>
                  <option value="widowed">{t(lang, "widowed")}</option>
                </FieldSelect>
              </Field>
            </div>
            <Field label={t(lang, "religion")}>
              <Input value={bio.religion} onChange={(e) => patch({ religion: e.target.value })} />
            </Field>
            <Field label={t(lang, "caste")}>
              <Input value={bio.caste} onChange={(e) => patch({ caste: e.target.value })} />
            </Field>
            <Field label={t(lang, "gotra")}>
              <Input value={bio.gotra} onChange={(e) => patch({ gotra: e.target.value })} />
            </Field>
            <Field label={t(lang, "kulaDeivam")}>
              <Input value={bio.kulaDeivam} onChange={(e) => patch({ kulaDeivam: e.target.value })} />
            </Field>
            <Field label={t(lang, "native")}>
              <Input value={bio.native} onChange={(e) => patch({ native: e.target.value })} />
            </Field>
            <Field label={t(lang, "cityNow")}>
              <Input value={bio.cityNow} onChange={(e) => patch({ cityNow: e.target.value })} />
            </Field>
          </Section>

          <Section title={t(lang, "workSec")}>
            <Field label={t(lang, "education")}>
              <Input value={bio.education} onChange={(e) => patch({ education: e.target.value })} />
            </Field>
            <Field label={t(lang, "college")}>
              <Input value={bio.college} onChange={(e) => patch({ college: e.target.value })} />
            </Field>
            <Field label={t(lang, "work")}>
              <Input value={bio.work} onChange={(e) => patch({ work: e.target.value })} />
            </Field>
            <Field label={t(lang, "company")}>
              <Input value={bio.company} onChange={(e) => patch({ company: e.target.value })} />
            </Field>
            <Field label={t(lang, "income")}>
              <Input value={bio.income} onChange={(e) => patch({ income: e.target.value })} />
            </Field>
          </Section>

          <Section title={t(lang, "familySec")}>
            <Field label={t(lang, "father")}>
              <Input value={bio.father} onChange={(e) => patch({ father: e.target.value })} />
            </Field>
            <Field label={t(lang, "fatherJob")}>
              <Input value={bio.fatherJob} onChange={(e) => patch({ fatherJob: e.target.value })} />
            </Field>
            <Field label={t(lang, "mother")}>
              <Input value={bio.mother} onChange={(e) => patch({ mother: e.target.value })} />
            </Field>
            <Field label={t(lang, "motherJob")}>
              <Input value={bio.motherJob} onChange={(e) => patch({ motherJob: e.target.value })} />
            </Field>
            <Field label={t(lang, "siblings")}>
              <Input value={bio.siblings} onChange={(e) => patch({ siblings: e.target.value })} />
            </Field>
            <Field label={t(lang, "familyType")}>
              <FieldSelect
                value={bio.familyType}
                onChange={(v) => patch({ familyType: v as Biodata["familyType"] })}
              >
                <option value="joint">{t(lang, "joint")}</option>
                <option value="nuclear">{t(lang, "nuclear")}</option>
              </FieldSelect>
            </Field>
          </Section>

          <Section title={t(lang, "contactSec")}>
            <Field label={t(lang, "contactPerson")}>
              <Input
                value={bio.contactPerson}
                placeholder={
                  isGroom
                    ? (lang === "ta" ? "மணமகன் / தந்தை / பெற்றோர் பெயர்" : "Groom / Father / Parents Name")
                    : (lang === "ta" ? "மணமகள் பெற்றோர் / தந்தை பெயர்" : "Bride's Parents / Father Name")
                }
                onChange={(e) => patch({ contactPerson: e.target.value })}
              />
            </Field>
            <Field label={t(lang, "phone")}>
              <Input value={bio.phone} placeholder="98765 43210" onChange={(e) => patch({ phone: e.target.value })} />
            </Field>
            <Field label={t(lang, "email")}>
              <Input value={bio.email} placeholder="example@gmail.com" onChange={(e) => patch({ email: e.target.value })} />
            </Field>
            <Field label={t(lang, "address")}>
              <Input value={bio.address} onChange={(e) => patch({ address: e.target.value })} />
            </Field>
            <Field
              label={
                isGroom
                  ? (lang === "ta" ? "மணமகள் எதிர்பார்ப்பு" : "Bride Expectations")
                  : (lang === "ta" ? "மணமகன் எதிர்பார்ப்பு" : "Groom Expectations")
              }
            >
              <Input
                value={bio.expect}
                placeholder={
                  isGroom
                    ? (lang === "ta" ? "எ.கா: நல்ல குணமுள்ள, குடும்பப் பாங்கான மணமகள்" : "e.g., Seeking an educated, cultured bride")
                    : (lang === "ta" ? "எ.கா: நல்ல வேலையில் உள்ள, பண்பான மணமகன்" : "e.g., Seeking a well-settled, cultured groom")
                }
                onChange={(e) => patch({ expect: e.target.value })}
              />
            </Field>
          </Section>
        </form>

        <div className="min-w-0 overflow-x-auto">
          <BiodataSheet sheetRef={sheetRef} lang={lang} bio={bio} chart={chart} analysis={analysis} />
        </div>
      </div>

      {/* Interactive Print / Save as PDF Dialog */}
      <PrintDialog
        open={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        title={
          isGroom
            ? (lang === "ta" ? "மணமகன் திருமண விவர அச்சுப் பிரதி (A4)" : "Groom Marriage Biodata (A4 Print)")
            : (lang === "ta" ? "மணமகள் திருமண விவர அச்சுப் பிரதி (A4)" : "Bride Marriage Biodata (A4 Print)")
        }
        lang={lang}
        newTabUrl={`/?page=biodata&print=auto&sex=${bio.birth.sex}`}
      >
        <div className="mx-auto w-full max-w-[210mm]">
          <BiodataSheet sheetRef={null} lang={lang} bio={bio} chart={chart} analysis={analysis} />
        </div>
      </PrintDialog>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="font-display text-base">{title}</legend>
      {children}
    </fieldset>
  );
}

function Field({
  label,
  action,
  children,
}: {
  label: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <Label>{label}</Label>
        {action}
      </div>
      {children}
    </div>
  );
}

function BiodataSheet({
  lang,
  bio,
  chart,
  analysis,
  sheetRef,
}: {
  lang: Lang;
  bio: Biodata;
  chart: ReturnType<typeof compute> | null;
  analysis: ReturnType<typeof analyse> | null;
  sheetRef?: Ref<HTMLDivElement> | null;
}) {
  const { ganeshSrc } = useGanesh();
  const moon = chart?.list.find((p) => p.id === "moon");
  const lagna = chart?.list.find((p) => p.id === "lagna");
  const dob = `${String(bio.birth.day).padStart(2, "0")}-${String(bio.birth.month).padStart(2, "0")}-${bio.birth.year}`;
  const clockH = bio.birth.hour % 12 === 0 ? 12 : bio.birth.hour % 12;
  const ampm = bio.birth.hour < 12 ? t(lang, "am") : t(lang, "pm");
  const tob = `${clockH}:${String(bio.birth.minute).padStart(2, "0")} ${ampm}`;
  const complexion =
    bio.complexion === "fair"
      ? t(lang, "fair")
      : bio.complexion === "wheatish"
        ? t(lang, "wheatish")
        : bio.complexion === "very_fair"
          ? t(lang, "very_fair")
          : bio.complexion === "golden"
            ? t(lang, "golden")
            : bio.complexion === "wheatish_brown"
              ? t(lang, "wheatish_brown")
              : bio.complexion === "dusky"
                ? t(lang, "dusky")
                : (COMPLEXIONS.find((c) => c.id === bio.complexion)?.[lang] || bio.complexion);
  const marital =
    bio.marital === "divorced" ? t(lang, "divorced") : bio.marital === "widowed" ? t(lang, "widowed") : t(lang, "unmarried");

  const isGroom = bio.birth.sex === "M";

  const personal: [string, string][] = [
    [
      isGroom
        ? (lang === "ta" ? "மணமகன் பெயர்" : "Groom's Name")
        : (lang === "ta" ? "மணமகள் பெயர்" : "Bride's Name"),
      bio.birth.name || "—",
    ],
    [
      lang === "ta" ? "வரன்" : "Profile",
      isGroom
        ? (lang === "ta" ? "மணமகன்" : "Groom")
        : (lang === "ta" ? "மணமகள்" : "Bride"),
    ],
    [t(lang, "date"), dob],
    [t(lang, "time"), tob],
    [t(lang, "place"), bio.birth.place || "—"],
    [t(lang, "rasi"), moon ? signName(lang, moon.sign) : "—"],
    [t(lang, "nakshatra"), moon ? `${nakName(lang, moon.nak)} · ${t(lang, "pada")} ${moon.pada}` : "—"],
    [t(lang, "lagna"), lagna ? signName(lang, lagna.sign) : "—"],
    [t(lang, "height"), bio.height],
    [t(lang, "complexion"), complexion],
    [t(lang, "blood"), bio.blood],
    [t(lang, "marital"), marital],
    [t(lang, "religion"), bio.religion || "—"],
    [t(lang, "caste"), bio.caste || "—"],
    [t(lang, "gotra"), bio.gotra || "—"],
    [t(lang, "kulaDeivam"), bio.kulaDeivam || "—"],
    [t(lang, "native"), bio.native || "—"],
    [t(lang, "cityNow"), bio.cityNow || "—"],
  ];

  const work: [string, string][] = [
    [t(lang, "education"), bio.education || "—"],
    [t(lang, "college"), bio.college || "—"],
    [t(lang, "work"), bio.work || "—"],
    [t(lang, "company"), bio.company || "—"],
    [t(lang, "income"), bio.income || "—"],
  ];

  const family: [string, string][] = [
    [t(lang, "father"), [bio.father, bio.fatherJob].filter(Boolean).join(" · ") || "—"],
    [t(lang, "mother"), [bio.mother, bio.motherJob].filter(Boolean).join(" · ") || "—"],
    [t(lang, "siblings"), bio.siblings || "—"],
    [t(lang, "familyType"), bio.familyType === "nuclear" ? t(lang, "nuclear") : t(lang, "joint")],
  ];

  const contact: [string, string][] = [
    ...(bio.contactPerson ? [[t(lang, "contactPerson"), bio.contactPerson] as [string, string]] : []),
    [t(lang, "phone"), bio.phone || "—"],
    [t(lang, "email"), bio.email || "—"],
    [t(lang, "address"), bio.address || "—"],
  ];
  const defaultExpect = isGroom
    ? (lang === "ta" ? "நல்ல குணமுள்ள, குடும்பப் பாங்கான மணமகள் எதிர்பார்க்கப்படுகிறது." : "Seeking an educated, cultured and compatible bride.")
    : (lang === "ta" ? "நல்ல வேலையில் உள்ள, பண்பான மணமகன் எதிர்பார்க்கப்படுகிறது." : "Seeking a well-educated, cultured and professionally settled groom.");
  contact.push([
    isGroom
      ? (lang === "ta" ? "மணமகள் எதிர்பார்ப்பு" : "Bride Expectations")
      : (lang === "ta" ? "மணமகன் எதிர்பார்ப்பு" : "Groom Expectations"),
    bio.expect || defaultExpect,
  ]);

  return (
    <div
      ref={sheetRef ?? undefined}
      id="biodata-sheet"
      className="biodata-sheet relative mx-auto w-full max-w-[210mm] overflow-hidden bg-surface px-6 py-6 shadow-card sm:px-8 sm:py-8"
    >
      <div className="biodata-ornament pointer-events-none absolute inset-3 rounded-sm border-2 border-accent/50" />
      <Watermark />
      <div className="relative z-1">
        <div className="flex flex-col items-center justify-center">
          <img
            src={ganeshSrc}
            alt="Lord Ganesha"
            className="h-16 w-auto object-contain print:h-14"
          />
          <h2 className="font-display mt-1 text-center text-xl font-bold text-accent sm:text-2xl">
            {isGroom
              ? (lang === "ta" ? "மணமகன் திருமண விவரப் படிவம்" : "Groom's Marriage Biodata")
              : (lang === "ta" ? "மணமகள் திருமண விவரப் படிவம்" : "Bride's Marriage Biodata")}
          </h2>
          <div className="mt-1 inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20">
            {isGroom
              ? (lang === "ta" ? "மணமகன்" : "Groom")
              : (lang === "ta" ? "மணமகள்" : "Bride")}
          </div>
        </div>

        <div className="mt-4 flex gap-4">
          <div className="min-w-0 flex-1">
            <SheetBlock title={t(lang, "personalSec")} rows={personal} />
          </div>
          <div className="w-28 shrink-0 sm:w-36">
            {bio.photo ? (
              <img
                src={bio.photo}
                alt={bio.birth.name || (isGroom ? "Groom" : "Bride")}
                className="biodata-photo w-full rounded-sm object-cover shadow-card"
              />
            ) : (
              <div className="biodata-photo flex w-full flex-col items-center justify-center rounded-sm bg-elevated text-center p-2 text-xs text-muted">
                <span className="font-semibold text-fg">
                  {isGroom
                    ? (lang === "ta" ? "மணமகன் படம்" : "Groom Photo")
                    : (lang === "ta" ? "மணமகள் படம்" : "Bride Photo")}
                </span>
                <span className="text-[10px] text-muted mt-1">
                  {isGroom ? (lang === "ta" ? "மணமகன்" : "Groom") : (lang === "ta" ? "மணமகள்" : "Bride")}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <SheetBlock title={t(lang, "workSec")} rows={work} />
          <SheetBlock title={t(lang, "familySec")} rows={family} />
        </div>
        <SheetBlock title={t(lang, "contactSec")} rows={contact} />

        {chart ? (
          <section className="mt-4 break-inside-avoid print:mt-3">
            <h3 className="font-display border-b border-accent/40 pb-0.5 text-xs sm:text-sm tracking-wide text-accent uppercase">
              {lang === "ta" ? "ஜாதகக் கட்டங்கள்" : "Horoscope Charts"}
            </h3>
            <div className="mt-2 grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <p className="font-display mb-1 text-center text-xs font-semibold text-accent">
                  {t(lang, "d1")}
                </p>
                <SouthChart
                  positions={chart.list}
                  lang={lang}
                  mode="sign"
                  caption={t(lang, "d1")}
                  theme="light"
                />
              </div>
              <div>
                <p className="font-display mb-1 text-center text-xs font-semibold text-accent">
                  {t(lang, "d9")}
                </p>
                <SouthChart
                  positions={chart.list}
                  lang={lang}
                  mode="navamsa"
                  caption={t(lang, "d9")}
                  theme="light"
                />
              </div>
            </div>
          </section>
        ) : null}

        {/* Legal Disclaimer for Matrimonial Biodata */}
        <div className="mt-3 rounded border border-border/70 bg-elevated/40 p-2 text-left text-[9.5px] leading-relaxed text-muted print:mt-2 print:p-1.5 print:text-[9px]">
          <span className="font-semibold text-ink">{t(lang, "legalDisclaimerTitle")}: </span>
          <span>{t(lang, "biodataDisclaimer")}</span>
        </div>

        <footer className="mt-3 border-t border-accent/30 pt-2 flex items-center justify-between text-xs text-muted print:mt-2">
          <div className="flex items-center gap-2">
            <img src={ganeshSrc} alt="" className="h-5 w-auto object-contain" />
            <a
              href="https://astro.codepackr.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent hover:underline"
            >
              astro.codepackr.com
            </a>
            <span className="text-border">&bull;</span>
            <a href="mailto:codepackr@gmail.com" className="hover:underline text-[11px] text-accent font-medium">
              codepackr@gmail.com
            </a>
          </div>
          <span className="text-[10px] sm:text-[11px] text-muted">
            {lang === "ta"
              ? (isGroom
                  ? "தமிழ் ஜாதகம் & மணமகன் விவரம் · கணினி கணிப்பு"
                  : "தமிழ் ஜாதகம் & மணமகள் விவரம் · கணினி கணிப்பு")
              : (isGroom
                  ? "Tamil Horoscope & Groom Biodata · Computer Generated"
                  : "Tamil Horoscope & Bride Biodata · Computer Generated")}
          </span>
        </footer>
      </div>
    </div>
  );
}

function SheetBlock({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <section className="mt-3">
      <h3 className="font-display border-b border-accent/40 pb-0.5 text-xs sm:text-sm tracking-wide text-accent uppercase">
        {title}
      </h3>
      <table className="mt-1 w-full text-xs sm:text-sm">
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k}>
              <td className="w-[38%] py-0.5 pr-2 align-top text-muted">{k}</td>
              <td className="py-0.5 font-medium">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

