import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { CategoryPill } from '@/components/ui/CategoryPill';
import { JsonLd } from '@/components/seo/JsonLd';
import { getAllTopics, getCategoryBySlug } from '@/lib/products';
import { buildMetadata } from '@/lib/seo';
import { collectionPageSchema, breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = buildMetadata({
  title: 'Senior Safety Topics',
  description:
    'Browse senior home safety by topic — bathroom safety, fall prevention, medical alerts, medication, and more — to find the products and guides you need.',
  path: '/topics',
});

export default function TopicsHubPage() {
  const topics = getAllTopics();
  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Topics', href: '/topics' },
  ];
  return (
    <>
      <JsonLd
        data={[
          collectionPageSchema(
            'Senior Safety Topics',
            'Topical clusters covering senior home safety.',
            '/topics'
          ),
          breadcrumbSchema(crumbs),
        ]}
      />
      <PageHero
        eyebrow="Topics"
        title="Explore senior safety by topic"
        description="Each topic groups the categories, guides, and reviews that work together — so you can solve a whole problem, not just buy one product."
        crumbs={crumbs}
      />
      <Container className="py-12">
        <div className="grid gap-6 lg:grid-cols-2">
          {topics.map((t) => (
            <section key={t.slug} className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="text-2xl font-semibold text-ink">{t.name}</h2>
              <p className="mt-2 text-ink-soft">{t.description}</p>
              {t.categories.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {t.categories.map((slug) => {
                    const cat = getCategoryBySlug(slug);
                    if (!cat) return null;
                    return <CategoryPill key={slug} name={cat.name} href={`/categories/${slug}`} />;
                  })}
                </div>
              )}
            </section>
          ))}
        </div>

        <p className="mt-10 text-ink-soft">
          Looking for something specific? Browse all{' '}
          <Link href="/categories" className="font-semibold">
            product categories
          </Link>{' '}
          or read our{' '}
          <Link href="/guides" className="font-semibold">
            safety guides
          </Link>
          .
        </p>
      </Container>
    </>
  );
}
