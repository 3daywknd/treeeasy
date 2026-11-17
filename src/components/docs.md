# Nojodoc: components

Path: @/src/components

### Overview

- Reusable `.astro` building blocks shared across pages and layouts: click-to-call button, header, footer, service card, FAQ, breadcrumbs, and related-services cross-links.
- All are static and JS-free (no client hydration); interactivity uses native `<details>`.

### How it fits into the larger codebase

- Components read business facts from `@/src/data/business.ts` and link config from `@/src/lib/nav.ts`; none hardcode NAP data.
- `@/src/layouts/BaseLayout.astro` mounts `Header` and `Footer` on every page. `@/src/layouts/ServiceLayout.astro` composes `CallButton`, `Breadcrumbs`, `Faq`, and `RelatedServices`.
- Logo images are imported through `astro:assets` (`Image`) for build-time optimization to `webp` with density variants.

### Core Implementation

- **CallButton** reads phone number/href from `business.ts` — the number changes in one place. `variant`/`size`/`label`/`icon` props reproduce the original hand-coded buttons.
- **Header** renders `primaryNav`, marks the active link via `aria-current` (path-prefix match), shows the optimized logo, and provides a no-JS mobile menu using a `<details>` toggle.
- **Footer** (every page) renders `footerColumns` plus a brand/NAP column (name, service-area line, phone, `hoursDisplay`, "Lic. #") and a Connect column (Instagram, "Find us on Google", "Leave a Google review"); the address line collapses to locality/region when no `streetAddress` is set.
- **Faq** renders the visible FAQ from a `{q, a}[]` array using `<details>` accordions.
- **Breadcrumbs** renders a visible trail; the last crumb is a non-link `aria-current="page"`.
- **ServiceCard** / **RelatedServices** render service links from the `services` list; `RelatedServices` filters out the current page via an `exclude` slug.

### Things to Know

- **FAQ visible/schema parity is a contract.** `Faq` only renders content; the matching `FAQPage` schema is built by the *page* from the same `faqs` array (`getFaqSchema`). The two must be fed the identical array — a Google requirement for FAQ rich results.
- Breadcrumbs follow the same pattern: the component and `getBreadcrumbSchema` are handed the same `trail`.
- The mobile nav relies entirely on `<details>`/`<summary>`; there is no JavaScript fallback because none is needed.
- Header row items never shrink. The full nav needs ~1200px of row, so the header container is 1240px (wider than the 1100px page `.wrap`) and the `<details>` menu takes over below 1240px. Under 640px the call button and menu toggle go icon-only and the logo drops to 44px; under 390px the tagline hides. Adding a nav item means re-measuring that breakpoint.
- The logo asset (`@/src/assets/tree-easy-logo.png`) has a transparent background and is sized by `height` only, so it keeps its non-square aspect ratio.

Created and maintained by nojo.
