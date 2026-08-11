# ATLAS — portfolio

Vite + React + TypeScript. Static SPA — ready for GitHub Pages.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

To preview with a GitHub Pages project base path:

```bash
# Windows PowerShell
$env:VITE_BASE_PATH="/ta-portfolio/"; npm run build; npm run preview
```

## Deploy (GitHub Pages)

1. Push this repo to GitHub (name can be anything; CI uses the repo name as `base`).
2. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push to `main`/`master` (or run the **Deploy GitHub Pages** workflow manually).

Routing uses `BrowserRouter` + `basename` from Vite `base`. Deep links work via a copied `404.html` (same as `index.html`).

## Secrets

No API keys or env secrets are required. Contact email/Telegram on the Contact page are intentional public links.
