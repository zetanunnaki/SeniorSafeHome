import { Container } from '@/components/ui/Container';
import { Breadcrumbs, type Crumb } from '@/components/ui/Breadcrumbs';
import { CategoryPill } from '@/components/ui/CategoryPill';
import { LastUpdated } from './LastUpdated';
import { AuthorBox } from './AuthorBox';
import { TableOfContents } from './TableOfContents';
import { FAQAccordion } from './FAQAccordion';
import { RelatedArticles } from './RelatedArticles';
import { DisclosureBox } from './DisclosureBox';
import { Mdx } from './Mdx';
import { extractHeadings } from '@/lib/utils';
import { getCategoryBySlug } from '@/lib/products';
import type { ContentDoc, ContentSummary } from '@/lib/types';

/**
 * Shared chrome for every long-form content page (best, reviews, guides,
 * gift-guides). Renders header, sticky TOC, MDX body, FAQ, author box and
 * related links. `topContent` is type-specific (e.g. a ReviewSummaryBox).
 */
export function ArticleLayout({
  doc,
  crumbs,
  related,
  topContent,
  showDisclosure = true,
}: {
  doc: ContentDoc;
  crumbs: Crumb[];
  related: ContentSummary[];
  topContent?: React.ReactNode;
  showDisclosure?: boolean;
}) {
  const fm = doc.frontmatter;
  const headings = extractHeadings(doc.body);
  const category = fm.category ? getCategoryBySlug(fm.category) : undefined;

  return (
    <article>
      {/* Header */}
      <div className="border-b border-slate-200 bg-gradient-to-b from-brand-50/60 to-white">
        <Container className="py-8 sm:py-12">
          <Breadcrumbs crumbs={crumbs} />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {category && <CategoryPill name={category.name} href={`/categories/${category.slug}`} />}
            <LastUpdated datePublished={fm.datePublished} dateUpdated={fm.dateUpdated} />
          </div>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            {fm.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-soft">{fm.description}</p>
          <p className="mt-3 text-sm text-ink-muted">By {fm.author || 'SeniorSaferHome Editorial Team'}</p>
        </Container>
      </div>

      <Container className="py-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,3fr)]">
          {/* Sidebar TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <TableOfContents items={headings} />
            </div>
          </aside>

          {/* Body */}
          <div className="max-w-3xl">
            {showDisclosure && <DisclosureBox className="mb-8" />}
            {topContent && <div className="mb-10">{topContent}</div>}

            <Mdx source={doc.body} />

            {fm.faq && fm.faq.length > 0 && (
              <div className="mt-14">
                <FAQAccordion faq={fm.faq} />
              </div>
            )}

            <div className="mt-14">
              <AuthorBox author={fm.author} />
            </div>

            {related.length > 0 && (
              <div className="mt-14">
                <RelatedArticles items={related} />
              </div>
            )}
          </div>
        </div>
      </Container>
    </article>
  );
}
