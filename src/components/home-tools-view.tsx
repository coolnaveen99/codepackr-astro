// Restored via manual download - temporary minimal shell
import type { Lang } from "@/lib/astro/i18n";
import { AstroHero } from "@/components/AstroHero";

export function HomeToolsView({ lang }: { lang: Lang }) {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8 space-y-8">
      <AstroHero lang={lang} />
      <section id="all-tools-section" className="py-8 text-center text-slate-600 text-sm">
        Loading tools directory…
      </section>
    </div>
  );
}
