# Nojodoc: lib

Path: @/src/lib

### Overview

- `schema.ts`: JSON-LD builders that produce the site's structured data (`getOrganizationSchema`, `getServiceSchema`, `getBreadcrumbSchema`, `getFaqSchema`, `getBlogPostingSchema`).
- `nav.ts`: header nav + footer link column config, derived from the `services` list.

### How it fits into the larger codebase

- Both modules read facts from `@/src/data/business.ts`; neither restates business data.
- Schema builders are called by pages and layouts, and their output is passed as the `schemas` prop to `@/src/layouts/BaseLayout.astro`, which renders each node as its own `<script type="application/ld+json">`.
- `nav.ts` is consumed by `@/src/components/Header.astro` (primaryNav) and `@/src/components/Footer.astro` (footerColumns).

### Core Implementation

- **Single-identity entity graph.** The full business node (`getOrganizationSchema`, a `TreeService` LocalBusiness subtype) is emitted **once**, on the homepage, addressed by `ORG_ID`. Every other page references the business by `@id` — `Service.provider: {'@id': ORG_ID}`, `BlogPosting.publisher/author: {'@id': ORG_ID}` — rather than duplicating it.
- `getServiceSchema` accepts an optional explicit `path` so hub pages like `/tree-service/` and `/emergency/` can produce Service nodes at non-`/services/` URLs.
- `getFaqSchema` builds a `FAQPage` from an array of `{q, a}`; pages pass the **same** array to both this builder and the visible `@/src/components/Faq.astro` so structured data always matches on-page content.
- `absUrl(path)` resolves site-relative paths to absolute URLs via `new URL(path, SITE_URL)`.
- `nav.ts` composes `primaryNav` and `footerColumns` by spreading `services.map(...)` around fixed links (Tree Service, Emergency, Blog), keeping link sets consistent across pages.

### Things to Know

- Optional schema fields (`openingHoursSpecification`, `address` street/postal, `foundingDate`, `hasCredential`, `aggregateRating`, `review`) are attached **only when a real value exists** in `business.ts`. Empty TODO values produce no output.
- `aggregateRating` / `review` are computed from `business.reviews`; while that array is empty they emit nothing (avoids fabricated ratings).
- FAQ and Breadcrumb schema correctness depends on the page passing the identical array/trail used to render the visible component; `scripts/verify-seo.mjs` checks the provider `@id` linkage and FAQ presence post-build.

Created and maintained by nojo.
