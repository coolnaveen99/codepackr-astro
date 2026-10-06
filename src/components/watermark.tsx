// Codepackr Astro - Printable Watermark Component
import { cn } from "@/lib/utils";

export function Watermark({
  text = "CODEPACKR.COM ASTRO",
  className,
}: {
  text?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "watermark pointer-events-none select-none absolute inset-0 z-0 overflow-hidden flex flex-col justify-around py-4",
        className
      )}
      style={{
        opacity: 0.08,
        color: "#0f172a",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}
    >
      {[-28, -28, -28, -28, -28, -28].map((deg, i) => (
        <div
          key={i}
          className="watermark-row flex w-[140%] -ml-[20%] justify-around items-center whitespace-nowrap font-mono font-bold tracking-[0.25em] select-none"
          style={{
            transform: `rotate(${deg}deg)`,
            transformOrigin: "center",
          }}
        >
          <span className="watermark-text text-base sm:text-lg uppercase">{text}</span>
          <span className="watermark-text text-base sm:text-lg uppercase">{text}</span>
          <span className="watermark-text text-base sm:text-lg uppercase">{text}</span>
        </div>
      ))}
    </div>
  );
}
