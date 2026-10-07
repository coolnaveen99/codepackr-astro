import { useLang } from "@/lib/lang";

export function LegalTrustPage({ page }: { page: "about" | "privacy" | "terms" }) {
  const { lang } = useLang();
  const ta = lang === "ta";
  const isAbout = page === "about";
  const isTerms = page === "terms";

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">
        {isAbout ? (ta ? "Codepackr Astro பற்றி" : "About Codepackr Astro") : isTerms ? (ta ? "பயன்பாட்டு விதிமுறைகள்" : "Terms of Use — Codepackr Astro") : (ta ? "தனியுரிமைக் கொள்கை" : "Privacy Policy — Codepackr Astro")}
      </h1>
      <p className="text-sm text-slate-600">Last updated: 25 September 2026 · Chennai, India</p>
      <p className="text-sm leading-relaxed">
        Operated by Naveen. Birth data is processed in the browser for the astrology tools.
        AdSense (ca-pub-7526363571565796) may show ads.
      </p>

      {isAbout ? (
        <div className="space-y-4 text-sm leading-relaxed">
          <p>Codepackr Astro is an independent educational and informational astrology utility.</p>
          <p>Astrology calculations are designed for general reference and should not be treated as guaranteed predictions or professional advice.</p>
          <p>The project is operated from Chennai, India. Questions and corrections can be sent to codepackr@gmail.com.</p>
        </div>
      ) : isTerms ? (
        <div className="space-y-4 text-sm leading-relaxed">
          <p>Codepackr Astro is an educational and informational astrology utility. Outputs are provided as general reference and are not guarantees of future events or a substitute for professional advice.</p>
          <p>Use the service lawfully and do not attempt to disrupt, abuse, or interfere with the site or its supporting services. Verify important information independently before relying on it.</p>
          <p>The site may use hosting, Firebase/Google services, advertising, and other third-party infrastructure. Those services may have their own terms and privacy policies.</p>
          <p>Features, calculations, content, and availability may change as the project is maintained.</p>
        </div>
      ) : (
        <div className="space-y-4 text-sm leading-relaxed">
          <h2 className="text-lg font-bold">1. Local astrology-tool processing</h2>
          <p>For astrology tools designed for browser-side processing, entered birth data is processed locally rather than being intentionally sent to a Codepackr application server as part of the calculation. Do not enter information you are not comfortable processing in a browser.</p>

          <h2 className="text-lg font-bold">2. Advertising and Google AdSense</h2>
          <p>Codepackr Astro may display advertising through Google AdSense. Google and its advertising partners may use cookies or similar technologies to serve, measure, and personalize advertising based on applicable settings and law.</p>
          <p>You can review or change personalized advertising choices through <a className="underline font-semibold" href="https://adssettings.google.com/" target="_blank" rel="noreferrer">Google Ads Settings</a> and review third-party advertising choices through <a className="underline font-semibold" href="https://www.aboutads.info/choices/" target="_blank" rel="noreferrer">AboutAds.info</a>.</p>

          <h2 className="text-lg font-bold">3. Third-party services</h2>
          <p>The site may use hosting, Firebase/Google services, advertising, analytics, and other third-party infrastructure. Those providers may process technical information according to the services they provide and their applicable policies.</p>

          <h2 className="text-lg font-bold">4. Contact</h2>
          <p>Contact messages are voluntarily submitted. Please do not include passwords, financial credentials, government identifiers, or other sensitive information in a support request.</p>
        </div>
      )}

      <p className="text-sm">
        <a className="underline font-semibold" href="mailto:codepackr@gmail.com">codepackr@gmail.com</a> · <a className="underline font-semibold" href="/contact">/contact</a>
      </p>
    </article>
  );
}
