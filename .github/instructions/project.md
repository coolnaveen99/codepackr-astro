# CodePackr Astro — Repository Instructions

- Preserve the Tamil Nadu astrology focus and existing architecture.
- Keep calculations deterministic, testable, and explainable.
- Reuse canonical constants/tables; do not create duplicate hard-coded data.
- Preserve Thirukanitham, Vakya, and Lahiri calculation modes and existing routes.
- Do not claim a calculation is classical/full unless implementation and tests support that claim.
- Keep user birth details and generated reports client-side.
- Use standard Tamil Nadu astrology terminology for Tamil UI/content.
- Add regression coverage for calculation changes.
- Source changes require lint and production build.
- Documentation-only, README-only, and .github-only changes do not require a production build; CI and Vercel are configured to ignore those changes.
