// Codepackr Astro - Safe Window Print Invoker
/**
 * Safe print helper that works both in standalone browsers and inside sandboxed iframes.
 */
export function triggerPrint(): void {
  try {
    window.print();
  } catch (err) {
    console.warn("window.print() encountered an error, trying fallback window", err);
    try {
      const printWin = window.open(window.location.href, "_blank");
      if (printWin) {
        printWin.focus();
        printWin.onload = () => {
          try {
            printWin.print();
          } catch {
            // ignore
          }
        };
      }
    } catch {
      // Fallback
    }
  }
}
