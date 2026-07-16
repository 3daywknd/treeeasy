// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const SITE = 'https://treeeasyogden.com';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  // No `base`: the site is served from the apex domain root, not a repo subpath.
  trailingSlash: 'ignore',
  build: {
    // Directory-style output: /services/tree-removal/ -> .../index.html
    format: 'directory',
  },
  integrations: [
    sitemap({
      changefreq: 'monthly',
      priority: 0.7,
      serialize(item) {
        if (item.url === `${SITE}/`) {
          return { ...item, priority: 1.0 };
        }
        if (
          item.url.includes('/services/') ||
          item.url.includes('/tree-service') ||
          item.url.includes('/emergency')
        ) {
          return { ...item, priority: 0.8 };
        }
        if (item.url.includes('/blog')) {
          return { ...item, priority: 0.5 };
        }
        return item;
      },
    }),
  ],
});
