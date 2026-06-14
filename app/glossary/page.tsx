import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { JsonLd } from '@/components/seo/JsonLd';
import { getAllContent } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { collectionPageSchema, breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = buildMetadata({
  title: 'Senior Safety Glossary',
  description:
    'Plain-language definitions of senior home safety terms — from "aging in place" to "transfer bench" — to help families make confident decisions.',
  path: '/glossary',
});

export default function GlossaryHubPage() {
  const entries = getAllContent('glossary').sort((a, b) =>
    (a.frontmatter.term || a.frontmatter.title).localeCompare(b.frontmatter.term || b.frontmatter.title)
  );
  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Glossary', href: '/glossary' },
  ];
  return (
    <>
      <JsonLd
        data={[
          collectionPageSchema(
            'Senior Safety Glossary',
            'Plain-language definitions of senior home safety terms.',
            '/glossary'
          ),
          breadcrumbSchema(crumbs),
        ]}
      />
      <PageHero
        eyebrow="Glossary"
        title="Senior safety glossary"
        description="Clear, jargon-free definitions of the terms you'll meet while shopping for senior home safety products."
        crumbs={crumbs}
      />
      <Container className="py-12">
        {entries.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-ink-muted">
            Glossary entries are publishing soon.
          </p>
        ) : (
          <dl className="grid gap-4 sm:grid-cols-2">
            {entries.map((doc) => (
              <div key={doc.slug} className="rounded-xl border border-slate-200 bg-white p-5">
                <dt className="text-lg font-semibold text-ink">
                  <Link href={`/glossary/${doc.slug}`} className="no-underline hover:text-brand-700">
                    {doc.frontmatter.term || doc.frontmatter.title}
                  </Link>
                </dt>
                <dd className="mt-1 text-ink-soft">{doc.frontmatter.description}</dd>
              </div>
            ))}
          </dl>
        )}
      </Container>
    </>
  );
}
