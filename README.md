# رقيب · RAQEEB — Interface Prototype

A standalone static export of the RAQEEB interface prototype: an RTL Arabic landing
page with a 3D radar globe, a light/dark theme toggle, a live alerts feed, a
compliance dashboard, and an interactive demo of compliance analysis.

**All data is demo data hard-coded in `js/main.js`.** The site does not call any
backend, database, API, or AI service. It needs no account, login, API key, or build step.

## Project structure

```
raqeeb-prototype/
├── index.html            # Page markup
├── css/styles.css        # All styles (theme tokens, layout, responsive rules)
├── js/main.js            # Interactions: theme toggle, feed, demo, gauge, 3D globe
├── vendor/               # Optional local copy of three.js (see vendor/README.md)
├── scripts/fetch-vendor.sh
├── .nojekyll             # Tells GitHub Pages to serve files as-is
└── README.md
```

## Run locally

**Option A, open the file:** double-click `index.html`. It opens in any modern browser.

**Option B, local server (recommended):** run one of these from the project folder,
then open http://localhost:8000

```bash
python -m http.server 8000      # Python 3
# or
npx serve .                     # Node.js
```

In VS Code you can also use the "Live Server" extension: right-click `index.html`
and choose **Open with Live Server**.

## Deploy to GitHub Pages

1. Create a new public repository on GitHub, e.g. `raqeeb-prototype`.
2. Upload the **contents** of this folder to the repo root, so `index.html` sits at
   the top level. Either drag and drop the files on GitHub's web page
   (**Add file → Upload files**), or use git:
   ```bash
   git init
   git add .
   git commit -m "RAQEEB interface prototype"
   git branch -M main
   git remote add origin https://github.com/<your-username>/raqeeb-prototype.git
   git push -u origin main
   ```
3. In the repo, open **Settings → Pages**. Under **Build and deployment**, set
   **Source: Deploy from a branch**, **Branch: `main`**, folder **`/ (root)`**, and save.
4. After a minute or two the site is live at
   `https://<your-username>.github.io/raqeeb-prototype/`.

All paths are relative, so the site also works on Netlify, Vercel, Cloudflare
Pages, or any static host. Upload the folder as-is; there is no build command, and
the output directory is the project root.

## External resources

The page loads two free public resources over the internet. Neither needs a key or an account:

| Resource | Source | If it is unavailable |
|---|---|---|
| IBM Plex Sans Arabic / IBM Plex Mono fonts | Google Fonts | The page falls back to system fonts |
| three.js r128 (3D globe) | cdnjs, falling back to `vendor/three.min.js` | A static gradient background replaces the globe |

To run fully offline, add the local three.js copy as described in `vendor/README.md`.

## Responsive & accessibility

- Breakpoints at 1150 / 1000 / 900 / 760 / 520 px cover desktop, tablet, and mobile.
- The layout respects `prefers-color-scheme`, has a manual theme toggle, honors
  `prefers-reduced-motion`, and supports safe-area insets on notched phones.

## Editing the demo content

- **Alerts feed:** the `pool` array in `js/main.js`
- **Interactive demo cases:** the `cases` array in `js/main.js`
- **Colors:** the CSS variables at the top of `css/styles.css` (`--brand`, `--surface-0`, …)
