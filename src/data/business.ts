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

  foundingYear: '2026' as string,

  /** Operating hours -> openingHoursSpecification. Open 7 days, 8am–5pm. */
  hours: [
    {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '08:00',
      closes: '17:00',
    },
  ] as Array<{ days: string[]; opens: string; closes: string }>,
  /** Human-readable hours for on-page display. */
  hoursDisplay: 'Open 7 days a week, 8am–5pm',

  licenseNumber: '14688870-0160' as string,

  /**
   * Real customer testimonials (owner-provided, with consent). Displayed on-page
   * only. Intentionally NOT emitted as review/aggregateRating schema: Google does
   * not support self-serving review rich results (reviews about your own business
   * on your own site), and such markup risks a structured-data penalty.
   */
  reviews: [
    {
      author: 'John Gemme',
      body: 'Excellent job by Caden and Matt!! We had a 30′ pine very close to the house that needed to be taken down delicately. They made it look easy as they methodically limbed and took the tree down piece by piece. We also had various dead oaks and a couple overgrown mugo pine that needed to go. They were professional, polite and had great safety skills. I highly recommend hiring these guys for your tree removal project!',
    },
    {
      author: 'Robert Jones',
      body: "Matt is a knowledgeable guy and did a fantastic job. He was able to help me keep a huge tree I thought I'd have to remove. Work was completed quickly and price was very fair. I'm having him back for another job this year.",
    },
    {
      author: 'Arielle Neely',
      body: 'Matt was exceptional to work with. He was more than willing to meet with us and deliver his most professional and honest opinion regarding our almost 100-year-old Catalpa tree. The last time our tree was pruned by someone else, we were told they almost killed it. When I explained this to Matt, he came by to take a look and provided both an honest opinion and a reasonable quote. He delivers quality work, he’s extremely reliable and knowledgeable, and he’s both professional and extremely friendly. Our Catalpa is looking better than it has in a very long time. I wouldn’t trust anyone else with our tree work. This is your new tree guy!',
    },
    {
      author: 'Tessa Stewart',
      body: 'Matt did a great job for us!! He removed a couple of trees and trimmed a few others, and gave us some great advice on caring for our trees. He was very professional and friendly. And the price was very reasonable!',
    },
  ] as Array<{ author: string; body: string }>,

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
