import { cn } from "@/lib/utils";

export function Watermark({
  text = "astro.codepackr.com",
  className,
}: {
  text?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "watermark pointer-events-none select-none absolute inset-0 z-0 overflow-hidden flex flex-col justify-around py-6 opacity-[0.055] print:opacity-[0.075]",
        className
      )}
    >
      {[-30, -30, -30, -30].map((deg, i) => (
        <div
          key={i}
          className="flex justify-around items-center whitespace-nowrap font-mono font-bold tracking-[0.25em] text-ink select-none"
          style={{ transform: `rotate(${deg}deg)` }}
        >
          <span className="text-xl sm:text-2xl lg:text-3xl uppercase">{text}</span>
          <span className="text-xl sm:text-2xl lg:text-3xl uppercase">{text}</span>
        </div>
      ))}
    </div>
  );
}
