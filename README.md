# Banker

[Open Banker](https://d-malashin.github.io/banker/) · [Source repository](https://github.com/d-malashin/banker)

A mobile-first, local-only cashback cabinet with a frosted-glass interface. Upload a cashback screenshot, recognize its categories locally, confirm the bank and month, and save it. Russian browser locales get Russian interface text; other locales get English.

## Run locally

Requires Node.js 22 and `curl` (both provided by GitHub's Ubuntu runners).

```sh
npm ci
npm run prepare:assets
npm run dev
```

`prepare:assets` copies the local Tesseract worker and WebAssembly engines and downloads the English/Russian models from the official `tesseract-ocr/tessdata_fast` repository at a pinned revision. Only this build-time step needs a connection to the model provider. It also generates PNG app icons. OCR assets are generated, ignored in Git, and included in the published site.

```sh
npm test
npm run build
npm run preview
```

The production build generates a versioned service worker with every application and OCR asset included in its offline cache. The service worker is meant for the production build, not Vite's development server. The initial offline download is about 36 MB; keep the first visit online until offline preparation finishes. The application and OCR work offline after a successful cache installation. Hosting requires HTTPS; localhost also works for development.

## Data and privacy

- No server, user account, database, analytics, or external OCR service.
- Screenshots stay in browser memory and are processed locally with Tesseract.js. App files and OCR engines/models are loaded from the same static host.
- Saved categories remain in browser storage. Clearing site data, private browsing sessions ending, or browser storage eviction can erase them. Export JSON backups when the list matters.
- Each bank has one complete category list per month. Saving a screenshot replaces only the selected bank and month. Other banks and months stay intact. The six newest populated months are retained; export a backup for longer history.
- OCR can miss text or assign a percentage incorrectly. Review and correct the result before saving. If no bank identifier is visible, choosing a bank is required. Layout-based suggestions are explicitly labeled and editable; they are not certain identification. This is a category organizer, not a source of bank offer terms or activation status.
- Export/import JSON moves data between devices. Imports replace matching bank/month lists and preserve other lists within the six-month retention window. Version 2 backups include every retained month. Legacy version 1 data and shared links migrate using each record’s local upload month; the original local v1 storage is left untouched as a fallback. Imports are validated before use.
- Sharing includes only the selected month plus the saved settings name, when filled, and encodes the data in the URL fragment (`#…`). The fragment is not sent in the normal HTTP request to GitHub Pages. Anyone with the full link can read those categories; a copied or forwarded link cannot be revoked. Share only the cashback information you intend to disclose. Screenshot pixels are never included.
- Shared links open as a separate preview below your own list. Use **Save to app** to persist the sender’s list. A sender name is prefilled when present; unnamed data can be named during import or renamed later. Saved people remain separate from your bank/month records and participate in the same month selector.

## Install on an iPhone

Open the deployed HTTPS site in Safari, open the Share menu, choose **Add to Home Screen**, and leave **Open as Web App** enabled if shown. Launch Banker from its home-screen icon. The manifest declares standalone mode and includes 192/512 PNG icons; an Apple touch icon is supplied for Safari. Safari and the installed web app may keep separate storage, so export/import JSON if an existing browser list does not appear after installation. Installation and a real iOS device still require manual verification; desktop Chromium alone cannot establish iOS behavior.

## Deploy to GitHub Pages

The included `.github/workflows/deploy.yml` builds and publishes on pushes to `main`. In the GitHub repository's **Settings → Pages**, set the source to **GitHub Actions**. The workflow installs locked dependencies, runs the domain tests, prepares OCR assets, builds, and deploys `dist/` with GitHub's Pages actions. It sets `BASE_PATH` to the repository name so asset paths work at `https://OWNER.github.io/REPOSITORY/`.

For a custom domain or an `OWNER.github.io` repository, set the workflow's `BASE_PATH` to `/`. For another local base path, run `BASE_PATH=/banker/ npm run build`. Local builds default to relative asset paths.

The frontend registers `sw.js` relative to its page URL. Its service worker posts `{ type: 'BANKER_OFFLINE_READY' }` after it has cached the full application and OCR assets. A controlled page may request that notification with `{ type: 'BANKER_OFFLINE_STATUS' }`.

## Third-party software

- [Tesseract.js](https://github.com/naptha/tesseract.js) and [tesseract.js-core](https://github.com/naptha/tesseract.js-core): Apache-2.0; their license files are copied into the deployed OCR directory.
- [Tesseract fast language models](https://github.com/tesseract-ocr/tessdata_fast): Apache-2.0; English and Russian models at revision `87416418657359cb625c412a48b6e1d6d41c29bd`.
- [Lucide](https://lucide.dev/): ISC icon library.
- Vite and Sharp are build-time tools and are not OCR services.

## Appearance, bank marks and personal settings

Banker uses a neutral gray canvas, translucent neutral controls, and small colored category accents. After the first confirmed category (or imported data), a durable local marker switches to the compact cabinet permanently, even after the last category is deleted. The returning-user view contains the app header/settings, month selector, cashback controls/lists and a floating upload button; onboarding, marketing, summary tiles and footer are removed. Settings includes an optional display name that personalizes the greeting. It is stored in local preferences and is included as `ownerName` when you export or share your own cashbacks; leaving it blank removes the optional header name and sends an empty owner name. The settings description reflects this behavior. Appearance settings offer System, Light and Dark. System uses `prefers-color-scheme` without extra permissions and responds to device appearance changes; explicit choices persist in the same local preference record. An early local script applies appearance before rendering to avoid a light flash in dark mode. Installation guidance and retention details remain accessible in settings.

Bank identity marks in the saved lists and picker are simple, brand-inspired monograms. Original bank-logo images are not bundled or fetched. No bank marks appear in the hero or landing preview. Russian locales suggest Russian banks; other locales suggest a curated international retail-bank set (Chase, Bank of America, Citi, HSBC, Wells Fargo, Barclays, Santander, BNP Paribas, Deutsche Bank, Revolut). This is a convenience catalog, not a ranking. Any custom bank name is accepted.

## Monthly history

Use the global month selector to navigate saved lists. The current month is labeled; future and historical months have distinct markers. On opening Banker, the current month is preferred when it has data; otherwise the most recently uploaded month is shown. Saving a screenshot opens its selected month.

The review form defaults to the current local month before the 25th and the next month from the 25th onward, including December/year rollover. You can change that month before saving. Deletion, replacement, import and sharing preserve month identity. A screenshot that would fall outside the six retained months is rejected with a clear message rather than claiming to save it and silently dropping it.

## Screenshot recognition checks

The OCR pipeline retains word coordinates, separates two-column cards, removes icon glyphs around category text, normalizes dark screenshots, and attempts a separate crop for tiny colored bank-label pills. It does not need larger models or a remote AI service. A required bank picker handles screens without any visible bank identity.

`npm test` covers the pure parser, monthly data, locale catalog and validation. To replay the real screenshot regression locally, keep originals outside the repository and run:

```sh
node scripts/ocr-regression.mjs /path/to/cashbacks_screens
```

The directory is expected to contain `alfa.jpeg`, `sber.jpeg` and `t-bank.jpeg`. `--baseline` reproduces the old failures; the normal run checks exact selected category names/rates and honest bank-identification behavior. Those private source images and OCR output screenshots are never part of the app bundle or Git history.

## Home-screen widget

No native widget was added: the requested iOS/Android widget needs native platform components, which are outside a pure PWA. See the primary-source [widget research](tasks/widget-research.md). Home-screen PWA installation remains supported.

## Names and received lists in transfer files

JSON exports carry `{version:2, ownerName, banks}`. Each bank record keeps its explicit `month` (`YYYY-MM`), categories and upload timestamp. A share link carries the selected month only; the export button under **My cashbacks** includes all retained personal months. Importing a v2 record keeps its month exactly; importing it in a later month does not redate it. Earlier unnamed v1/v2 files and links remain readable.

Imports default to a separate received list. Choose **My cashbacks — restore a backup** explicitly to restore personal data, or select an existing person to update their bank/month lists. Names alone are never used to infer identity or automatically choose a replacement target. The optional owner-name field is prefilled from transfer metadata and can be supplied for unnamed data. Importing someone’s list never changes your settings name.

Received people are stored locally in `banker.received.v1`, independently from personal cashbacks. Each person retains six populated months; updating one bank/month preserves that person’s other months and every other person. A saved person’s controls allow renaming, removing and exporting their retained history with its label. Personal backup exports contain personal cashbacks; export a received person’s history using that person’s own export control. Screenshots and appearance preferences are never included in transfer data.
