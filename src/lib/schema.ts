/**
 * JSON-LD schema builders. Single source of truth for structured data.
 *
 * The business identity lives in ONE node (getOrganizationSchema, emitted on the
 * homepage) addressed by ORG_ID. Every other page references it by `@id` rather
 * than restating the business — a proper schema.org entity graph.
 *
 * Optional fields (hours, address, reviews, license, foundingDate) are included
 * ONLY when a real value exists in business.ts. No placeholders leak into output.
 */

import { business, sameAs, services, SITE_URL, ORG_ID, servicePath } from '../data/business';

type JsonLd = Record<string, unknown>;

/** Absolute URL from a site-relative path. */
export function absUrl(path: string): string {
  return new URL(path, SITE_URL).href;
}

function postalAddress(): JsonLd {
  const addr: JsonLd = {
    '@type': 'PostalAddress',
    addressLocality: business.address.locality,
    addressRegion: business.address.region,
    addressCountry: business.address.country,
  };
  if (business.address.streetAddress) addr.streetAddress = business.address.streetAddress;
  if (business.address.postalCode) addr.postalCode = business.address.postalCode;
  return addr;
}

function openingHours(): JsonLd[] | undefined {
  if (!business.hours.length) return undefined;
  return business.hours.map((h) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: h.days,
    opens: h.opens,
    closes: h.closes,
  }));
}

function aggregateRating(): JsonLd | undefined {
  if (!business.reviews.length) return undefined;
  const ratingValue =
    business.reviews.reduce((sum, r) => sum + r.rating, 0) / business.reviews.length;
  return {
    '@type': 'AggregateRating',
    ratingValue: Number(ratingValue.toFixed(1)),
    reviewCount: business.reviews.length,
  };
}

function reviews(): JsonLd[] | undefined {
  if (!business.reviews.length) return undefined;
  return business.reviews.map((r) => ({
    '@type': 'Review',
    author: { '@type': 'Person', name: r.author },
    reviewRating: { '@type': 'Rating', ratingValue: r.rating },
    reviewBody: r.body,
    datePublished: r.datePublished,
  }));
}

/**
 * The full business node (TreeService is a LocalBusiness subtype).
 * Emitted once, on the homepage. This is the anchor for ORG_ID.
 */
export function getOrganizationSchema(): JsonLd {
  const node: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TreeService',
    '@id': ORG_ID,
    name: business.name,
    url: business.url,
    image: business.image,
    logo: business.logo,
    telephone: business.phoneHref.replace('tel:', ''),
    priceRange: business.priceRange,
    address: postalAddress(),
    geo: {
      '@type': 'GeoCoordinates',
      latitude: business.geo.latitude,
      longitude: business.geo.longitude,
    },
    areaServed: business.areaServed.map((city) => ({
      '@type': 'City',
      name: `${city}, ${business.address.region}`,
    })),
    sameAs,
    makesOffer: services.map((s) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s.name },
    })),
  };

  const hours = openingHours();
  if (hours) node.openingHoursSpecification = hours;
  if (business.foundingYear) node.foundingDate = business.foundingYear;
  if (business.licenseNumber) {
    node.hasCredential = {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'license',
      identifier: business.licenseNumber,
    };
  }
  const rating = aggregateRating();
  if (rating) node.aggregateRating = rating;
  const rev = reviews();
  if (rev) node.review = rev;

  return node;
}

/** A Service node that references the business by @id (does not restate it). */
export function getServiceSchema(opts: {
  name: string;
  description: string;
  slug: string;
  /** Explicit canonical path; defaults to /services/{slug}/. */
  path?: string;
  serviceType?: string;
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    description: opts.description,
    serviceType: opts.serviceType ?? opts.name,
    url: absUrl(opts.path ?? servicePath(opts.slug)),
    provider: { '@id': ORG_ID },
    areaServed: business.areaServed.map((city) => ({
      '@type': 'City',
      name: `${city}, ${business.address.region}`,
    })),
  };
}

/** BreadcrumbList from an ordered trail of {name, path} crumbs. */
export function getBreadcrumbSchema(trail: Array<{ name: string; path: string }>): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: absUrl(crumb.path),
    })),
  };
}

/** FAQPage — MUST be built from the same array the visible FAQ renders from. */
export function getFaqSchema(faqs: Array<{ q: string; a: string }>): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

/** Article/BlogPosting node for blog posts. */
export function getBlogPostingSchema(opts: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: opts.title,
    description: opts.description,
    url: absUrl(opts.path),
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    image: opts.image ?? business.image,
    author: { '@type': 'Organization', name: business.name, '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: { '@type': 'WebPage', '@id': absUrl(opts.path) },
  };
}
