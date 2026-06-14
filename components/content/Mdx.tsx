import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { getProductById } from '@/lib/products';
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

/** Renders MDX body with our custom component map. Server component. */
export function Mdx({ source }: { source: string }) {
  return (
    <div className="prose-ssh">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
