/**
 * Navigation + footer link configuration. Single source for header nav and
 * footer columns so links stay consistent across every page.
 */

import { services, servicePath } from '../data/business';

export const primaryNav = [
  { label: 'Tree Service', href: '/tree-service/' },
  ...services.map((s) => ({ label: s.shortName, href: servicePath(s.slug) })),
  { label: 'Emergency', href: '/emergency/' },
  { label: 'Blog', href: '/blog/' },
];

export const footerColumns = [
  {
    heading: 'Services',
    links: [
      { label: 'Tree Service', href: '/tree-service/' },
      ...services.map((s) => ({ label: s.shortName, href: servicePath(s.slug) })),
    ],
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
