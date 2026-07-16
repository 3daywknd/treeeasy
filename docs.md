# Nojodoc: Tree Easy (repo root)

Path: @/

### Overview

- Static marketing site for **Tree Easy**, a tree-care business in Ogden / Weber County, UT, served from the apex domain `treeeasyogden.com`.
- Built with **Astro** (static output) and deployed to GitHub Pages via GitHub Actions. This replaced an earlier single hand-coded `index.html` + `styles.css` served by the legacy `main:/` Pages build.
- The migration expanded one page into an SEO-focused multi-page site (homepage, a `tree-service` pillar hub, three service pages, an emergency page, and a blog) with a schema.org entity graph.

### How it fits into the larger codebase

- `astro.config.mjs` is the build entry point. `site` is set to `https://treeeasyogden.com` with **no `base`** because the site lives at the domain root, not a repo subpath.
- `trailingSlash: 'ignore'` + `build.format: 'directory'` produce directory-style URLs (`/services/tree-removal/` -> `.../index.html`). Canonical URLs and internal links throughout `@/src` are written with trailing slashes to match this output.
- `@astrojs/sitemap` generates `/sitemap-index.xml`. Its `serialize()` assigns per-type priorities: homepage `1.0`; service, `tree-service`, and `emergency` pages `0.8`; blog `0.5`; everything else the default `0.7`.
- `.github/workflows/deploy.yml` runs `npm ci && npm run build` on push to `main`, uploads `dist/` as a Pages artifact, and deploys via `actions/deploy-pages`. Concurrency is grouped on `pages` with `cancel-in-progress: false` so a production deploy is never interrupted.
- `public/` is copied verbatim into `dist/`. It holds the load-bearing `CNAME`, `robots.txt` (points crawlers at `/sitemap-index.xml`), and static favicon / apple-touch / og-image assets referenced by `@/src/layouts/BaseLayout.astro`.
- `scripts/verify-seo.mjs` (run via `npm run verify`) is a post-build audit over `dist/`: it parses every JSON-LD block, asserts each `Service` node references `ORG_ID` as its provider, checks `FAQPage` has entities, validates one `<h1>` per page, meta-description length, canonical presence, and internal-link / asset integrity.

### Core Implementation

- Source lives under `@/src`: `data` (single source of truth for business facts), `lib` (schema + nav config), `components`, `layouts`, `pages` (file-based routes), and `content` (blog collection). See each folder's docs.md.
- The build reads markdown blog posts through the content collection defined in `@/src/content.config.ts` and emits static HTML for every route.
- The original design was preserved: `@/src/styles/global.css` (renamed from the legacy `styles.css`) still styles the homepage, and `CallButton` variants reproduce the original hand-coded buttons.

### Things to Know

- **`public/CNAME` is load-bearing.** It must contain `treeeasyogden.com`; removing it makes every deploy drop the custom-domain binding and breaks the apex domain.
- **Cutover requires a manual Pages setting change.** The repo's Pages "source" must be switched from the legacy branch build to "GitHub Actions" for `deploy.yml` to take effect.
- No fabricated business facts ship: optional NAP fields are omitted from schema until real values are supplied in `@/src/data/business.ts`.
- `verify-seo.mjs` is intentionally dependency-free and is not wired into `deploy.yml`; it is a local/manual gate.

Created and maintained by nojo.
