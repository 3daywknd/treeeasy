# Nojodoc: Tree Easy (repo root)

Path: @/

### Overview

- Static marketing site for **Tree Easy**, a tree-care business in Ogden / Weber County, UT, served from the apex domain `treeeasyogden.com`.
- Built with **Astro** (static output) and served as an assets-only **Cloudflare Worker** (`treeeasy`), deployed by Cloudflare Workers Builds on push to `main`. This replaced an earlier GitHub Pages deployment, which itself replaced a single hand-coded `index.html` + `styles.css`.
- The migration expanded one page into an SEO-focused multi-page site (homepage, a `tree-service` pillar hub, three service pages, an emergency page, a blog, and a `noindex` 404 page) with a schema.org entity graph.

### How it fits into the larger codebase

- `astro.config.mjs` is the build entry point. `site` is set to `https://treeeasyogden.com` with **no `base`** because the site lives at the domain root, not a repo subpath.
- `trailingSlash: 'ignore'` + `build.format: 'directory'` produce directory-style URLs (`/services/tree-removal/` -> `.../index.html`). Canonical URLs and internal links throughout `@/src` are written with trailing slashes to match this output.
- `@astrojs/sitemap` generates `/sitemap-index.xml`. Its `serialize()` assigns per-type priorities: homepage `1.0`; service, `tree-service`, and `emergency` pages `0.8`; blog `0.5`; everything else the default `0.7`.
- `wrangler.jsonc` defines the Worker: no script, `assets.directory` = `./dist`, `html_handling: force-trailing-slash` (HTML served only at trailing-slash URLs; slashless and `/index.html` forms 307 to them), `not_found_handling: 404-page` (unknown paths serve `dist/404.html` with status 404), and `workers_dev` / `preview_urls` off so the only public copy is the custom domain. Workers Builds runs `npm run build && npm run verify`, then `npx wrangler deploy` with the Wrangler version pinned in `devDependencies`.
- `.github/workflows/ci.yml` runs build + verify on pull requests.
- `public/` is copied verbatim into `dist/`. It holds `robots.txt` (points crawlers at `/sitemap-index.xml`) and static favicon / apple-touch / og-image assets referenced by `@/src/layouts/BaseLayout.astro`.
- `scripts/verify-seo.mjs` (run via `npm run verify`) is a post-build audit over `dist/`: it parses every JSON-LD block, asserts each `Service` node references `ORG_ID` as its provider, checks `FAQPage` has entities, validates one `<h1>` per page, meta-description length, canonical presence (skipped on `noindex` pages such as the 404), and internal-link / asset integrity.

### Core Implementation

- Source lives under `@/src`: `data` (single source of truth for business facts), `lib` (schema + nav config), `components`, `layouts`, `pages` (file-based routes), and `content` (blog collection). See each folder's docs.md.
- The build reads markdown blog posts through the content collection defined in `@/src/content.config.ts` and emits static HTML for every route.
- The original design was preserved: `@/src/styles/global.css` (renamed from the legacy `styles.css`) still styles the homepage, and `CallButton` variants reproduce the original hand-coded buttons.

### Things to Know

- **The dashboard Worker name must equal `name` in `wrangler.jsonc`** (`treeeasy`), or Workers Builds fails. Custom-domain routing is configured on the Worker in the Cloudflare dashboard, not in this repo.
- Workers Builds settings (build/deploy commands) live in the Cloudflare dashboard; the README "Deploy" section records the expected values.
- No fabricated business facts ship: optional NAP fields are omitted from schema until real values are supplied in `@/src/data/business.ts`.
- `verify-seo.mjs` is intentionally dependency-free. It gates production (part of the Workers Builds build command) and PRs (`ci.yml`).

Created and maintained by nojo.
