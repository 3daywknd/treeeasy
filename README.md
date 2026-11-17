# Tree Easy — treeeasyogden.com

Local tree-care site for Tree Easy (Ogden & Weber County, UT), built with
[Astro](https://astro.build) and served as static assets from a Cloudflare
Worker (`treeeasy`), deployed by Cloudflare Workers Builds.

## Develop

```bash
npm install
npm run dev        # local dev server (hot reload)
npm run build      # production build -> dist/
npm run preview    # serve the built dist/ locally
npm run verify     # post-build SEO checks over dist/ (run after build)
```

Requires Node 22.12+ (Wrangler's minimum); Workers Builds and CI use Node 24.

## Where things live

| Path | What |
| --- | --- |
| `src/data/business.ts` | **Single source of truth** for phone, address, hours, license, service area, team names, Google Business Profile links, and the service list. Edit business facts here. |
| `src/lib/schema.ts` | JSON-LD builders (structured data). |
| `src/lib/nav.ts` | Header/footer links. |
| `src/layouts/` | `BaseLayout` (the `<head>` + page chrome), `ServiceLayout`. |
| `src/components/` | Reusable pieces (Header, Footer, CallButton, Faq, …). |
| `src/pages/` | One file = one route. |
| `src/content/blog/` | Blog posts (Markdown). |
| `public/` | Files copied as-is: `robots.txt`, favicons, OG image. |
| `src/pages/404.astro` | Not-found page (`noindex`), served with a 404 status for unknown paths. |
| `wrangler.jsonc` | Cloudflare Worker config: serves `dist/` as static assets. |

## Common edits

### Change the phone number, address, or hours

Edit **`src/data/business.ts`** — it flows everywhere (buttons, footer, schema).
Change it in that one file only.

### Fill in the owner-provided facts

Several fields ship as empty `TODO(owner)` placeholders. When you have the real
values, set them in `src/data/business.ts` and the schema picks them up
automatically (empty values are intentionally left out of structured data so
nothing fabricated is published):

- `foundingYear` → adds `foundingDate` and lets you say "Serving Ogden since YYYY".
- `hours` → adds `openingHoursSpecification`. Example:
  ```ts
  hours: [{ days: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '07:00', closes: '18:00' }],
  ```
- `address.streetAddress` + `address.postalCode` → full postal address in schema.
- `licenseNumber` → adds `hasCredential`.
- `reviews` → adds `review` + `aggregateRating`. **Only add real reviews**
  (name, rating, date, with the customer's consent). Fake review markup violates
  Google policy and can get the site penalized.

### Add a blog post

Create `src/content/blog/my-post.md` with front matter:

```md
---
title: 'Post Title'
description: 'One-sentence summary for search results (~150 chars).'
pubDate: 2026-08-01
---

Body in Markdown. Link to services like [tree removal](/services/tree-removal/).
```

It appears on `/blog/` automatically and gets its own page + `BlogPosting` schema.

### Add a service

Add an entry to the `services` array in `src/data/business.ts`, then create
`src/pages/services/<slug>.astro` using `ServiceLayout` (copy an existing one).
Nav, footer, sitemap, and cross-links update from the data.

## Deploy

The site is an assets-only Cloudflare Worker named `treeeasy` (no Worker
script; `wrangler.jsonc` points it at `dist/`). Cloudflare **Workers Builds**
watches this repo and deploys every push to `main`. Pull requests run
`.github/workflows/ci.yml` (build + SEO verify) on GitHub Actions.

### Workers Builds settings

In the Cloudflare dashboard: **Workers & Pages → `treeeasy` → Settings →
Build → Connect** (the Worker already exists, so connect the repo to it rather
than creating a new one via "Import a repository").

| Setting | Value |
| --- | --- |
| Git repository | `3daywknd/treeeasy` |
| Git branch | `main` |
| Build command | `npm run build && npm run verify` |
| Deploy command | `npx wrangler deploy` |
| Root directory | *(leave blank)* |
| Build variables | none |
| API token | let Cloudflare create one |
| Builds for non-production branches | off (PRs are checked by GitHub Actions) |

Notes:

- The dashboard Worker name must match `name` in `wrangler.jsonc`
  (`treeeasy`), or the build fails.
- Workers Builds installs dependencies from `package-lock.json`, then runs the
  build command. Because `npm run verify` is part of it, an SEO regression fails
  the build and nothing is deployed.
- `npx wrangler deploy` uses the Wrangler version pinned in `devDependencies`.

### URL handling

`wrangler.jsonc` sets:

- `html_handling: "force-trailing-slash"`: pages are served only at their
  trailing-slash URL (`/services/tree-removal/`), which is also the canonical
  URL. `/services/tree-removal` and `/services/tree-removal/index.html`
  307-redirect to it.
- `not_found_handling: "404-page"`: any unknown path serves `dist/404.html`
  with a 404 status.

### Manual deploy

```bash
npm run build && npm run verify
npx wrangler deploy   # deploys to whichever account Wrangler is logged into
```

### Don't break these

- `robots.txt` points to `/sitemap-index.xml` (generated by `@astrojs/sitemap`
  at build — there is no hand-written `sitemap.xml`).
- Canonical URLs and internal links use trailing slashes (`/services/x/`) to
  match Astro's directory-style output.

## SEO notes

- Business identity is defined once (homepage `Organization`/`TreeService` node,
  id `…/#organization`); every other page references it by `@id`.
- A page's visible FAQ and its `FAQPage` schema are built from the **same**
  `faqs` array so they never drift — required for FAQ rich results.
- Run `npm run build && npm run verify` before shipping. For a deeper check,
  paste built pages into Google's
  [Rich Results Test](https://search.google.com/test/rich-results) and run
  Lighthouse for Core Web Vitals.
