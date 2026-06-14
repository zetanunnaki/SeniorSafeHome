import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleLayout } from '@/components/content/ArticleLayout';
import { JsonLd } from '@/components/seo/JsonLd';
import { getContent, getContentSlugs, getRelatedContent } from '@/lib/content';
import { getProductsByIds, firstProductImage } from '@/lib/products';
import { buildMetadata } from '@/lib/seo';
import { articleSchema, itemListSchema, faqSchema, breadcrumbSchema } from '@/lib/schema';

export const dynamicParams = false;

export async function generateStaticParams() {
  return getContentSlugs('best').map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const doc = getContent('best', params.slug);
  if (!doc) return {};
  const fm = doc.frontmatter;
  return buildMetadata({
    title: fm.title,
    description: fm.description,
    path: `/best/${doc.slug}`,
    image: firstProductImage(fm.featuredProductIds || fm.comparisonProductIds) || fm.featuredImage,
    type: 'article',
    publishedTime: fm.datePublished,
    modifiedTime: fm.dateUpdated,
  });
}

export default function BestDetailPage({ params }: { params: { slug: string } }) {
  const doc = getContent('best', params.slug);
  if (!doc) notFound();
  const fm = doc.frontmatter;
  const path = `/best/${doc.slug}`;
  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Best Picks', href: '/best' },
    { name: fm.title, href: path },
  ];
  const listProducts = getProductsByIds(fm.comparisonProductIds || fm.featuredProductIds || []);
  const related = getRelatedContent(doc);

  const schemas: object[] = [articleSchema(fm, path), breadcrumbSchema(crumbs)];
  if (listProducts.length > 0) schemas.push(itemListSchema(listProducts, path));
  if (fm.faq && fm.faq.length > 0) schemas.push(faqSchema(fm.faq));

  return (
    <>
      <JsonLd data={schemas} />
      <ArticleLayout doc={doc} crumbs={crumbs} related={related} />
    </>
  );
}
