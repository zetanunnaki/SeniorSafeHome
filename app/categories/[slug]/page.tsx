import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { PageHero } from '@/components/layout/PageHero';
import { ProductGrid } from '@/components/affiliate/ProductGrid';
import { ArticleCard } from '@/components/content/ArticleCard';
import { DisclosureBox } from '@/components/content/DisclosureBox';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  getAllCategories,
  getCategoryBySlug,
  getProductsByCategory,
} from '@/lib/products';
import { getAllContent, toSummary } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { collectionPageSchema, itemListSchema, breadcrumbSchema } from '@/lib/schema';
import type { ContentType } from '@/lib/types';

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllCategories().map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const category = getCategoryBySlug(params.slug);
  if (!category) return {};
  return buildMetadata({
    title: `${category.name} for Seniors — Picks & Buying Guide`,
    description: category.shortDescription,
    path: `/categories/${category.slug}`,
  });
}

export default function CategoryDetailPage({ params }: { params: { slug: string } }) {
  const category = getCategoryBySlug(params.slug);
  if (!category) notFound();

  const products = getProductsByCategory(category.slug);
  const path = `/categories/${category.slug}`;
  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Categories', href: '/categories' },
    { name: category.name, href: path },
  ];

  // Content that references this category, across types.
  const relatedContent = (['best', 'guides', 'reviews', 'gift-guides'] as ContentType[])
    .flatMap((t) => getAllContent(t))
    .filter((d) => d.frontmatter.category === category.slug)
    .slice(0, 6)
    .map(toSummary);

  const schemas: object[] = [
    collectionPageSchema(category.name, category.shortDescription, path),
    breadcrumbSchema(crumbs),
  ];
  if (products.length > 0) schemas.push(itemListSchema(products, path));

  return (
    <>
      <JsonLd data={schemas} />
      <PageHero eyebrow="Category" title={`${category.name} for seniors`} crumbs={crumbs}>
        <p className="mt-4 max-w-2xl text-lg text-ink-soft">{category.intro}</p>
      </PageHero>

      <Container className="py-12">
        <DisclosureBox className="mb-8" />

        {products.length > 0 ? (
          <section>
            <h2 className="text-2xl font-bold text-ink sm:text-3xl">Top {category.name.toLowerCase()} we recommend</h2>
            <div className="mt-6">
              <ProductGrid products={products} columns={3} />
            </div>
          </section>
        ) : (
          <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-ink-muted">
            Product picks for this category are coming soon.
          </p>
        )}

        {relatedContent.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-ink sm:text-3xl">Guides &amp; roundups</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedContent.map((item) => (
                <ArticleCard key={item.href} item={item} />
              ))}
            </div>
          </section>
        )}

        <p className="mt-12">
          <Link href="/categories" className="font-semibold text-brand-700">
            ← All categories
          </Link>
        </p>
      </Container>
    </>
  );
}
