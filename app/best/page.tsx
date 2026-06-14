import type { Metadata } from 'next';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { ArticleCard } from '@/components/content/ArticleCard';
import { JsonLd } from '@/components/seo/JsonLd';
import { getContentSummaries } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { collectionPageSchema, breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = buildMetadata({
  title: 'Best Senior Safety Products — Roundups & Top Picks',
  description:
    'Our editorial roundups of the best home safety products for seniors — grab bars, shower chairs, medical alert systems, and more, compared side by side.',
  path: '/best',
});

export default function BestHubPage() {
  const items = getContentSummaries('best');
  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Best Picks', href: '/best' },
  ];

  return (
    <>
      <JsonLd
        data={[
          collectionPageSchema(
            'Best Senior Safety Products',
            'Editorial roundups of the best home safety products for aging adults.',
            '/best'
          ),
          breadcrumbSchema(crumbs),
        ]}
      />
      <PageHero
        eyebrow="Best Picks"
        title="Best senior safety products, compared"
        description="We test and compare the products that help aging adults stay safe at home, then name clear winners for different needs and budgets."
        crumbs={crumbs}
      />
      <Container className="py-12">
        {items.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <ArticleCard key={item.href} item={item} showType={false} />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}

function EmptyState() {
  return (
    <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-ink-muted">
      New roundups are publishing soon.
    </p>
  );
}
