import { Container } from '@/components/ui/Container';
import { Breadcrumbs, type Crumb } from '@/components/ui/Breadcrumbs';

/** Standard intro header for hub and landing pages. */
export function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs?: Crumb[];
  children?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden border-b border-ink/10 bg-cream">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, #99f6e4 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      <Container className="relative py-12 sm:py-16">
        {crumbs && crumbs.length > 0 && (
          <div className="mb-5">
            <Breadcrumbs crumbs={crumbs} />
          </div>
        )}
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.25rem]">
          {title}
        </h1>
        {description && <p className="mt-4 max-w-2xl text-lg text-ink-soft">{description}</p>}
        {children}
      </Container>
    </div>
  );
}
