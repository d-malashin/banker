# Banker

## Manual bank-entry notice

- [x] Make bank-recognition notices conditional on screenshot-origin review and preserve the origin when returning from replacement confirmation.
- [x] Verify manual bank selection and screenshot warnings independently.
- [ ] Push and deploy the correction.

## Real screenshot OCR, locale bank catalogs, and monthly history

- [x] Reproduce OCR failures on the three provided originals and improve the actual recognition pipeline with spatial parsing and bank suggestions.
- [x] Show Russian bank suggestions for Russian locales and international banks for other locales; preserve custom bank names.
- [x] Add versioned monthly data, six-month retention, safe legacy migration, and month-aware import/sharing/replacement.
- [x] Add a global month selector and upload month field defaulting to next month from the 25th.
- [x] Verify supplied screenshots, month navigation/replacement, locale catalogs, transfer/sharing, and offline use.
- [x] Push, deploy, and verify the published update.
- [x] Persist completed onboarding and show only the app cabinet after the first confirmed category, including after deleting all categories.
- [x] Replace strong blue controls with readable neutral glass and add persisted System/Light/Dark appearance settings.

Agreed monthly behavior: one complete list per bank per YYYY-MM month; replace only the selected bank/month; retain the six newest populated month buckets. Prefer the current month if it has data, otherwise the most recently uploaded month. Saving switches to the uploaded month. Upload date before day25 defaults current month; day25 onward defaults next month, including year rollover. Bank suggestions remain editable, and uncertain layout-based matches are explicitly marked for confirmation. Original screenshots stay outside the repository and deployment.

Verification: 35 automated tests pass. `node scripts/ocr-regression.mjs` and isolated Chromium both recognized all 12 selected categories/rates exactly from the three original screenshots, excluding Alfa promotions/unchecked offers. T-Bank's header crop recognizes its name; Alfa is explicitly a layout suggestion; unbranded Sber requires bank selection. Browser checks cover Russian/international suggestions, custom bank names, day24/day25 defaults, November/December navigation, replacement/deletion limited to one bank/month, v2 export/import, selected-month sharing, legacy migration, and offline OCR.

Appearance/onboarding verification: a first confirmed category removes hero, marketing, summaries and footer. Deleting the last category and reloading preserves app mode. System theme follows emulated device changes; explicit Light/Dark persists across reload despite the device setting. Light/dark mobile cabinets were visually inspected; no horizontal overflow. Original bank images were removed from the bundle and replaced with monograms only inside saved lists/picker. No native widget was added per the research decision in `tasks/widget-research.md`.

Deployed code commit `6fcfe50` through successful GitHub Actions run `41377249932`. Live verification returned HTTP 200, default device-dark appearance, exact 12 categories/rates from all three originals, November/December isolation, no marketing after first confirmation, persisted explicit Light preference after reload, and offline T-Bank OCR. No JavaScript page errors or non-GET network requests were observed. Source screenshots remain outside Git and the deployment bundle.

## Neutral glass redesign, bank logos, and settings

- [x] Source and bundle actual logos for ten leading Russian banks, with attribution.
- [x] Replace the green palette with neutral gray Liquid Glass surfaces and restrained Reminders-like accents.
- [x] Add bilingual settings with an optional name saved only on the current device.
- [x] Verify mobile/desktop layout, settings persistence/privacy, bank logos and offline assets.
- [x] Push and deploy the update to GitHub Pages; check the live site.

Design direction: light gray canvas, translucent white rounded surfaces, black/gray text, bright small category accents, and glass navigation/actions. Keep the existing local-only OCR and data transfer behavior.

### Redesign verification

15 domain tests pass, including newly supported bank aliases and safe migration of previously custom names. Actual marks for the ten largest banks by assets in the Interfax Q3 2026 ranking are bundled with provenance in `public/banks/sources.json`. Added canonical recognition for Россельхозбанк, ДОМ.РФ, and МКБ; all previous banks remain supported.

Isolated Chromium checks verified neutral colors, populated mobile and desktop screens, all ten loaded logos, no horizontal overflow at 320/390/1440px, Russian and English settings, name persistence/clearing, escaped name rendering, and exclusion of the name from actual exported JSON and decoded share payloads. Fresh-context offline checks confirmed all ten logos and Russian screenshot OCR. Profile fields use 16px text on mobile to avoid Safari focus zoom. Real iOS material rendering and home-screen installation remain device checks.

Deployed commit `0f4fea1` in successful GitHub Actions run `41288447988`. Live verification at https://d-malashin.github.io/banker/ returned HTTP 200, neutral `rgb(243,243,246)` background, the settings gear, persisted Russian greeting, all ten bank logos, no mobile horizontal overflow, and offline reload with greeting/logos retained. No JavaScript page errors were observed.

- [x] Build mobile-first bilingual glass UI and screenshot review flow.
- [x] Implement local OCR, stable bank replacement, validated JSON import/export and URL-fragment sharing.
- [x] Add offline PWA assets, iOS installation guidance, and GitHub Pages deployment workflow.
- [x] Run domain tests, production build and isolated Playwright mobile/browser checks.
- [x] Publish with the owner's GitHub account and verify the live site.

## Decisions

Static Vite application; screenshots processed by local Tesseract workers. Review before saving because OCR can be inaccurate. One saved list per normalized bank ID. Share payloads in URL fragments, separate from personal lists. No backend, analytics, account, or image uploads. Dependencies and OCR languages served with the application for offline use after download.

## Review

11 domain tests pass. Production assets built and tested under `/banker/`, the expected project Pages base path. The local sandbox prevents Vite from deleting its existing output directory, so repeat local builds used `vite build --emptyOutDir false`; clean CI builds use the standard build command.

Isolated Playwright Chromium checks verified English and Russian locales at 375/390px, no horizontal overflow, screenshot OCR, editable review, persistence after reload, complete same-bank replacement, bank-preserving import, JSON download, sorting/search, separate shared collections, and independent deletion from own/shared lists. A generated Russian screenshot recognized Т-Банк, Рестораны 5%, Супермаркеты 3%, and Аптеки 7% correctly. Fresh-context offline tests verified both reload and OCR after precaching, including at the GitHub Pages base path. The install guide reports offline readiness. Runtime requests are same-origin static assets; no screenshot upload API exists.

Physical iPhone home-screen installation still requires device verification. Bank layouts without readable names require manual bank selection; OCR review is deliberate.

Published to https://d-malashin.github.io/banker/ from https://github.com/d-malashin/banker. GitHub Actions run 41246073207 completed successfully, including clean installation, 11 tests, production build, and Pages deployment. Live isolated Chromium verification confirmed HTTP 200, Russian locale, mobile layout without horizontal overflow, standalone manifest, offline reload, and offline OCR of the generated Russian fixture with all three categories and rates correct. No JavaScript page errors were observed. Future pushes to main publish through the deployment workflow.
