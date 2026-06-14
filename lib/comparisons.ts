import comparisonsData from '@/data/comparisons.json';

export interface ComparisonPoint {
  label: string;
  a: string;
  b: string;
}

export interface Comparison {
  slug: string;
  title: string;
  description: string;
  category?: string;
  productIds: string[];
  summary: string;
  verdictA: string;
  verdictB: string;
  points: ComparisonPoint[];
}

export function getAllComparisons(): Comparison[] {
  return comparisonsData as Comparison[];
}

export function getComparisonBySlug(slug: string): Comparison | undefined {
  return getAllComparisons().find((c) => c.slug === slug);
}
