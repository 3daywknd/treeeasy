/**
 * Navigation + footer link configuration. Single source for header nav and
 * footer columns so links stay consistent across every page.
 */

import { services, servicePath } from '../data/business';

const serviceLinks = services.map((s) => ({ label: s.shortName, href: servicePath(s.slug) }));
const otherLinks = [
  { label: 'Emergency', href: '/emergency/' },
  { label: 'Blog', href: '/blog/' },
];

/** Flat list for the mobile menu. */
export const primaryNav = [
  { label: 'Tree Service', href: '/tree-service/' },
  ...serviceLinks,
  ...otherLinks,
];

/** Desktop nav: the pillar page and service pages grouped under one dropdown, then the rest. */
export const desktopNav = {
  services: {
    label: 'Services',
    links: [{ label: 'All Tree Services', href: '/tree-service/' }, ...serviceLinks],
  },
  links: otherLinks,
};

export const footerColumns = [
  {
    heading: 'Services',
    links: [{ label: 'Tree Service', href: '/tree-service/' }, ...serviceLinks],
  },
  {
    heading: 'Company',
    links: [
      { label: 'Emergency Tree Care', href: '/emergency/' },
      { label: 'Blog', href: '/blog/' },
      { label: 'Serving Weber County', href: '/#area' },
    ],
  },
];
