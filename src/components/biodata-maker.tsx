import { Download, Printer, Upload } from "lucide-react";
import { useMemo, useRef, useState, type ReactNode, type Ref } from "react";
import { NAK_EN, NAK_TA, SIGNS_EN, SIGNS_TA } from "@/lib/astro/constants";
import { analyse } from "@/lib/astro/analysis";
import { BLOODS, DEFAULT_BIODATA, HEIGHTS, type Biodata } from "@/lib/astro/biodata";
import { compute } from "@/lib/astro/engine";
import { t, type Lang } from "@/lib/astro/i18n";
import { DateTimeFields, FieldSelect, PlaceSearch } from "@/components/birth-fields";
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
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="size-4" />
            {t(lang, "print")}
          </Button>
          <Button onClick={downloadPdf} disabled={busy}>
            <Download className="size-4" />
            {t(lang, "downloadPdf")}
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_1fr]">
        <form className="no-print flex flex-col gap-4 rounded-xl bg-surface p-4 shadow-card sm:p-5">
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
                      bio.birth.sex === s ? "bg-ink text-accent-fg" : "bg-surface text-fg",
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
  sheetRef: Ref<HTMLDivElement>;
}) {
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
      ref={sheetRef}
      id="biodata-sheet"
      className="biodata-sheet relative mx-auto w-full max-w-[210mm] overflow-hidden bg-surface px-6 py-8 shadow-card sm:px-10 sm:py-10"
    >
      <div className="biodata-ornament pointer-events-none absolute inset-3 rounded-sm border-2 border-accent/50" />
      <div className="relative">
        <p className="font-display text-center text-sm tracking-widest text-accent">{t(lang, "invocation")}</p>
        <h2 className="font-display mt-2 text-center text-2xl text-accent sm:text-3xl">{t(lang, "bioTitle")}</h2>

        <div className="mt-6 flex gap-5">
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

        <SheetBlock title={t(lang, "workSec")} rows={work} />
        <SheetBlock title={t(lang, "familySec")} rows={family} />
        <SheetBlock title={t(lang, "contactSec")} rows={contact} />
      </div>
    </div>
  );
}

function SheetBlock({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <section className="mt-5">
      <h3 className="font-display border-b border-accent/40 pb-1 text-sm tracking-wide text-accent uppercase">
        {title}
      </h3>
      <table className="mt-2 w-full text-sm">
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k}>
              <td className="w-[38%] py-1 pr-2 align-top text-muted">{k}</td>
              <td className="py-1 font-medium">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
