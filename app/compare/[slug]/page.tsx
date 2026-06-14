import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ProductCard } from '@/components/affiliate/ProductCard';
import { DisclosureBox } from '@/components/content/DisclosureBox';
import { JsonLd } from '@/components/seo/JsonLd';
import { getAllComparisons, getComparisonBySlug } from '@/lib/comparisons';
import { getProductById } from '@/lib/products';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/schema';

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllComparisons().map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const c = getComparisonBySlug(params.slug);
  if (!c) return {};
  return buildMetadata({ title: c.title, description: c.description, path: `/compare/${c.slug}` });
}

export default function CompareDetailPage({ params }: { params: { slug: string } }) {
  const c = getComparisonBySlug(params.slug);
  if (!c) notFound();

  const productA = getProductById(c.productIds[0]);
  const productB = c.productIds[1] ? getProductById(c.productIds[1]) : undefined;
  const path = `/compare/${c.slug}`;
  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Compare', href: '/compare' },
    { name: c.title, href: path },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs)]} />
      <div className="border-b border-slate-200 bg-gradient-to-b from-brand-50/60 to-white">
        <Container className="py-8 sm:py-12">
          <Breadcrumbs crumbs={crumbs} />
          <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {c.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-soft">{c.description}</p>
        </Container>
      </div>

      <Container className="py-12">
        <div className="max-w-3xl">
          {/* Direct-answer summary for readers and AI answer engines */}
          <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-6">
            <h2 className="!mt-0 text-lg font-semibold text-ink">The short answer</h2>
            <p className="mt-2 text-ink-soft">{c.summary}</p>
          </div>

          <DisclosureBox className="mt-8" />
        </div>

        {/* The two products */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:max-w-4xl">
          {productA && (
            <div>
              <ProductCard product={productA} />
              <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-ink-soft">
                <span className="font-semibold text-ink">{productA.name}: </span>
                {c.verdictA}
              </p>
            </div>
          )}
          {productB && (
            <div>
              <ProductCard product={productB} />
              <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-ink-soft">
                <span className="font-semibold text-ink">{productB.name}: </span>
                {c.verdictB}
              </p>
            </div>
          )}
        </div>

        {/* Head-to-head table */}
        <section className="mt-12 max-w-4xl">
          <h2 className="text-2xl font-bold text-ink sm:text-3xl">Head-to-head comparison</h2>
          <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="p-4 font-semibold text-ink">Factor</th>
                  <th className="p-4 font-semibold text-ink">{productA?.name || 'Option A'}</th>
                  <th className="p-4 font-semibold text-ink">{productB?.name || 'Option B'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {c.points.map((p) => (
                  <tr key={p.label} className="align-top">
                    <th scope="row" className="p-4 font-medium text-ink-soft">
                      {p.label}
                    </th>
                    <td className="p-4 text-ink-soft">{p.a}</td>
                    <td className="p-4 text-ink-soft">{p.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </Container>
    </>
  );
}
