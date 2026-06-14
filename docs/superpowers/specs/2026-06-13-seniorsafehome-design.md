# SeniorSafeHome.com — Design / Spec

Date: 2026-06-13
Status: Approved for autopilot build (full vertical slice)

## Goal

A no-database, file-based Amazon affiliate content site about home safety
products for aging adults. Next.js 14 App Router + TypeScript + Tailwind + MDX +
local JSON catalog, statically exported for GitHub Pages.

## Build scope (this pass)

Full vertical slice that proves the entire system end-to-end:

- 100% of project scaffold, configs, static-export setup
- 100% of routes/templates (all hubs + dynamic templates + trust pages)
- 100% of reusable components
- 3–5 fully-written exemplar MDX articles (one per content type)
- Enrichment script (graceful stub — works with or without Amazon PA-API creds)
- GitHub Actions deploy workflow + sitemap/robots

Remaining ~15 seed articles are added in a follow-up content pass; the templates
already render them once the MDX files exist.

## Architecture decisions

- **MDX rendering:** `next-mdx-remote/rsc` compiled at build time inside server
  components; `gray-matter` for frontmatter. All dynamic routes use
  `generateStaticParams`. Fully static-export compatible.
- **Data flow:** `data/products.json` (hand-maintained source of truth) →
  `scripts/enrich.mjs` (build-time, reads optional PA-API secrets) →
  `data/products.enriched.json` (generated artifact the site reads). If
  enrichment fails or no creds, fall back to `editorialImageFallback` and base
  fields; build still succeeds.
- **Product loading:** `lib/products.ts` prefers `products.enriched.json`,
  falls back to `products.json`. No runtime fetching ever.
- **Deployment:** `output: 'export'`, `images.unoptimized: true`. `basePath` /
  `assetPrefix` driven by `NEXT_PUBLIC_BASE_PATH` env (empty for custom apex
  domain, `/repo` for subpath). `.nojekyll` + optional `CNAME` emitted.
- **SEO:** `lib/seo.ts` builds per-page Metadata (title, description, canonical,
  OG, Twitter). `lib/schema.ts` builds JSON-LD (WebSite, Organization,
  BreadcrumbList, Article, Review, Product, ItemList, FAQPage) injected per page
  type.

## Routes

`/`, `/best` + `[slug]`, `/reviews` + `[slug]`, `/guides` + `[slug]`,
`/categories` + `[slug]`, `/compare` + `[slug]`, `/gift-guides` + `[slug]`,
`/topics`, `/glossary` + `[slug]`, `/about`, `/editorial-policy`,
`/affiliate-disclosure`, `/privacy-policy`, `/contact`, `/terms`,
`sitemap.xml`, `robots.txt`.

## Components

affiliate: AffiliateButton, ProductCard, ProductGrid, QuickPicks
content: ProsCons, ReviewSummaryBox, Callout, FAQAccordion, DisclosureBox,
  TableOfContents, RelatedArticles, AuthorBox, LastUpdated
tables: ComparisonTable, SpecTable
ui: RatingStars, CategoryPill, Breadcrumbs, Badge
layout: Header, Footer, Container

## Design language

Soft blue / slate / white / muted green. Large readable type (base 18px),
strong contrast, visible focus states, accessible accordions/tables, generous
tap targets. Calm, trustworthy, non-alarmist.

## Defaults chosen (autopilot)

- Amazon Associates tag placeholder: `seniorsafehome-20`; placeholder ASINs.
- Pricing kept as cautious manual fields; CTAs use evergreen "Check Price on
  Amazon" language, not hardcoded prices.
- Deploy config defaults to custom apex domain; subpath supported via env.

## Acceptance

`npm install` → `npm run dev` works; `npm run build` yields a static `out/`
suitable for GitHub Pages; all route types render; content from MDX+JSON only;
no DB; metadata + JSON-LD per page type; disclosures global + on money pages.
