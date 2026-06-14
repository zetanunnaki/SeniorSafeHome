import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { JsonLd } from '@/components/seo/JsonLd';
import { getAllCategories, getProductsByCategory } from '@/lib/products';
import { buildMetadata } from '@/lib/seo';
import { collectionPageSchema, breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = buildMetadata({
  title: 'Senior Safety Product Categories',
  description:
    'Explore every senior home safety product category — grab bars, shower chairs, medical alert systems, bed rails, and more — with vetted picks and guides.',
  path: '/categories',
});

export default function CategoriesHubPage() {
  const categories = getAllCategories();
  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Categories', href: '/categories' },
  ];
  return (
    <>
      <JsonLd
        data={[
          collectionPageSchema(
            'Senior Safety Product Categories',
            'All home safety product categories for aging adults.',
            '/categories'
          ),
          breadcrumbSchema(crumbs),
        ]}
      />
      <PageHero
        eyebrow="Categories"
        title="Senior safety product categories"
        description="Start with the area you're solving for. Each category pairs vetted product picks with the guides that help you choose."
        crumbs={crumbs}
      />
      <Container className="py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => {
            const count = getProductsByCategory(c.slug).length;
            return (
              <Link
                key={c.slug}
                href={`/categories/${c.slug}`}
                className="group flex flex-col rounded-xl border border-slate-200 bg-white p-6 no-underline transition hover:border-brand-300 hover:shadow-md"
              >
                <h2 className="text-xl font-semibold text-ink group-hover:text-brand-700">{c.name}</h2>
                <p className="mt-2 flex-1 text-ink-soft">{c.shortDescription}</p>
                <span className="mt-4 text-sm font-medium text-ink-muted">
                  {count} {count === 1 ? 'product' : 'products'} reviewed →
                </span>
              </Link>
            );
          })}
        </div>
      </Container>
    </>
  );
}
