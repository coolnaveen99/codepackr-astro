// Codepackr Astro - Universal High-Resolution PDF Exporter
// Produces 1-to-1 fidelity with browser A4 print layout and preserves watermarks.
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";

export interface ExportPdfOptions {
  filename?: string;
  title?: string;
}

/**
 * Exports one or more printable pages to a high-resolution A4 PDF document.
 * Ensures identical layout, margins, typography, and watermark visibility as physical print.
 */
export async function exportElementToPdf(
  target: HTMLElement | HTMLElement[],
  options: ExportPdfOptions = {}
): Promise<void> {
  await document.fonts?.ready;

  // Resolve list of individual pages
  let pages: HTMLElement[] = [];
  if (Array.isArray(target)) {
    pages = target.filter((p): p is HTMLElement => Boolean(p));
  } else if (target) {
    // If container holds multiple .print-page elements (e.g. 6-page or 30-page booklet)
    const printPages = Array.from(target.querySelectorAll<HTMLElement>(".print-page"));
    if (printPages.length > 0) {
      pages = printPages;
    } else {
      const singlePages = Array.from(
        target.querySelectorAll<HTMLElement>(".biodata-sheet, .astro-export-one-page")
      );
      if (singlePages.length > 0) {
        pages = singlePages;
      } else {
        pages = [target];
      }
    }
  }

  if (pages.length === 0) {
    throw new Error("No printable pages found to export.");
  }

  // Pre-wait for any images inside pages to be fully loaded
  const allImages = pages.flatMap((p) => Array.from(p.querySelectorAll<HTMLImageElement>("img")));
  await Promise.all(
    allImages.map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          })
    )
  );
  await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

  const pdf = new jsPDF({
    unit: "mm",
    format: "a4",
    orientation: "portrait",
    compress: true,
  });

  const pageW = 210;
  const pageH = 297;
  const marginX = 4; // 4mm safe side margin matching print
  const marginY = 4; // 4mm safe top/bottom margin
  const maxW = pageW - marginX * 2;
  const maxH = pageH - marginY * 2;

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const targetWidth = page.scrollWidth || 794;

    const canvas = await html2canvas(page, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#fffdfa",
      logging: false,
      windowWidth: targetWidth,
      onclone: (doc) => {
        // Enforce exact A4 print properties on all pages
        const clonedPages = doc.querySelectorAll<HTMLElement>(
          ".print-page, .biodata-sheet, .astro-export-one-page"
        );
        clonedPages.forEach((cp) => {
          cp.style.position = "relative";
          cp.style.left = "0";
          cp.style.top = "0";
          cp.style.display = "flex";
          cp.style.flexDirection = "column";
          cp.style.justifyContent = "space-between";
          cp.style.width = "210mm";
          cp.style.maxWidth = "210mm";
          cp.style.minHeight = "286mm";
          cp.style.padding = "6mm 8mm";
          cp.style.margin = "0 auto";
          cp.style.border = "none";
          cp.style.boxShadow = "none";
          cp.style.boxSizing = "border-box";
          cp.style.background = "#fffdfa";
          cp.style.overflow = "hidden";
          cp.style.visibility = "visible";
        });

        // Ensure watermark is visible and styled identically
        const watermarks = doc.querySelectorAll<HTMLElement>(".watermark");
        watermarks.forEach((wm) => {
          wm.style.display = "flex";
          wm.style.opacity = "0.08";
          wm.style.color = "#0f172a";
          wm.style.visibility = "visible";
        });

        // Align chart columns and preview bodies if present
        const chartCols = doc.querySelectorAll<HTMLElement>(".astro-charts-col");
        chartCols.forEach((cc) => {
          cc.style.display = "flex";
          cc.style.flexDirection = "column";
          cc.style.gap = "12px";
          cc.style.width = "290px";
        });

        const previewBodies = doc.querySelectorAll<HTMLElement>(".astro-preview-body");
        previewBodies.forEach((pb) => {
          pb.style.display = "grid";
          pb.style.gridTemplateColumns = "minmax(0, 1fr) 290px";
          pb.style.gap = "14px";
        });
      },
    });

    if (i > 0) pdf.addPage();

    const aspect = canvas.height / canvas.width;
    let targetW = maxW;
    let targetH = targetW * aspect;

    if (targetH > maxH) {
      const scale = maxH / targetH;
      targetW = targetW * scale;
      targetH = targetH * scale;
    }

    const x = (pageW - targetW) / 2;
    const y = (pageH - targetH) / 2;

    pdf.addImage(
      canvas.toDataURL("image/jpeg", 0.95),
      "JPEG",
      x,
      y,
      targetW,
      targetH,
      undefined,
      "FAST"
    );
  }

  const safeFilename = (options.filename || "codepackr-astro-report")
    .trim()
    .replace(/[^a-zA-Z0-9-_.]+/g, "-")
    .replace(/^-+|-+$/g, "");

  pdf.save(safeFilename.endsWith(".pdf") ? safeFilename : `${safeFilename}.pdf`);
}
