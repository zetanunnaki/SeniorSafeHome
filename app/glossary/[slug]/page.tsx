import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { CategoryPill } from '@/components/ui/CategoryPill';
import { Mdx } from '@/components/content/Mdx';
import { LastUpdated } from '@/components/content/LastUpdated';
import { JsonLd } from '@/components/seo/JsonLd';
import { getContent, getContentSlugs, getAllContent } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/schema';
import { absoluteUrl } from '@/lib/utils';

export const dynamicParams = false;

export async function generateStaticParams() {
  return getContentSlugs('glossary').map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const doc = getContent('glossary', params.slug);
  if (!doc) return {};
  const fm = doc.frontmatter;
  return buildMetadata({
    title: `${fm.term || fm.title} — Senior Safety Glossary`,
    description: fm.description,
    path: `/glossary/${doc.slug}`,
  });
}

export default function GlossaryDetailPage({ params }: { params: { slug: string } }) {
  const doc = getContent('glossary', params.slug);
  if (!doc) notFound();
  const fm = doc.frontmatter;
  const term = fm.term || fm.title;
  const path = `/glossary/${doc.slug}`;
  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Glossary', href: '/glossary' },
    { name: term, href: path },
  ];

  // Related terms from frontmatter, resolved to existing entries.
  const allTerms = getAllContent('glossary');
  const related = (fm.relatedTerms || [])
    .map((slug) => allTerms.find((d) => d.slug === slug))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  const definedTerm = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: term,
    description: fm.description,
    url: absoluteUrl(path),
    inDefinedTermSet: { '@type': 'DefinedTermSet', name: 'Senior Safety Glossary' },
  };

  return (
    <>
      <JsonLd data={[definedTerm, breadcrumbSchema(crumbs)]} />
      <div className="border-b border-slate-200 bg-gradient-to-b from-brand-50/60 to-white">
        <Container className="py-8 sm:py-12">
          <Breadcrumbs crumbs={crumbs} />
          <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-brand-600">
            Glossary term
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{term}</h1>
          <p className="mt-3 max-w-2xl text-lg text-ink-soft">{fm.description}</p>
          <div className="mt-3">
            <LastUpdated datePublished={fm.datePublished} dateUpdated={fm.dateUpdated} />
          </div>
        </Container>
      </div>
      <Container className="py-10">
        <div className="max-w-3xl">
          <Mdx source={doc.body} />

          {related.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-semibold text-ink">Related terms</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {related.map((d) => (
                  <CategoryPill
                    key={d.slug}
                    name={d.frontmatter.term || d.frontmatter.title}
                    href={`/glossary/${d.slug}`}
                  />
                ))}
              </div>
            </div>
          )}

          <p className="mt-12">
            <Link href="/glossary" className="font-semibold text-brand-700">
              ← Back to glossary
            </Link>
          </p>
        </div>
      </Container>
    </>
  );
}
