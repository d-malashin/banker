# Banker

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
