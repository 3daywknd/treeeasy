# Nojodoc: layouts

Path: @/src/layouts

### Overview

- `BaseLayout.astro` owns the entire `<html>`/`<head>` shell for every page and renders the shared Header, `<main>` slot, and Footer.
- `ServiceLayout.astro` is a higher-level composition used by the three service pages, wrapping BaseLayout with hero, breadcrumbs, FAQ, related services, and CTA.

### How it fits into the larger codebase

- Every route in `@/src/pages` renders through `BaseLayout` (directly or via `ServiceLayout`).
- Layouts pull business facts from `@/src/data/business.ts`, schema builders from `@/src/lib/schema.ts`, and components from `@/src/components`.
- `BaseLayout` is where the `schemas` array from pages becomes actual `<script type="application/ld+json">` tags.

### Core Implementation

- **BaseLayout `<head>`** emits: title, meta description, canonical (`new URL(canonicalPath, Astro.site)`), optional `noindex`, complete Open Graph + Twitter tags, theme-color, favicon / apple-touch-icon, and a `<link rel="sitemap">` to `/sitemap-index.xml`. Each item of the `schemas` prop is rendered as its own JSON-LD script.
- BaseLayout props: `title`, `description`, `canonicalPath`, `ogType`, `ogImage` (defaults to `/og-image.jpg`), `schemas`, `noindex`. In DEV it warns when a meta description exceeds 165 chars.
- **ServiceLayout** takes `slug` (union of the three service slugs), `name`, `title`, `description`, `heroLede`, and `faqs`. It builds the trail Home -> Tree Service -> {name} and constructs `[getServiceSchema, getBreadcrumbSchema, getFaqSchema]`, then passes them to BaseLayout. Page body content flows through its `<slot>` inside a `.prose` article.

### Things to Know

- Canonical URLs are built from `canonicalPath`, which callers write with a trailing slash to match the directory-style build output (`build.format: 'directory'`); mismatches would produce non-canonical URLs.
- ServiceLayout hands the same `faqs` array to both the visible `Faq` component and `getFaqSchema`, preserving visible/schema parity.
- BaseLayout is the only place `<head>` metadata and JSON-LD injection happen; pages never write their own `<head>`.

Created and maintained by nojo.
