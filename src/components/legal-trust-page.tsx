import { useLang } from "@/lib/lang";

export function LegalTrustPage({ page }: { page: "about" | "privacy" | "terms" }) {
  const { lang } = useLang();
  const ta = lang === "ta";
  const isAbout = page === "about";
  const isTerms = page === "terms";
  return (
    <article className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">{isAbout ? (ta ? "Codepackr Astro பற்றி" : "About Codepackr Astro") : isTerms ? (ta ? "பயன்பாட்டு விதிமுறைகள்" : "Terms of Use — Codepackr Astro") : (ta ? "தனியுரிமைக் கொள்கை" : "Privacy Policy — Codepackr Astro")}</h1>
      <p className="text-sm text-slate-600">Last updated: 25 September 2026 · Chennai, India</p>
      <p className="text-sm leading-relaxed">Operated by Naveen. Birth data is processed in the browser for the astrology tools. AdSense ca-pub-7526363571565796 may show ads.</p>\n      {isTerms && <div className="space-y-4 text-sm leading-relaxed"><p>Codepackr Astro is an educational and informational astrology utility. Outputs are provided as general reference and are not guarantees of future events or a substitute for professional advice.</p><p>Use the service lawfully and do not attempt to disrupt, abuse, or interfere with the site or its supporting services. Verify important information independently before relying on it.</p><p>The site may use hosting, Firebase/Google services, advertising, and other third-party infrastructure. Those services may have their own terms and privacy policies.</p><p>Features, calculations, content, and availability may change as the project is maintained. Questions about these terms can be sent to codepackr@gmail.com.</p></div>}
      <p className="text-sm"><a className="underline font-semibold" href="mailto:codepackr@gmail.com">codepackr@gmail.com</a> · <a className="underline font-semibold" href="/contact">/contact</a></p>
    </article>
  );
}
