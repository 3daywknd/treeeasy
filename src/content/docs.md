# Nojodoc: content

Path: @/src/content

### Overview

- Holds the `blog` content collection: markdown posts with tree-care advice for Ogden / Weber County homeowners.
- Each markdown file becomes one blog route.

### How it fits into the larger codebase

- The collection is defined in `@/src/content.config.ts` (repo `src/`), which uses a `glob` loader over `src/content/blog/*.md` and a Zod schema.
- Posts are read by `@/src/pages/blog/index.astro` (list) and `@/src/pages/blog/[...slug].astro` (render), which build `BlogPosting` + `Breadcrumb` schema from frontmatter.
- Frontmatter dates feed the schema's `datePublished` / `dateModified` and the human-readable date shown on the page.

### Core Implementation

- Frontmatter schema: `title` (string), `description` (string), `pubDate` (coerced date), optional `updatedDate` (coerced date).
- The post's URL slug is its file id (`post.id`); routes are generated via `getStaticPaths` in `blog/[...slug].astro`.
- Body markdown is rendered through Astro's `render(post)` into the page's `.prose` article.

### Things to Know

- `description` is required and is reused as the meta description and `BlogPosting.description`; keeping it within meta-length limits matters for SERPs.
- Adding a post is purely additive — drop a conforming `.md` file in `blog/` and it appears in the index (sorted by `pubDate` descending) and gets its own route automatically.
- The collection schema lives in `@/src/content.config.ts`, not in this folder; changing frontmatter shape requires editing that file.

Created and maintained by nojo.
