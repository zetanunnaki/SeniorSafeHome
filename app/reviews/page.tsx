import type { Metadata } from 'next';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { ArticleCard } from '@/components/content/ArticleCard';
import { JsonLd } from '@/components/seo/JsonLd';
import { getContentSummaries } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { collectionPageSchema, breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = buildMetadata({
  title: 'Senior Safety Product Reviews',
  description:
    'Hands-on reviews of home safety products for seniors, with honest pros, cons, specifications, and clear verdicts on who each product is right for.',
  path: '/reviews',
});

export default function ReviewsHubPage() {
  const items = getContentSummaries('reviews');
  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Reviews', href: '/reviews' },
  ];
  return (
    <>
      <JsonLd
        data={[
          collectionPageSchema(
            'Senior Safety Product Reviews',
            'In-depth reviews of home safety products for aging adults.',
            '/reviews'
          ),
          breadcrumbSchema(crumbs),
        ]}
      />
      <PageHero
        eyebrow="Reviews"
        title="In-depth senior safety product reviews"
        description="Honest, hands-on assessments with pros, cons, specs, and a clear verdict — so you know exactly who each product is right for."
        crumbs={crumbs}
      />
      <Container className="py-12">
        {items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-ink-muted">
            New reviews are publishing soon.
          </p>
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
