// Codepackr Astro - Marriage Biodata Generator
import { Download, Printer, Upload } from "lucide-react";
import { useMemo, useRef, useState, type ReactNode, type Ref } from "react";
import { NAK_EN, NAK_TA, SIGNS_EN, SIGNS_TA } from "@/lib/astro/constants";
import { analyse } from "@/lib/astro/analysis";
import { BLOODS, DEFAULT_BIODATA, HEIGHTS, type Biodata } from "@/lib/astro/biodata";
import { compute } from "@/lib/astro/engine";
import { t, type Lang } from "@/lib/astro/i18n";
import { triggerPrint } from "@/lib/print-helper";
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
  const sheetRef = useRef<HTMLDivElement>(null);
  const { ganeshSrc, setGaneshSrc, resetGaneshSrc } = useGanesh();

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
  const analysis = useMemo(() => (chart ? analyse(chart) : null), [chart]);

  async function downloadPdf() {
    const el = sheetRef.current;
    if (!el) return;
    setBusy(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
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
      const file = (bio.birth.name || "marriage-biodata").replace(/\s+/g, "-");
      pdf.save(`${file}.pdf`);
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
          <h2 className="font-display text-2xl sm:text-3xl">{t(lang, "bioTitle")}</h2>
          <p className="mt-1 max-w-xl text-sm text-muted">{t(lang, "bioLead")}</p>
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
          <Section title={lang === "ta" ? "விநாயகர் படம் / Emblem" : "Lord Ganesha Image / Emblem"}>
            <div className="flex items-center gap-3 rounded-lg border border-border/70 p-2.5 bg-elevated/40">
              <img
                src={ganeshSrc}
                alt="Lord Ganesha"
                className="size-12 shrink-0 object-contain rounded-md bg-white p-1 border border-border/60 shadow-xs"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-fg truncate">
                  {lang === "ta" ? "உங்கள் விநாயகர் படம்" : "Lord Ganesha Artwork"}
                </p>
                <div className="mt-1.5 flex gap-2">
                  <label className="inline-flex cursor-pointer items-center gap-1 rounded bg-accent px-2 py-1 text-[11px] font-semibold text-accent-fg hover:opacity-90">
                    <Upload className="size-3" />
                    {lang === "ta" ? "பதிவேற்றுக" : "Upload File"}
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => {
                          if (reader.result) setGaneshSrc(String(reader.result));
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={resetGaneshSrc}
                    className="inline-flex items-center rounded border border-border/70 bg-surface px-2 py-1 text-[11px] text-muted hover:text-fg"
                  >
                    {lang === "ta" ? "இயல்புநிலை" : "Reset Default"}
                  </button>
                </div>
              </div>
            </div>
          </Section>

          <Section title={t(lang, "photo")}>
            <label className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md bg-elevated text-sm font-medium">
              <Upload className="size-4" />
              {t(lang, "addPhoto")}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => onPhoto(e.target.files?.[0])}
              />
            </label>
          </Section>

          <Section title={t(lang, "personalSec")}>
            <Field label={t(lang, "name")}>
              <Input
                value={bio.birth.name}
                onChange={(e) => patch({ birth: { ...bio.birth, name: e.target.value } })}
              />
            </Field>
            <div>
              <Label>{t(lang, "sex")}</Label>
              <div className="grid grid-cols-2 gap-2">
                {(["M", "F"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => patch({ birth: { ...bio.birth, sex: s } })}
                    className={cn(
                      "h-11 rounded-md text-sm font-medium shadow-card",
                      bio.birth.sex === s ? "bg-accent text-accent-fg font-semibold" : "bg-surface text-fg border border-border/70",
                    )}
                  >
                    {s === "M" ? t(lang, "male") : t(lang, "female")}
                  </button>
                ))}
              </div>
            </div>
            <DateTimeFields
              lang={lang}
              value={bio.birth}
              onChange={(birth) => patch({ birth })}
            />
            <PlaceSearch lang={lang} value={bio.birth} onChange={(birth) => patch({ birth })} id="bio-place" />
            <div className="grid grid-cols-2 gap-2">
              <Field label={t(lang, "height")}>
                <FieldSelect value={bio.height} onChange={(v) => patch({ height: v })}>
                  {HEIGHTS.map((h) => (
                    <option key={h}>{h}</option>
                  ))}
                </FieldSelect>
              </Field>
              <Field label={t(lang, "complexion")}>
                <FieldSelect
                  value={bio.complexion}
                  onChange={(v) => patch({ complexion: v as Biodata["complexion"] })}
                >
                  <option value="fair">{t(lang, "fair")}</option>
                  <option value="wheatish">{t(lang, "wheatish")}</option>
                  <option value="dusky">{t(lang, "dusky")}</option>
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
              <Input value={bio.contactPerson} onChange={(e) => patch({ contactPerson: e.target.value })} />
            </Field>
            <Field label={t(lang, "phone")}>
              <Input value={bio.phone} onChange={(e) => patch({ phone: e.target.value })} />
            </Field>
            <Field label={t(lang, "email")}>
              <Input value={bio.email} onChange={(e) => patch({ email: e.target.value })} />
            </Field>
            <Field label={t(lang, "address")}>
              <Input value={bio.address} onChange={(e) => patch({ address: e.target.value })} />
            </Field>
            <Field label={t(lang, "expect")}>
              <Input value={bio.expect} onChange={(e) => patch({ expect: e.target.value })} />
            </Field>
          </Section>
        </form>

        <div className="min-w-0">
          <BiodataSheet sheetRef={sheetRef} lang={lang} bio={bio} chart={chart} analysis={analysis} />
        </div>
      </div>

      {/* Interactive Print / Save as PDF Dialog */}
      <PrintDialog
        open={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        title={lang === "ta" ? "திருமண சுயவிவர அச்சுப் பிரதி (A4)" : "Marriage Biodata (A4 Print)"}
        lang={lang}
        newTabUrl="/?page=biodata&print=auto"
      >
        <BiodataSheet sheetRef={null} lang={lang} bio={bio} chart={chart} analysis={analysis} />
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

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
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
    bio.complexion === "fair" ? t(lang, "fair") : bio.complexion === "dusky" ? t(lang, "dusky") : t(lang, "wheatish");
  const marital =
    bio.marital === "divorced" ? t(lang, "divorced") : bio.marital === "widowed" ? t(lang, "widowed") : t(lang, "unmarried");

  const personal: [string, string][] = [
    [t(lang, "name"), bio.birth.name || "—"],
    [t(lang, "date"), dob],
    [t(lang, "time"), tob],
    [t(lang, "place"), bio.birth.place || "—"],
    [t(lang, "rasi"), moon ? signName(lang, moon.sign) : "—"],
    [t(lang, "nakshatra"), moon ? `${nakName(lang, moon.nak)} · ${t(lang, "pada")} ${moon.pada}` : "—"],
    [t(lang, "lagna"), lagna ? signName(lang, lagna.sign) : "—"],
    [t(lang, "chevvai"), analysis ? (analysis.chevvai.present ? t(lang, "present") : t(lang, "absent")) : "—"],
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
    [t(lang, "contactPerson"), bio.contactPerson || "—"],
    [t(lang, "phone"), bio.phone || "—"],
    [t(lang, "email"), bio.email || "—"],
    [t(lang, "address"), bio.address || "—"],
  ];
  if (bio.expect) contact.push([t(lang, "expect"), bio.expect]);

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
            {t(lang, "bioTitle")}
          </h2>
        </div>

        <div className="mt-4 flex gap-4">
          <div className="min-w-0 flex-1">
            <SheetBlock title={t(lang, "personalSec")} rows={personal} />
          </div>
          <div className="w-28 shrink-0 sm:w-36">
            {bio.photo ? (
              <img
                src={bio.photo}
                alt=""
                className="biodata-photo w-full rounded-sm object-cover shadow-card"
              />
            ) : (
              <div className="biodata-photo flex w-full items-center justify-center rounded-sm bg-elevated text-center text-xs text-muted">
                {t(lang, "addPhoto")}
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

        <footer className="mt-4 border-t border-accent/30 pt-2 flex items-center justify-between text-xs text-muted print:mt-3">
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
              ? "தமிழ் ஜாதகம் & திருமண விவரம் · தொடர்பு: codepackr@gmail.com"
              : "Tamil Horoscope & Marriage Biodata · Contact: codepackr@gmail.com"}
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
