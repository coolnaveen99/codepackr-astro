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
  const maxW = pageW;
  const maxH = pageH;

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
          ".print-page, .biodata-sheet, .jathagam-sheet, .astro-export-one-page, .porutham-print-sheet"
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
          cp.style.height = "297mm";
          cp.style.minHeight = "297mm";
          cp.style.maxHeight = "297mm";
          cp.style.padding = "7mm 9mm";
          cp.style.margin = "0 auto";
          cp.style.border = "none";
          cp.style.boxShadow = "none";
          cp.style.boxSizing = "border-box";
          cp.style.background = "#fffdfa";
          cp.style.overflow = "hidden";
          cp.style.visibility = "visible";
          cp.style.textAlign = "left";
        });

        // Ensure export root is positioned cleanly in cloned DOM
        const exportRoot = doc.getElementById("jathagam-export-root");
        if (exportRoot) {
          exportRoot.style.position = "static";
          exportRoot.style.left = "auto";
          exportRoot.style.top = "auto";
          exportRoot.style.width = "210mm";
          exportRoot.style.maxWidth = "210mm";
          exportRoot.style.visibility = "visible";
        }

        // Ensure inner flex wrapper fills the full 297mm parent height
        const innerWrappers = doc.querySelectorAll<HTMLElement>(
          ".print-page > .relative.z-1, .biodata-sheet > .relative.z-1, .jathagam-sheet > .relative.z-1, .astro-traditional-preview > .relative.z-1, .porutham-print-sheet > .relative.z-1"
        );
        innerWrappers.forEach((iw) => {
          iw.style.display = "flex";
          iw.style.flexDirection = "column";
          iw.style.justifyContent = "space-between";
          iw.style.flex = "1 1 auto";
          iw.style.height = "100%";
          iw.style.minHeight = "100%";
        });

        // Ensure all page footers are anchored to the bottom
        const footers = doc.querySelectorAll<HTMLElement>(
          ".print-page footer, .biodata-sheet footer, .jathagam-sheet footer, .astro-traditional-preview footer, .porutham-print-sheet footer"
        );
        footers.forEach((ft) => {
          ft.style.marginTop = "auto";
          ft.style.flexShrink = "0";
          ft.style.width = "100%";
        });

        // Ensure watermark is visible and styled identically
        const watermarks = doc.querySelectorAll<HTMLElement>(".watermark");
        watermarks.forEach((wm) => {
          wm.style.display = "flex";
          wm.style.opacity = "0.08";
          wm.style.color = "#0f172a";
          wm.style.visibility = "visible";
        });

        // Ensure internal grids (charts, birth details, panchangam) maintain grid layout
        const grids = doc.querySelectorAll<HTMLElement>(
          ".print-page .grid, .biodata-sheet .grid, .jathagam-sheet .grid, .astro-traditional-preview .grid"
        );
        grids.forEach((g) => {
          g.style.display = "grid";
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
