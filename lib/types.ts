// Shared types for the file-based content + product system.

export type ContentType = 'best' | 'reviews' | 'guides' | 'gift-guides' | 'glossary';

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subCategory?: string;
  amazonUrl: string;
  asin: string;
  editorialImageFallback: string;
  shortDescription: string;
  badge?: string | null;
  features?: string[];
  pros?: string[];
  cons?: string[];
  bestFor?: string[];
  notIdealFor?: string[];
  specs?: Record<string, string>;
  reviewSlug?: string | null;
  lastManualReview?: string;

  // Enriched (build-time) fields — may be absent if enrichment was skipped.
  image?: string;
  price?: number;
  priceCurrency?: string;
  availability?: string;
  rating?: number;
  reviewCount?: number;
  lastVerified?: string;
  imageSource?: 'amazon-api' | 'editorial-fallback';
}

export interface Category {
  slug: string;
  name: string;
  cluster: string;
  shortDescription: string;
  intro: string;
  icon?: string;
}

export interface Topic {
  slug: string;
  name: string;
  description: string;
  categories: string[];
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  domain: string;
  url: string;
  tagline: string;
  description: string;
  amazonTag: string;
  logoText: string;
  email: string;
  publisher: string;
  foundingYear: number;
  social: { twitter?: string };
  disclosure: string;
  disclosureShort: string;
  nav: NavLink[];
  footerLinks: Record<string, NavLink[]>;
}

// Frontmatter shared by all content types (some fields optional per type).
export interface ContentFrontmatter {
  title: string;
  slug: string;
  description: string;
  datePublished: string;
  dateUpdated?: string;
  author?: string;
  category?: string;
  subCategory?: string;
  type?: string;
  tags?: string[];
  featuredImage?: string;

  // best / roundup
  featuredProductIds?: string[];
  comparisonProductIds?: string[];

  // reviews
  productId?: string;
  rating?: number;
  verdict?: string;
  pros?: string[];
  cons?: string[];

  // guides
  relatedProductIds?: string[];

  // glossary
  term?: string;
  relatedTerms?: string[];

  faq?: FaqItem[];
}

export interface ContentDoc {
  type: ContentType;
  slug: string;
  frontmatter: ContentFrontmatter;
  body: string;
}

export interface ContentSummary {
  type: ContentType;
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  dateUpdated?: string;
  category?: string;
  tags?: string[];
  featuredImage?: string;
  href: string;
}
