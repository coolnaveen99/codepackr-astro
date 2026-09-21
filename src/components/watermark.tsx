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
        "watermark pointer-events-none select-none absolute inset-0 z-0 overflow-hidden flex flex-col justify-around py-4 opacity-[0.06] print:opacity-[0.08]",
        className
      )}
    >
      {[-30, -30, -30, -30, -30, -30].map((deg, i) => (
        <div
          key={i}
          className="flex justify-around items-center whitespace-nowrap font-mono font-bold tracking-[0.25em] text-ink select-none"
          style={{ transform: `rotate(${deg}deg)` }}
        >
          <span className="text-xl sm:text-2xl uppercase">{text}</span>
          <span className="text-xl sm:text-2xl uppercase">{text}</span>
        </div>
      ))}
    </div>
  );
}
