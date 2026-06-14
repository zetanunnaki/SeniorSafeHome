import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { JsonLd } from '@/components/seo/JsonLd';
import { getAllComparisons } from '@/lib/comparisons';
import { buildMetadata } from '@/lib/seo';
import { collectionPageSchema, breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = buildMetadata({
  title: 'Compare Senior Safety Products Side by Side',
  description:
    'Head-to-head comparisons of senior safety products — shower chair vs. transfer bench, pendant vs. smartwatch alert, and more — with clear, plain-language verdicts.',
  path: '/compare',
});

export default function CompareHubPage() {
  const comparisons = getAllComparisons();
  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Compare', href: '/compare' },
  ];
  return (
    <>
      <JsonLd
        data={[
          collectionPageSchema(
            'Compare Senior Safety Products',
            'Side-by-side comparisons of senior home safety products.',
            '/compare'
          ),
          breadcrumbSchema(crumbs),
        ]}
      />
      <PageHero
        eyebrow="Compare"
        title="Compare senior safety products side by side"
        description="Not sure which product type fits? These head-to-head comparisons settle the most common questions in plain language."
        crumbs={crumbs}
      />
      <Container className="py-12">
        <div className="grid gap-6 sm:grid-cols-2">
          {comparisons.map((c) => (
            <Link
              key={c.slug}
              href={`/compare/${c.slug}`}
              className="group flex flex-col rounded-xl border border-slate-200 bg-white p-6 no-underline transition hover:border-brand-300 hover:shadow-md"
            >
              <h2 className="text-xl font-semibold text-ink group-hover:text-brand-700">{c.title}</h2>
              <p className="mt-2 flex-1 text-ink-soft">{c.description}</p>
              <span className="mt-4 text-sm font-semibold text-brand-700">Compare →</span>
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}
