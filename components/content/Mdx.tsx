import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { getProductById } from '@/lib/products';
import { getGlossaryTerms } from '@/lib/content';
import { headingId } from '@/lib/utils';

import { AffiliateButton } from '@/components/affiliate/AffiliateButton';
import { ProductCard } from '@/components/affiliate/ProductCard';
import { ProductGrid } from '@/components/affiliate/ProductGrid';
import { QuickPicks } from '@/components/affiliate/QuickPicks';
import { ComparisonTable } from '@/components/tables/ComparisonTable';
import { SpecTable } from '@/components/tables/SpecTable';
import { ProsCons } from './ProsCons';
import { Callout } from './Callout';
import { DisclosureBox } from './DisclosureBox';
import { ReviewSummaryBox } from './ReviewSummaryBox';

// --- MDX-friendly wrappers that accept a product `id` string ---

function MdxAffiliateButton({ id, ...rest }: { id: string; label?: string; variant?: 'primary' | 'secondary' }) {
  const product = getProductById(id);
  if (!product) return null;
  return <AffiliateButton product={product} {...rest} />;
}

function MdxProductCard({ id, rank }: { id: string; rank?: number }) {
  const product = getProductById(id);
  if (!product) return null;
  return <ProductCard product={product} rank={rank} />;
}

function MdxReviewSummary({ id, rating, verdict }: { id: string; rating?: number; verdict?: string }) {
  const product = getProductById(id);
  if (!product) return null;
  return <ReviewSummaryBox product={product} rating={rating} verdict={verdict} />;
}

function MdxSpecTable({ id, title }: { id: string; title?: string }) {
  const product = getProductById(id);
  if (!product) return null;
  return <SpecTable product={product} title={title} />;
}

// Heading components add stable ids so the Table of Contents can link to them.
function H2(props: React.HTMLAttributes<HTMLHeadingElement>) {
  const id = typeof props.children === 'string' ? headingId(props.children) : undefined;
  return <h2 id={id} {...props} />;
}
function H3(props: React.HTMLAttributes<HTMLHeadingElement>) {
  const id = typeof props.children === 'string' ? headingId(props.children) : undefined;
  return <h3 id={id} {...props} />;
}

// Internal links use next/link for client-side navigation; external pass through.
function A({ href = '', ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (href.startsWith('/')) return <Link href={href} {...props} />;
  const external = href.startsWith('http');
  return <a href={href} {...(external ? { target: '_blank', rel: 'noopener' } : {})} {...props} />;
}

const components = {
  a: A,
  h2: H2,
  h3: H3,
  AffiliateButton: MdxAffiliateButton,
  ProductCard: MdxProductCard,
  ProductGrid,
  QuickPicks,
  ComparisonTable,
  SpecTable: MdxSpecTable,
  ProsCons,
  Callout,
  DisclosureBox,
  ReviewSummaryBox: MdxReviewSummary,
};

// --- Glossary auto-linking (rehype plugin) ---
// Links the FIRST occurrence of each glossary term in the article to its
// glossary page. Skips headings, existing links, code, and the article's own
// glossary entry. Operates on the rendered HTML tree so it never touches MDX
// component props or code blocks.
const SKIP_TAGS = new Set(['a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code', 'pre', 'button', 'script', 'style']);

function rehypeGlossaryLinks({
  terms,
  excludeSlug,
}: {
  terms: Array<{ match: string; slug: string }>;
  excludeSlug?: string;
}) {
  const linked = new Set<string>(excludeSlug ? [excludeSlug] : []);
  const list = terms
    .filter((t) => t.slug !== excludeSlug)
    .slice()
    .sort((a, b) => b.match.length - a.match.length)
    .map((t) => ({
      slug: t.slug,
      re: new RegExp('\\b' + t.match.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + 's?\\b', 'i'),
    }));

  function linkify(value: string): any[] {
    for (const t of list) {
      if (linked.has(t.slug)) continue;
      const m = t.re.exec(value);
      if (m) {
        linked.add(t.slug);
        const before = value.slice(0, m.index);
        const matched = m[0];
        const after = value.slice(m.index + matched.length);
        const anchor = {
          type: 'element',
          tagName: 'a',
          properties: { href: `/glossary/${t.slug}`, className: ['glossary-link'] },
          children: [{ type: 'text', value: matched }],
        };
        return [...(before ? [{ type: 'text', value: before }] : []), anchor, ...linkify(after)];
      }
    }
    return value ? [{ type: 'text', value }] : [];
  }

  function walk(node: any) {
    if (!node.children || node.children.length === 0) return;
    if (node.tagName && SKIP_TAGS.has(node.tagName)) return;
    const out: any[] = [];
    for (const child of node.children) {
      if (child.type === 'text') out.push(...linkify(child.value));
      else {
        walk(child);
        out.push(child);
      }
    }
    node.children = out;
  }

  return (tree: any) => walk(tree);
}

/** Renders MDX body with our custom component map. Server component.
 *  `excludeGlossarySlug` prevents a glossary page from auto-linking its own term. */
export function Mdx({ source, excludeGlossarySlug }: { source: string; excludeGlossarySlug?: string }) {
  const terms = getGlossaryTerms();
  return (
    <div className="prose-ssh">
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            rehypePlugins: [[rehypeGlossaryLinks as any, { terms, excludeSlug: excludeGlossarySlug }]],
          },
        }}
      />
    </div>
  );
}
