// Codepackr Astro - Biodata PDF export (always single A4 page)
export async function exportBiodataPdf(
  el: HTMLElement,
  fileBase: string,
): Promise<void> {
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
  // Always fit the biodata sheet onto a single A4 page by scaling down if needed
  let drawW = pageW;
  let drawH = (canvas.height * pageW) / canvas.width;
  if (drawH > pageH) {
    const scale = pageH / drawH;
    drawW = pageW * scale;
    drawH = pageH;
  }
  const offsetX = (pageW - drawW) / 2;
  const offsetY = (pageH - drawH) / 2;
  pdf.addImage(img, "JPEG", offsetX, offsetY, drawW, drawH);
  pdf.save(`${fileBase}.pdf`);
}
