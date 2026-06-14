import type { Metadata } from 'next';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { ArticleCard } from '@/components/content/ArticleCard';
import { JsonLd } from '@/components/seo/JsonLd';
import { getContentSummaries } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { collectionPageSchema, breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = buildMetadata({
  title: 'Safety Gift Guides for Seniors',
  description:
    'Thoughtful gift ideas for aging parents and seniors living alone — practical gifts that quietly improve safety, comfort, and independence.',
  path: '/gift-guides',
});

export default function GiftGuidesHubPage() {
  const items = getContentSummaries('gift-guides');
  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Gift Guides', href: '/gift-guides' },
  ];
  return (
    <>
      <JsonLd
        data={[
          collectionPageSchema(
            'Safety Gift Guides for Seniors',
            'Gift ideas that improve safety and independence for aging adults.',
            '/gift-guides'
          ),
          breadcrumbSchema(crumbs),
        ]}
      />
      <PageHero
        eyebrow="Gift Guides"
        title="Safety gifts for seniors that actually get used"
        description="Practical, dignified gift ideas for aging parents and seniors living alone — chosen for everyday safety, comfort, and independence."
        crumbs={crumbs}
      />
      <Container className="py-12">
        {items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-ink-muted">
            New gift guides are publishing soon.
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
