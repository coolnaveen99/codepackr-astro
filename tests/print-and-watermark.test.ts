// Codepackr Astro — Print & PDF Export Parity and Watermark Validation Tests
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("Print & PDF Watermark Validation", () => {
  const watermarkFile = readFileSync(
    resolve(process.cwd(), "src/components/watermark.tsx"),
    "utf-8"
  );
  const stylesFile = readFileSync(
    resolve(process.cwd(), "src/styles.css"),
    "utf-8"
  );
  const pdfExportFile = readFileSync(
    resolve(process.cwd(), "src/lib/pdf-export.ts"),
    "utf-8"
  );
  const jathagamDashboardFile = readFileSync(
    resolve(process.cwd(), "src/components/jathagam-dashboard.tsx"),
    "utf-8"
  );
  const printHoroscopeSheetFile = readFileSync(
    resolve(process.cwd(), "src/components/print-horoscope-sheet.tsx"),
    "utf-8"
  );
  const fullReportFile = readFileSync(
    resolve(process.cwd(), "src/components/full-report.tsx"),
    "utf-8"
  );
  const biodataSheetFile = readFileSync(
    resolve(process.cwd(), "src/components/biodata-sheet.tsx"),
    "utf-8"
  );
  const biodataMakerFile = readFileSync(
    resolve(process.cwd(), "src/components/biodata-maker.tsx"),
    "utf-8"
  );
  const poruthamViewFile = readFileSync(
    resolve(process.cwd(), "src/components/porutham-view.tsx"),
    "utf-8"
  );
  const printDialogFile = readFileSync(
    resolve(process.cwd(), "src/components/print-dialog.tsx"),
    "utf-8"
  );

  it("watermark component enforces exact print color adjustment and visible opacity", () => {
    expect(watermarkFile).toContain("WebkitPrintColorAdjust");
    expect(watermarkFile).toContain("printColorAdjust");
    expect(watermarkFile).toContain("opacity: 0.08");
    expect(watermarkFile).toContain("CODEPACKR.COM ASTRO");
    expect(watermarkFile).toContain("rotate(");
    // Verifies wide row bleed to prevent empty corners
    expect(watermarkFile).toContain("w-[140%]");
  });

  it("CSS styles enforce exact watermark opacity in both screen and print media queries", () => {
    expect(stylesFile).toContain(".watermark {");
    expect(stylesFile).toContain("print-color-adjust: exact");
    expect(stylesFile).toContain("-webkit-print-color-adjust: exact");
    expect(stylesFile).toMatch(/opacity:\s*0\.08/);
  });

  it("ensures watermark is integrated into 1-Page Jathagam report", () => {
    expect(jathagamDashboardFile).toContain("<Watermark />");
    expect(jathagamDashboardFile).toContain("TraditionalPreview");
    expect(jathagamDashboardFile).toContain("astro-traditional-preview");
    expect(jathagamDashboardFile).toContain("exportElementToPdf");
  });

  it("ensures watermark is integrated into all 6 pages of PrintHoroscopeSheet", () => {
    const matches = printHoroscopeSheetFile.match(/<Watermark \/>/g);
    expect(matches).not.toBeNull();
    // Must have at least 6 watermarks (1 for each page)
    expect(matches?.length).toBeGreaterThanOrEqual(6);
  });

  it("ensures watermark is integrated into full 30-page book report", () => {
    const matches = fullReportFile.match(/<Watermark \/>/g);
    expect(matches).not.toBeNull();
    // Must be included across cover, core, varga, bhava, dasa, and provenance pages
    expect(matches?.length).toBeGreaterThanOrEqual(10);
  });

  it("ensures watermark is present in Marriage Biodata Sheet", () => {
    expect(biodataSheetFile).toContain("<Watermark />");
    expect(biodataSheetFile).toContain("biodata-sheet");
  });

  it("ensures watermark is present in Marriage Porutham View and Print Dialog", () => {
    expect(poruthamViewFile).toContain("<Watermark />");
    expect(printDialogFile).toContain("exportElementToPdf");
  });

  it("validates print and PDF export format parity in shared CSS and export engine", () => {
    // Both print and PDF export must enforce 210mm width and 297mm A4 standards
    expect(stylesFile).toContain("210mm");
    expect(stylesFile).toContain("297mm");
    expect(stylesFile).toContain("padding: 7mm 9mm");
    expect(stylesFile).toContain("margin-top: auto");
    expect(pdfExportFile).toContain('cp.style.width = "210mm";');
    expect(pdfExportFile).toContain('cp.style.height = "297mm";');
    expect(pdfExportFile).toContain('cp.style.padding = "7mm 9mm";');
    expect(pdfExportFile).toContain('ft.style.marginTop = "auto";');
    expect(pdfExportFile).toContain('backgroundColor: "#fffdfa"');
  });

  it("validates that biodata export uses universal exportElementToPdf for exact print parity", () => {
    expect(biodataMakerFile).toContain("exportElementToPdf");
  });

  it("validates that print dialog provides direct PDF download capability", () => {
    expect(printDialogFile).toContain("handleExportPdf");
    expect(printDialogFile).toContain("FileDown");
  });
});
