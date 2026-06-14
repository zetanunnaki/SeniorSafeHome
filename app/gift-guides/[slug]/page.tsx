import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleLayout } from '@/components/content/ArticleLayout';
import { JsonLd } from '@/components/seo/JsonLd';
import { getContent, getContentSlugs, getRelatedContent } from '@/lib/content';
import { getProductsByIds } from '@/lib/products';
import { buildMetadata } from '@/lib/seo';
import { articleSchema, itemListSchema, faqSchema, breadcrumbSchema } from '@/lib/schema';

export const dynamicParams = false;

export async function generateStaticParams() {
  return getContentSlugs('gift-guides').map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const doc = getContent('gift-guides', params.slug);
  if (!doc) return {};
  const fm = doc.frontmatter;
  return buildMetadata({
    title: fm.title,
    description: fm.description,
    path: `/gift-guides/${doc.slug}`,
    image: fm.featuredImage,
    type: 'article',
    publishedTime: fm.datePublished,
    modifiedTime: fm.dateUpdated,
  });
}

export default function GiftGuideDetailPage({ params }: { params: { slug: string } }) {
  const doc = getContent('gift-guides', params.slug);
  if (!doc) notFound();
  const fm = doc.frontmatter;
  const path = `/gift-guides/${doc.slug}`;
  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Gift Guides', href: '/gift-guides' },
    { name: fm.title, href: path },
  ];
  const listProducts = getProductsByIds(fm.featuredProductIds || fm.relatedProductIds || []);
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
