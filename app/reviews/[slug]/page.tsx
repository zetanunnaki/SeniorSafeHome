import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleLayout } from '@/components/content/ArticleLayout';
import { ReviewSummaryBox } from '@/components/content/ReviewSummaryBox';
import { JsonLd } from '@/components/seo/JsonLd';
import { getContent, getContentSlugs, getRelatedContent } from '@/lib/content';
import { getProductById } from '@/lib/products';
import { buildMetadata } from '@/lib/seo';
import { reviewSchema, productSchema, faqSchema, breadcrumbSchema } from '@/lib/schema';

export const dynamicParams = false;

export async function generateStaticParams() {
  return getContentSlugs('reviews').map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const doc = getContent('reviews', params.slug);
  if (!doc) return {};
  const fm = doc.frontmatter;
  return buildMetadata({
    title: fm.title,
    description: fm.description,
    path: `/reviews/${doc.slug}`,
    image: fm.featuredImage,
    type: 'article',
    publishedTime: fm.datePublished,
    modifiedTime: fm.dateUpdated,
  });
}

export default function ReviewDetailPage({ params }: { params: { slug: string } }) {
  const doc = getContent('reviews', params.slug);
  if (!doc) notFound();
  const fm = doc.frontmatter;
  const path = `/reviews/${doc.slug}`;
  const product = fm.productId ? getProductById(fm.productId) : undefined;
  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Reviews', href: '/reviews' },
    { name: fm.title, href: path },
  ];
  const related = getRelatedContent(doc);

  const schemas: object[] = [breadcrumbSchema(crumbs)];
  if (product) {
    schemas.push(reviewSchema(fm, product, path), productSchema(product));
  }
  if (fm.faq && fm.faq.length > 0) schemas.push(faqSchema(fm.faq));

  return (
    <>
      <JsonLd data={schemas} />
      <ArticleLayout
        doc={doc}
        crumbs={crumbs}
        related={related}
        topContent={
          product ? (
            <ReviewSummaryBox product={product} rating={fm.rating} verdict={fm.verdict} />
          ) : undefined
        }
      />
    </>
  );
}
