// Post-build SEO verification over dist/. No external dependencies.
// Checks: JSON-LD validity, Service.provider @id linkage, FAQ visible/schema
// parity is page-authored, meta description length, canonical presence,
// and internal-link integrity.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const SITE = 'https://treeeasyogden.com';
const ORG_ID = `${SITE}/#organization`;

// Canonical phone, read from the single source of truth so this check tracks it.
const businessTs = readFileSync('src/data/business.ts', 'utf8');
const PHONE = (businessTs.match(/phoneDisplay:\s*'([^']+)'/) || [])[1];
const PHONE_RE = /\(\d{3}\)\s?\d{3}-\d{4}/g;

function decode(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&rsquo;|&#8217;/g, "'")
    .replace(/&mdash;/g, '—')
    .replace(/&quot;/g, '"');
}

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (name.endsWith('.html')) out.push(p);
  }
  return out;
}

const htmlFiles = walk(DIST);
let errors = 0;
let warnings = 0;
const err = (m) => { console.log(`  ✘ ${m}`); errors++; };
const warn = (m) => { console.log(`  ⚠ ${m}`); warnings++; };

// Build a set of routable paths that exist in dist (directory-style URLs).
const routes = new Set(['/']);
for (const f of htmlFiles) {
  let route = '/' + f.slice(DIST.length + 1).replace(/index\.html$/, '').replace(/\\/g, '/');
  if (!route.endsWith('/')) route += '/';
  routes.add(route);
}

console.log(`\nVerifying ${htmlFiles.length} pages in ${DIST}/\n`);

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const page = '/' + file.slice(DIST.length + 1);
  console.log(page);

  // Visible text (scripts/styles stripped) for content-vs-schema parity checks.
  const visibleText = decode(
    html
      .replace(/<script[\s\S]*?<\/script>/g, ' ')
      .replace(/<style[\s\S]*?<\/style>/g, ' ')
      .replace(/<[^>]+>/g, ' ')
  ).replace(/\s+/g, ' ');

  // --- canonical ---
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/);
  if (!canonical) err('missing canonical');

  // --- meta description length ---
  const desc = html.match(/<meta name="description" content="([^"]*)"/);
  if (!desc) err('missing meta description');
  else {
    const len = desc[1].length;
    if (len > 165) warn(`meta description ${len} chars (>165, will truncate)`);
    else if (len < 70) warn(`meta description ${len} chars (<70, thin)`);
  }

  // --- exactly one <h1> ---
  const h1s = (html.match(/<h1[ >]/g) || []).length;
  if (h1s !== 1) err(`expected 1 <h1>, found ${h1s}`);

  // --- JSON-LD blocks parse + linkage ---
  const ldRe = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let m;
  let ldCount = 0;
  while ((m = ldRe.exec(html))) {
    ldCount++;
    let obj;
    try {
      obj = JSON.parse(m[1]);
    } catch (e) {
      err(`JSON-LD block ${ldCount} failed to parse: ${e.message}`);
      continue;
    }
    if (obj['@type'] === 'Service') {
      const pid = obj.provider && obj.provider['@id'];
      if (pid !== ORG_ID) err(`Service.provider.@id = ${pid} (expected ${ORG_ID})`);
    }
    if (obj['@type'] === 'FAQPage') {
      if (!Array.isArray(obj.mainEntity) || obj.mainEntity.length === 0) {
        err('FAQPage has no mainEntity');
      } else {
        // Parity: every schema question must be visible on the page (Google requires
        // FAQ schema to match rendered content). Guards against hand-built divergence.
        for (const q of obj.mainEntity) {
          const name = q?.name;
          if (name && !visibleText.includes(name))
            err(`FAQ schema question not visible on page: "${name.slice(0, 60)}…"`);
        }
      }
    }
  }
  if (ldCount === 0) warn('no JSON-LD on page');

  // --- internal link integrity ---
  const hrefs = [...html.matchAll(/href="(\/[^"#?]*)/g)].map((x) => x[1]);
  for (const href of hrefs) {
    if (href.startsWith('/_astro/') || href.startsWith('/sitemap')) continue;
    if (/\.(png|jpg|jpeg|webp|svg|xml|txt|ico|css|js)$/.test(href)) {
      if (!existsSync(join(DIST, href))) err(`broken asset link: ${href}`);
      continue;
    }
    let target = href.endsWith('/') ? href : href + '/';
    if (!routes.has(target)) err(`broken internal link: ${href}`);
  }
}

// --- phone-number drift in blog markdown ---
// .astro files pull the phone from business.ts; markdown strings can't, so guard
// against a stale hardcoded number diverging from the single source of truth.
if (PHONE) {
  const blogDir = 'src/content/blog';
  if (existsSync(blogDir)) {
    console.log('\nchecking markdown for phone drift');
    for (const f of readdirSync(blogDir).filter((n) => n.endsWith('.md'))) {
      const md = readFileSync(join(blogDir, f), 'utf8');
      for (const found of md.match(PHONE_RE) || []) {
        if (found.replace(/\s/g, '') !== PHONE.replace(/\s/g, ''))
          err(`${f}: phone "${found}" != business.ts "${PHONE}"`);
      }
    }
  }
} else {
  warn('could not read phoneDisplay from business.ts');
}

console.log(`\n${errors === 0 ? '✓' : '✘'} ${errors} error(s), ${warnings} warning(s)\n`);
process.exit(errors === 0 ? 0 : 1);
