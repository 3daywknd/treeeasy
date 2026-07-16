# Nojodoc: data

Path: @/src/data

### Overview

- `business.ts` is the **single source of truth** for all NAP (name / address / phone) facts, geo coordinates, the Weber County service-area cities, and the canonical `services` list.
- Every schema builder, layout `<head>`, and UI component reads from here so business facts change in exactly one place.

### How it fits into the larger codebase

- Consumed by `@/src/lib/schema.ts` (all JSON-LD), `@/src/lib/nav.ts` (nav + footer links derived from `services`), `@/src/layouts/BaseLayout.astro` (`<head>` metadata), and components (Header, Footer, CallButton, ServiceCard, RelatedServices).
- Exports `ORG_ID` (`https://treeeasyogden.com/#organization`) — the stable schema identity that every other schema node references by `@id` instead of restating the business.
- Exports `servicePath(slug)` -> `/services/{slug}/`, the canonical path helper used for cross-links and schema URLs (trailing slash matches the directory-style build).
- `services` drives the homepage cards, the nav, cross-links, `makesOffer` schema, and the `slug` union type accepted by `@/src/layouts/ServiceLayout.astro`.

### Core Implementation

- `business` is a `const` object: name, phone (`phoneDisplay` / `phoneHref` / spoken `phoneAria`), price range, address, geo, social, and the ordered `areaServed` city list (used both as the visible UI list and schema `areaServed`).
- `sameAs` is the array of social profile URLs emitted in schema.
- `services` is an ordered list of `{ slug, name, shortName, summary }`; `Service` type is derived from it.

### Things to Know

- Fields marked `TODO(owner)` — `streetAddress`, `postalCode`, `foundingYear`, `hours`, `licenseNumber`, `reviews` — are **intentionally empty placeholders**. Schema builders in `@/src/lib/schema.ts` omit any field whose value is empty, so nothing fabricated ships.
- `reviews` is deliberately empty: fabricated review / aggregateRating markup violates Google policy, so it stays empty until real, consented reviews exist.
- `geo` is the Ogden centroid, not an exact business location, since no street address is published yet.

Created and maintained by nojo.
