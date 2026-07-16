/**
 * Single source of truth for all business (NAP) facts and figures.
 *
 * Consumed by the schema helpers (src/lib/schema.ts), the layout <head>,
 * and UI components (Header, Footer, CallButton, service-area list).
 *
 * Fields marked `TODO(owner)` are placeholders awaiting real, verified values
 * from the business owner. Nothing here is fabricated — schema/content that
 * depends on a TODO field is omitted until the real value is supplied.
 */

export const SITE_URL = 'https://treeeasyogden.com';

/** Stable IRI that every schema node references as the business identity. */
export const ORG_ID = `${SITE_URL}/#organization`;

export const business = {
  name: 'Tree Easy',
  legalName: 'Tree Easy',
  tagline: 'Ogden · Weber County',
  url: SITE_URL,
  logo: `${SITE_URL}/tree-easy-logo.png`,
  image: `${SITE_URL}/tree-easy-logo.png`,
  priceRange: '$$',

  phoneDisplay: '(385) 528-4899',
  phoneHref: 'tel:+13855284899',
  /** Spoken-friendly aria-label for click-to-call buttons. */
  phoneAria: 'Call Tree Easy at 3 8 5, 5 2 8, 4 8 9 9',

  address: {
    // TODO(owner): streetAddress + postalCode. Omitted from schema until provided.
    streetAddress: '' as string,
    postalCode: '' as string,
    locality: 'Ogden',
    region: 'UT',
    country: 'US',
  },

  /** Ogden, UT centroid. Replace with exact business coordinates if an address is published. */
  geo: {
    latitude: 41.223,
    longitude: -111.9738,
  },

  // TODO(owner): real founding year -> foundingDate + "Serving Ogden since YYYY".
  foundingYear: '' as string,

  // TODO(owner): real operating hours -> openingHoursSpecification.
  // Example shape (uncomment + set once confirmed):
  // hours: [{ days: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '07:00', closes: '18:00' }],
  hours: [] as Array<{ days: string[]; opens: string; closes: string }>,

  // TODO(owner): publishable license number -> hasCredential. Omitted until provided.
  licenseNumber: '' as string,

  // TODO(owner): real customer reviews only (name + date + consent).
  // Fabricated review/aggregateRating markup violates Google policy — leave empty until real.
  reviews: [] as Array<{ author: string; rating: number; body: string; datePublished: string }>,

  social: {
    instagram: 'https://www.instagram.com/treeeasyogden/',
    instagramHandle: '@treeeasyogden',
  },

  /** Weber County cities served (visible UI list + schema areaServed). */
  areaServed: [
    'Ogden',
    'North Ogden',
    'South Ogden',
    'Pleasant View',
    'Washington Terrace',
    'Roy',
    'Riverdale',
    'Clinton',
    'Harrisville',
    'Farr West',
    'Marriott-Slaterville',
    'West Haven',
    'Uintah',
    'Hooper',
    'Plain City',
  ],
} as const;

/** All `sameAs` profile URLs for schema. */
export const sameAs = [business.social.instagram];

/**
 * Canonical service definitions — the single source for nav, cross-links,
 * makesOffer schema, and per-service page metadata.
 */
export const services = [
  {
    slug: 'tree-removal',
    name: 'Tree Removal',
    shortName: 'Tree Removal',
    summary:
      'Full takedowns for dead, hazardous, or unwanted trees — tight yards, close to structures, or out in the open. We haul it all off and leave the site clean.',
  },
  {
    slug: 'trimming-pruning',
    name: 'Tree Trimming & Pruning',
    shortName: 'Trimming & Pruning',
    summary:
      'Shape, thin, deadwood, and reduce crown to keep trees healthy and safe. Clearance pruning for roofs, driveways, and power lines done right.',
  },
  {
    slug: 'stump-grinding',
    name: 'Stump Grinding',
    shortName: 'Stump Grinding',
    summary:
      'Grind the stump below grade so you can replant, sod, or pave right over it. Fast, clean, and no more tripping over roots.',
  },
] as const;

export type Service = (typeof services)[number];

export function servicePath(slug: string): string {
  return `/services/${slug}/`;
}
