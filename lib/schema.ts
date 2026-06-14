import { absoluteUrl, siteUrl } from './utils';
import { productImage, affiliateUrl } from './products';
import siteData from '@/data/site.json';
import type { SiteConfig, Product, FaqItem, ContentFrontmatter } from './types';

const site = siteData as SiteConfig;

// Each helper returns a plain JSON-LD object. Render with <JsonLd data={...} />.

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: siteUrl(),
    description: site.description,
    publisher: { '@type': 'Organization', name: site.name },
  };
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: siteUrl(),
    logo: `${siteUrl()}/images/logo.svg`,
    email: site.email,
    foundingDate: String(site.foundingYear),
    sameAs: site.social?.twitter
      ? [`https://twitter.com/${site.social.twitter.replace('@', '')}`]
      : [],
  };
}

export function breadcrumbSchema(crumbs: Array<{ name: string; href: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.href),
    })),
  };
}

export function faqSchema(faq: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export function articleSchema(fm: ContentFrontmatter, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: fm.title,
    description: fm.description,
    datePublished: fm.datePublished,
    dateModified: fm.dateUpdated || fm.datePublished,
    author: { '@type': 'Organization', name: fm.author || site.publisher },
    publisher: {
      '@type': 'Organization',
      name: site.name,
      logo: { '@type': 'ImageObject', url: `${siteUrl()}/images/logo.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(path) },
    ...(fm.featuredImage ? { image: absoluteUrl(fm.featuredImage) } : {}),
  };
}

export function productSchema(product: Product) {
  const offers =
    typeof product.price === 'number'
      ? {
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: product.priceCurrency || 'USD',
            availability: `https://schema.org/${product.availability || 'InStock'}`,
            url: affiliateUrl(product),
          },
        }
      : {};

  const rating =
    typeof product.rating === 'number'
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewCount || 1,
          },
        }
      : {};

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    brand: { '@type': 'Brand', name: product.brand },
    description: product.shortDescription,
    image: absoluteUrl(productImage(product)),
    sku: product.asin,
    ...offers,
    ...rating,
  };
}

export function reviewSchema(fm: ContentFrontmatter, product: Product, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    name: fm.title,
    datePublished: fm.datePublished,
    dateModified: fm.dateUpdated || fm.datePublished,
    author: { '@type': 'Organization', name: fm.author || site.publisher },
    publisher: { '@type': 'Organization', name: site.name },
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(path) },
    itemReviewed: {
      '@type': 'Product',
      name: product.name,
      brand: { '@type': 'Brand', name: product.brand },
      image: absoluteUrl(productImage(product)),
      sku: product.asin,
    },
    ...(typeof fm.rating === 'number'
      ? {
          reviewRating: {
            '@type': 'Rating',
            ratingValue: fm.rating,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };
}

export function itemListSchema(products: Product[], pageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    url: absoluteUrl(pageUrl),
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: affiliateUrl(p),
    })),
  };
}

export function collectionPageSchema(name: string, description: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url: absoluteUrl(path),
    isPartOf: { '@type': 'WebSite', name: site.name, url: siteUrl() },
  };
}
