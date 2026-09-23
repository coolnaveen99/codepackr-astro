// Codepackr Astro - Printable Sheet Dialog
import { useEffect } from "react";
import { Printer, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Lang } from "@/lib/astro/i18n";

interface PrintDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  lang: Lang;
  children: React.ReactNode;
  newTabUrl?: string;
}

export function PrintDialog({
  open,
  onClose,
  title,
  lang,
  children,
  newTabUrl,
}: PrintDialogProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handlePrint = () => {
    try {
      window.print();
    } catch {
      // ignore
    }
  };

  return (
    <div className="print-dialog-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-xs print:static print:inset-auto print:p-0 print:bg-white print:block print:w-full">
      <div className="relative flex max-h-[96vh] w-full max-w-4xl flex-col rounded-xl bg-surface border-2 border-border shadow-2xl overflow-hidden print:border-0 print:shadow-none print:max-h-none print:max-w-none print:w-full print:bg-white print:overflow-visible">
        {/* Modal Header */}
        <div className="no-print flex items-center justify-between border-b border-border bg-elevated/60 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="rounded-md bg-accent/10 p-2 text-accent">
              <Printer className="size-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-fg sm:text-lg">
                {title}
              </h3>
              <p className="text-xs text-muted">
                {lang === "ta"
                  ? "A4 பக்க முன்னோட்டம் & அச்சிடும் வசதி"
                  : "A4 Page Preview & Print / PDF Export"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {newTabUrl ? (
              <a
                href={newTabUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-accent-fg shadow-xs hover:opacity-90 transition-opacity"
              >
                <ExternalLink className="size-3.5" />
                {lang === "ta" ? "புதிய விண்டோவில் அச்சிட திறக்க" : "Open in New Tab to Print / PDF"}
              </a>
            ) : null}

            <Button
              variant="primary"
              size="sm"
              onClick={handlePrint}
              className="bg-accent text-accent-fg hover:opacity-90 text-xs font-semibold"
            >
              <Printer className="size-3.5 mr-1" />
              {lang === "ta" ? "அச்சிடுக" : "Print Now"}
            </Button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1.5 text-muted hover:bg-border/60 hover:text-fg transition-colors"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Notice for preview iframe users */}
        <div className="no-print border-b border-border/60 bg-elevated/40 px-4 py-2 text-[11px] text-muted flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="inline-block size-1.5 rounded-full bg-accent" />
            <span className="font-medium text-ink">
              {lang === "ta" ? "முழு ஜாதகம் / விவரப் படிவம் · உயர்தர அச்சுத் தயாரிப்பு" : "Full Horoscope / Profile Sheet · High Quality Print Ready"}
            </span>
          </div>
          <span>
            {lang === "ta"
              ? "💡 குறிப்பு: பிரவுசர் ஐபிரேமில் அச்சிடுதல் தடைபட்டால், PDF ஏற்றுமதி பொத்தானைப் பயன்படுத்தவும்."
              : "💡 Tip: If printing is blocked by iframe, use the PDF export button."}
          </span>
        </div>

        {/* Modal Body - Scrollable A4 Preview */}
        <div className="print-dialog-body flex-1 overflow-y-auto p-3 sm:p-6 bg-elevated/20 print:p-0 print:bg-white print:overflow-visible">
          <div className="mx-auto max-w-[210mm] print:max-w-none print:w-full print:m-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
