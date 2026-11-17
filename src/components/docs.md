# Nojodoc: components

Path: @/src/components

### Overview

- Reusable `.astro` building blocks shared across pages and layouts: click-to-call button, header, footer, service card, FAQ, breadcrumbs, and related-services cross-links.
- All are static (no client hydration). Interactivity uses native `<details>`, except the header's Services dropdown, which has a small inline script with a CSS fallback.

### How it fits into the larger codebase

- Components read business facts from `@/src/data/business.ts` and link config from `@/src/lib/nav.ts`; none hardcode NAP data.
- `@/src/layouts/BaseLayout.astro` mounts `Header` and `Footer` on every page. `@/src/layouts/ServiceLayout.astro` composes `CallButton`, `Breadcrumbs`, `Faq`, and `RelatedServices`.
- Logo images are imported through `astro:assets` (`Image`) for build-time optimization to `webp` with density variants.

### Core Implementation

- **CallButton** reads phone number/href from `business.ts` — the number changes in one place. `variant`/`size`/`label`/`icon` props reproduce the original hand-coded buttons.
- **Header** renders `desktopNav` (a "Services" dropdown holding the `/tree-service/` pillar and the three service pages, then Emergency and Blog), marks the active link via `aria-current` (path-prefix match; the Services button gets an `is-current` underline when any of its links is active), shows the optimized logo, and provides a no-JS mobile menu using a `<details>` toggle that lists the flat `primaryNav`.
- **Services dropdown**: a `<button>` with `aria-expanded`/`aria-controls`. The script opens it on mouse hover, click/tap, or Enter/Space; a click after a hover pins it open; Escape (from anywhere; returns focus to the button if focus was inside), a click outside, focus leaving the item, or following one of its links closes it. On `pageshow` from the back/forward cache it resets the dropdown and the mobile `<details>` menu to closed. The script sets `data-ready`; until then CSS shows the menu on `:hover`/`:focus-within`, so the links stay reachable without JS.
- **Footer** (every page) renders `footerColumns` plus a brand/NAP column (name, service-area line, phone, `hoursDisplay`) and a Connect column (Instagram, "Find us on Google", "Leave a Google review"); the address line collapses to locality/region when no `streetAddress` is set.
- **Faq** renders the visible FAQ from a `{q, a}[]` array using `<details>` accordions.
- **Breadcrumbs** renders a visible trail; the last crumb is a non-link `aria-current="page"`.
- **ServiceCard** / **RelatedServices** render service links from the `services` list; `RelatedServices` filters out the current page via an `exclude` slug.
- **PhotoGrid** renders a list of `Photo`s from `@/src/data/photos.ts` as `<Picture>` (avif + webp, jpg fallback, 360–1080w srcset). Lazy by default; pass `eager` for a grid that can sit above the fold (the first grid on each service page). Two columns everywhere; three inside the homepage `.recent-work` section from 800px up. Tiles are cropped to 3:4.
- **PhotoGrid must pass `fallbackFormat`.** Without it, `<Picture>` reads `src.format` to choose the fallback; any property read on an imported image marks the original as used, and the build then ships the full-size source JPEG in `dist/_astro`. `<Image>` never reads the metadata, so it doesn't have this problem.

### Things to Know

- **FAQ visible/schema parity is a contract.** `Faq` only renders content; the matching `FAQPage` schema is built by the *page* from the same `faqs` array (`getFaqSchema`). The two must be fed the identical array — a Google requirement for FAQ rich results.
- Breadcrumbs follow the same pattern: the component and `getBreadcrumbSchema` are handed the same `trail`.
- The mobile nav relies entirely on `<details>`/`<summary>`; there is no JavaScript fallback because none is needed.
- Header row items never shrink. The header uses the page's 1100px `.wrap`; the full nav row needs ~780px at a 16px default font, so it shows from 800px / 50em up and the `<details>` menu takes over below. Under 640px / 40em the call button and menu toggle go icon-only and the logo drops to 44px; under 390px / 24.3em the tagline hides and gaps tighten. Each breakpoint is a px width OR an em width, because the brand and nav text are in rem and grow with the user's default font size. Adding a top-level nav item means re-measuring at 16px and 20px default fonts.
- The logo asset (`@/src/assets/tree-easy-logo.png`) has a transparent background and is sized by `height` only, so it keeps its non-square aspect ratio.

Created and maintained by nojo.
