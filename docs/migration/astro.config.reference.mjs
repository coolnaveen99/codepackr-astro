import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://astro.codepackr.com",
  output: "static",
  i18n: {
    defaultLocale: "ta",
    locales: ["ta", "en", "hi", "te", "ml", "kn"],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
    fallback: {
      hi: "en",
      te: "ta",
      ml: "ta",
      kn: "ta",
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "ta",
        locales: {
          ta: "ta-IN",
          en: "en-IN",
          hi: "hi-IN",
          te: "te-IN",
          ml: "ml-IN",
          kn: "kn-IN",
        },
      },
    }),
  ],
});
