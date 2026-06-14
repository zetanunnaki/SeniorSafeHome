import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleLayout } from '@/components/content/ArticleLayout';
import { JsonLd } from '@/components/seo/JsonLd';
import { getContent, getContentSlugs, getRelatedContent } from '@/lib/content';
import { firstProductImage } from '@/lib/products';
import { buildMetadata } from '@/lib/seo';
import { articleSchema, faqSchema, breadcrumbSchema } from '@/lib/schema';

export const dynamicParams = false;

export async function generateStaticParams() {
  return getContentSlugs('guides').map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const doc = getContent('guides', params.slug);
  if (!doc) return {};
  const fm = doc.frontmatter;
  return buildMetadata({
    title: fm.title,
    description: fm.description,
    path: `/guides/${doc.slug}`,
    image: firstProductImage(fm.relatedProductIds) || fm.featuredImage,
    type: 'article',
    publishedTime: fm.datePublished,
    modifiedTime: fm.dateUpdated,
  });
}

export default function GuideDetailPage({ params }: { params: { slug: string } }) {
  const doc = getContent('guides', params.slug);
  if (!doc) notFound();
  const fm = doc.frontmatter;
  const path = `/guides/${doc.slug}`;
  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Guides', href: '/guides' },
    { name: fm.title, href: path },
  ];
  const related = getRelatedContent(doc);

  const schemas: object[] = [articleSchema(fm, path), breadcrumbSchema(crumbs)];
  if (fm.faq && fm.faq.length > 0) schemas.push(faqSchema(fm.faq));

  return (
    <>
      <JsonLd data={schemas} />
      <ArticleLayout doc={doc} crumbs={crumbs} related={related} showDisclosure={false} />
    </>
  );
}
