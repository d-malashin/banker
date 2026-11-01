# Banker

[Open Banker](https://d-malashin.github.io/banker/) · [Source repository](https://github.com/d-malashin/banker)

A mobile-first, local-only cashback cabinet with a frosted-glass interface. Upload a screenshot of a Russian bank's cashback page, recognize its bank and categories on your own device, review the result, and save it. Russian browser locales get Russian interface text; other locales get English.

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
- A bank has one category list. Saving a new screenshot for the same bank replaces its complete previous list after review. Other banks are retained.
- OCR can miss text or assign a percentage incorrectly. Review and correct the result before saving. If a screenshot contains only a logo, select the bank manually. This is a category organizer, not a source of bank offer terms or activation status.
- Export/import JSON moves data between devices. Imported banks replace matching banks and preserve other existing banks. Imports are validated before use.
- Sharing encodes categories in the URL fragment (`#…`). The fragment is not sent in the normal HTTP request to GitHub Pages. Anyone with the full link can read those categories; a copied or forwarded link cannot be revoked. Share only the cashback information you intend to disclose. Screenshot pixels are never included.
- Received shared lists appear separately below your own list. Opening a shared link never replaces your categories.

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

Banker uses a neutral gray canvas, translucent white controls, and small colored category/summary accents. Settings includes an optional display name that personalizes the greeting. It is stored separately on the current device and is excluded from JSON exports and shared links; leaving it blank restores the default greeting.

Ten locally bundled bank marks identify Sber, VTB, Gazprombank, Alfa-Bank, PSB, Rosselkhozbank, T-Bank, Bank DOM.RF, MKB, and Sovcombank. Selection follows the Interfax-100 Q3 2026 asset ranking, not a reliability recommendation. Original asset URLs, attribution, transformations, and file hashes are recorded in [public/banks/sources.json](public/banks/sources.json). The marks are served with the app and precached for offline use; no third-party logo service is contacted by the browser. Other supported or custom banks retain a letter badge.
