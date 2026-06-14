# SeniorSafeHome.com

A fast, file-based Amazon affiliate content site about **home safety products for aging adults**. Built with **Next.js 14 (App Router), TypeScript, Tailwind CSS, and MDX**, with a single JSON product catalog and **no database**. Statically exported for **GitHub Pages**.

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000  (runs product enrichment first)
```

Build a static export:

```bash
npm run build    # outputs ./out  (prebuild runs enrichment, postbuild adds .nojekyll/CNAME)
```

## How it works

- **Content** lives in `/content/{best,reviews,guides,gift-guides,glossary}` as MDX with frontmatter.
- **Products** are the single source of truth in `/data/products.json` (identity, affiliate URL, ASIN, editorial copy).
- A build-time script, `scripts/enrich.mjs`, reads the catalog and — **only if Amazon PA-API credentials are present** — fetches images/price/availability, writing `/data/products.enriched.json`. Without credentials it falls back to editorial images and the build still succeeds. **No Amazon calls happen at runtime.**
- Pages are statically generated via `generateStaticParams`. Every page emits SEO metadata and JSON-LD.

### Project layout

```
app/            Routes (hubs, dynamic [slug] templates, trust pages, sitemap, robots)
components/     affiliate · content · layout · seo · tables · ui
content/        MDX articles by type
data/           products.json, categories.json, topics.json, comparisons.json, site.json
lib/            content, products, seo, schema, comparisons, utils, types
scripts/        enrich.mjs (Amazon), postbuild.mjs, gen-placeholders.mjs
.github/        Pages deploy workflow
```

## Adding content

**A new product:** add an object to `data/products.json` (see existing entries for the shape). Optionally drop a fallback image in `public/images/products/`.

**A new article:** create an MDX file in the matching `content/<type>/` folder with frontmatter, and reference product IDs in components like `<ProductGrid ids={[...]} />`, `<ComparisonTable ids={[...]} />`, `<AffiliateButton id="..." />`. See any existing article for a template. No code changes needed.

## Deployment (GitHub Pages)

The workflow in `.github/workflows/deploy.yml` builds and deploys on push to `main`.

Configure these in **repo Settings → Secrets and variables → Actions**:

| Type | Name | Purpose |
| --- | --- | --- |
| Variable | `SITE_URL` | Canonical site URL (e.g. `https://seniorsafehome.com`) |
| Variable | `CUSTOM_DOMAIN` | Apex domain → writes `CNAME` (leave unset for project sites) |
| Variable | `BASE_PATH` | `/RepoName` for project sites; empty for custom domains |
| Variable | `AMAZON_TAG` | Associates tag (default `seniorsafehome-20`) |
| Secret | `AMAZON_ACCESS_KEY` / `AMAZON_SECRET_KEY` / `AMAZON_PARTNER_TAG` | Optional PA-API enrichment |

Then set **Settings → Pages → Source** to **GitHub Actions**.

- **Custom apex domain:** set `CUSTOM_DOMAIN`, leave `BASE_PATH` empty.
- **Project subpath** (`user.github.io/RepoName`): set `BASE_PATH=/RepoName`.

## Compliance notes

- Affiliate links use `rel="sponsored nofollow noopener"` and open in a new tab.
- Disclosure appears globally (footer) and near the first CTA on money pages.
- CTAs use evergreen language ("Check Price on Amazon"); prices are treated as approximate, manually maintained data.
- Trust pages (About, Editorial Policy, Affiliate Disclosure, Privacy, Terms, Contact) ship at launch.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Local dev server (enriches first) |
| `npm run build` | Static export to `out/` |
| `npm run enrich` | Regenerate `data/products.enriched.json` |
| `npm run gen:placeholders` *(node scripts/gen-placeholders.mjs)* | Regenerate placeholder images |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |
