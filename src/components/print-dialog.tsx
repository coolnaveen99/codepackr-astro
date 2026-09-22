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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-xs no-print">
      <div className="relative flex max-h-[96vh] w-full max-w-4xl flex-col rounded-xl bg-surface border-2 border-border shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border bg-elevated/60 px-4 py-3 sm:px-6">
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
        <div className="border-b border-border/60 bg-elevated/40 px-4 py-2 text-[11px] text-muted flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="inline-block size-1.5 rounded-full bg-accent" />
            <span className="font-medium text-ink">
              {lang === "ta" ? "6 பக்கங்கள் கொண்ட முழு ஜாதகம் · ஒவ்வொரு பக்கத்திலும் கணபதி அருள் உருவம்" : "Complete 6-Page Booklet · Lord Ganesha Blessing on every page"}
            </span>
          </div>
          <span>
            {lang === "ta"
              ? "💡 குறிப்பு: பிரவுசர் ஐபிரேமில் அச்சிடுதல் தடைபட்டால், மேலே உள்ள 'புதிய விண்டோவில் திறக்க' என்பதை அழுத்தவும்."
              : "💡 Tip: If printing is sandboxed in iframe, click 'Open in New Tab' above."}
          </span>
        </div>

        {/* Modal Body - Scrollable A4 Preview */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-elevated/20">
          <div className="mx-auto max-w-[210mm]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
