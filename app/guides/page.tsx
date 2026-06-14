import type { Metadata } from 'next';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { ArticleCard } from '@/components/content/ArticleCard';
import { JsonLd } from '@/components/seo/JsonLd';
import { getContentSummaries } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { collectionPageSchema, breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = buildMetadata({
  title: 'Senior Home Safety Guides',
  description:
    'Practical, reassuring safety guides for aging adults and caregivers — fall prevention, bathroom safety, bedroom safety, and choosing the right products.',
  path: '/guides',
});

export default function GuidesHubPage() {
  const items = getContentSummaries('guides');
  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Guides', href: '/guides' },
  ];
  return (
    <>
      <JsonLd
        data={[
          collectionPageSchema(
            'Senior Home Safety Guides',
            'Educational safety guides for aging adults and caregivers.',
            '/guides'
          ),
          breadcrumbSchema(crumbs),
        ]}
      />
      <PageHero
        eyebrow="Guides"
        title="Practical senior home safety guides"
        description="Step-by-step, non-alarmist guidance you can act on today — from preventing falls to setting up a safer bathroom."
        crumbs={crumbs}
      />
      <Container className="py-12">
        {items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-ink-muted">
            New guides are publishing soon.
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
