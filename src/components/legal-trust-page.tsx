import { useLang } from "@/lib/lang";

export function LegalTrustPage({ page }: { page: "about" | "privacy" }) {
  const { lang } = useLang();
  const ta = lang === "ta";
  const isAbout = page === "about";
  return (
    <article className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">{isAbout ? (ta ? "Codepackr Astro பற்றி" : "About Codepackr Astro") : (ta ? "தனியுரிமைக் கொள்கை" : "Privacy Policy — Codepackr Astro")}</h1>
      <p className="text-sm text-slate-600">Last updated: 25 September 2026 · Chennai, India</p>
      <p className="text-sm leading-relaxed">Operated by Naveen. Birth data stays in the browser. AdSense ca-pub-7526363571565796 may show ads.</p>
      <p className="text-sm"><a className="underline font-semibold" href="mailto:codepackr@gmail.com">codepackr@gmail.com</a> · <a className="underline font-semibold" href="/contact">/contact</a></p>
    </article>
  );
}
