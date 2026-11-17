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
- `team` holds first names only (shown in the homepage "Who we are" section and emitted as schema `employee` Persons). No roles or bios.
- `google` holds the Google Business Profile Maps URL (by CID) and the write-review URL (by place ID).
- `sameAs` is the array of profile URLs emitted in schema: Instagram and the Google Maps listing.
- `services` is an ordered list of `{ slug, name, shortName, summary }`; `Service` type is derived from it.
- `photos.ts` maps owner-supplied job photos (`@/src/assets/photos/`, originally from the Google Business Profile) to alt text. Consumed by `@/src/components/PhotoGrid.astro` on the homepage and the tree-removal and trimming pages.

### Things to Know

- `streetAddress` and `postalCode` are the only remaining `TODO(owner)` fields and are **intentionally empty**. Schema builders in `@/src/lib/schema.ts` omit any field whose value is empty, so nothing fabricated ships.
- `foundingYear` and `hours` hold real values (emitted as `foundingDate` and `openingHoursSpecification`); `hoursDisplay` is the matching on-page text.
- `reviews` holds real, consented testimonials rendered by `@/src/components/Testimonials.astro`. They are deliberately not emitted as `review` / `aggregateRating` schema: Google does not support self-serving review rich results.
- `geo` is the Ogden centroid, not an exact business location, since no street address is published yet.
- Job photos are taken at customers' homes. Committed sources must have all metadata stripped (EXIF/GPS, XMP, ICC, IPTC) and be downscaled to ~2400px on the long edge. Alt text describes only what is visible: no locations, species, customer names, or dates.

Created and maintained by nojo.
