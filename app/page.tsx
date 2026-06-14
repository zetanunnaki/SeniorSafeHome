import Link from 'next/link';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { ArticleCard } from '@/components/content/ArticleCard';
import { DisclosureBox } from '@/components/content/DisclosureBox';
import { NewsletterForm } from '@/components/ui/NewsletterForm';
import { getAllProducts, getAllCategories, getAllTopics } from '@/lib/products';
import { getContentSummaries, getLatestContent, getAllContent } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import siteData from '@/data/site.json';
import type { SiteConfig } from '@/lib/types';

const site = siteData as SiteConfig;

export const metadata: Metadata = buildMetadata({
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  path: '/',
});

export default function HomePage() {
  const categories = getAllCategories();
  const topics = getAllTopics().filter((t) => t.slug !== 'gifts').slice(0, 6);
  const best = getContentSummaries('best').slice(0, 3);
  const reviews = getContentSummaries('reviews').slice(0, 3);
  const guides = getContentSummaries('guides').slice(0, 3);
  const latest = getLatestContent(['best', 'reviews', 'guides', 'gift-guides'], 6);

  const productCount = getAllProducts().length;
  const articleCount = (['best', 'reviews', 'guides', 'gift-guides', 'glossary'] as const).reduce(
    (n, t) => n + getAllContent(t).length,
    0
  );

  const stats = [
    { value: `${productCount}`, label: 'Products reviewed' },
    { value: `${categories.length}`, label: 'Safety categories' },
    { value: '100%', label: 'Independent picks' },
    { value: '$0', label: 'Extra cost to you' },
  ];

  return (
    <>
      {/* ───────────────────── Hero (dark) ───────────────────── */}
      <section className="relative -mt-[72px] overflow-hidden bg-night-texture pt-[72px] text-white">
        {/* soft teal glow */}
        <div
          className="pointer-events-none absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full opacity-30 blur-3xl"
          style={{ background: 'radial-gradient(circle, #0d9488 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-48 -left-32 h-[32rem] w-[32rem] rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #14b8a6 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        <Container className="relative py-20 sm:py-28 lg:py-32">
          <div className="max-w-3xl">
            <p className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/85">
              <span aria-hidden="true">🛡️</span> Trusted home-safety guidance for aging adults
            </p>
            <h1
              className="animate-fade-up mt-6 font-display text-[2.75rem] font-extrabold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl"
              style={{ animationDelay: '0.08s' }}
            >
              Stay safe.
              <br />
              Stay <span className="accent-light">independent.</span>
            </h1>
            <p
              className="animate-fade-up mt-6 max-w-xl text-lg text-white/80 sm:text-xl"
              style={{ animationDelay: '0.16s' }}
            >
              Independent reviews and clear, reassuring guides on the home-safety products that help
              seniors live well at home — written for the families and caregivers who care for them.
            </p>
            <div
              className="animate-fade-up mt-9 flex flex-col gap-3 sm:flex-row"
              style={{ animationDelay: '0.24s' }}
            >
              <Link href="/best" className="btn-primary no-underline">
                Browse Best Picks
              </Link>
              <Link href="/guides" className="btn-on-dark no-underline">
                Read Safety Guides
              </Link>
            </div>
          </div>

          {/* Stats strip */}
          <dl className="animate-fade-up mt-16 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-6 border-t border-white/12 pt-8 sm:grid-cols-4" style={{ animationDelay: '0.32s' }}>
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-3xl font-bold text-white sm:text-4xl">{s.value}</dd>
                <p className="mt-1 text-sm text-white/60">{s.label}</p>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* ───────────────────── Trust row ───────────────────── */}
      <section className="border-b border-ink/10 bg-white">
        <Container className="grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
          <TrustItem icon="🔎" title="Independently researched">
            Picked on safety and value — never commissions.
          </TrustItem>
          <TrustItem icon="🧓" title="Built for older readers">
            Large type, plain language, accessible design.
          </TrustItem>
          <TrustItem icon="🩺" title="Careful, non-alarmist">
            Cautious health language; involve a pro when it matters.
          </TrustItem>
          <TrustItem icon="🤝" title="Transparent & reader-supported">
            Clear affiliate disclosures, always.
          </TrustItem>
        </Container>
      </section>

      {/* ───────────────────── Featured categories ───────────────────── */}
      <section className="py-20">
        <Container>
          <SectionHeading
            eyebrow="Shop by need"
            title="Browse safety categories"
            accentWord="categories"
            description="Each category pairs vetted product picks with the guides that help you choose well."
            href="/categories"
            linkLabel="All categories"
          />
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/categories/${c.slug}`}
                className="group rounded-2xl border border-ink/10 bg-white p-5 text-center no-underline shadow-card transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-lift"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cream text-2xl transition group-hover:bg-brand-100" aria-hidden="true">
                  {categoryEmoji(c.slug)}
                </div>
                <p className="mt-3 text-sm font-semibold text-ink group-hover:text-brand-700">{c.name}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ───────────────────── Featured roundups ───────────────────── */}
      {best.length > 0 && (
        <section className="bg-cream py-20">
          <Container>
            <SectionHeading
              eyebrow="Best picks"
              title="Top product roundups"
              accentWord="roundups"
              description="Side-by-side comparisons and clear winners for the products that matter most."
              href="/best"
              linkLabel="All roundups"
            />
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {best.map((item) => (
                <ArticleCard key={item.href} item={item} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ───────────────────── Topical clusters (dark band) ───────────────────── */}
      <section className="bg-night-texture py-20 text-white">
        <Container>
          <div className="max-w-2xl">
            <p className="eyebrow-light">Topical authority</p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              One place for <span className="accent-light">whole-home</span> safety
            </h2>
            <p className="mt-3 text-white/70">
              We organize everything into clear clusters — so you can solve a whole problem, not just
              buy one product.
            </p>
          </div>
          <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((t) => (
              <Link
                key={t.slug}
                href="/topics"
                className="group border-t border-white/12 pt-5 no-underline"
              >
                <p className="eyebrow-light">{t.categories.length} categories</p>
                <h3 className="mt-2 font-display text-xl font-semibold text-white group-hover:text-brand-300">
                  {t.name}
                </h3>
                <p className="mt-2 text-sm text-white/65">{t.description}</p>
                <span className="mt-3 inline-block text-sm font-semibold text-brand-300">
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ───────────────────── Featured guides ───────────────────── */}
      {guides.length > 0 && (
        <section className="py-20">
          <Container>
            <SectionHeading
              eyebrow="Safety guides"
              title="Practical, reassuring guides"
              accentWord="reassuring"
              description="Step-by-step safety guidance you can act on today."
              href="/guides"
              linkLabel="All guides"
            />
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {guides.map((item) => (
                <ArticleCard key={item.href} item={item} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ───────────────────── Editorial quote ───────────────────── */}
      <section className="bg-cream py-20">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Why we do this</p>
            <blockquote className="mt-5 font-display text-2xl font-semibold leading-snug text-ink sm:text-3xl">
              “We recommend products the way we&apos;d choose them for our own parents — judged on
              stability, ease of use, and value, <span className="accent">never</span> on
              commissions.”
            </blockquote>
            <div className="mt-6 flex items-center justify-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-700 font-semibold text-white" aria-hidden="true">
                SS
              </span>
              <div className="text-left">
                <p className="font-semibold text-ink">SeniorSaferHome Editorial Team</p>
                <Link href="/editorial-policy" className="text-sm font-medium text-brand-700">
                  Read our editorial policy →
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ───────────────────── Featured reviews ───────────────────── */}
      {reviews.length > 0 && (
        <section className="py-20">
          <Container>
            <SectionHeading
              eyebrow="Hands-on reviews"
              title="In-depth product reviews"
              accentWord="In-depth"
              description="Honest verdicts with pros, cons, and who each product is right for."
              href="/reviews"
              linkLabel="All reviews"
            />
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {reviews.map((item) => (
                <ArticleCard key={item.href} item={item} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ───────────────────── Latest ───────────────────── */}
      {latest.length > 0 && (
        <section className="bg-cream py-20">
          <Container>
            <SectionHeading eyebrow="Fresh from the team" title="Latest articles" accentWord="Latest" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((item) => (
                <ArticleCard key={item.href} item={item} />
              ))}
            </div>
            <div className="mt-10">
              <DisclosureBox />
            </div>
          </Container>
        </section>
      )}

      {/* ───────────────────── CTA band (dark) ───────────────────── */}
      <section className="relative overflow-hidden bg-night-texture py-20 text-white">
        <div
          className="pointer-events-none absolute -right-32 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 rounded-full opacity-25 blur-3xl"
          style={{ background: 'radial-gradient(circle, #0d9488 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        <Container className="relative">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Help them stay <span className="accent-light">safe</span> at home
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/75">
              Occasional, practical safety tips for keeping aging parents safe and independent. No
              spam — just the essentials.
            </p>
            <NewsletterForm variant="dark" />
          </div>
        </Container>
      </section>
    </>
  );
}

function SectionHeading({
  eyebrow,
  title,
  accentWord,
  description,
  href,
  linkLabel,
}: {
  eyebrow?: string;
  title: string;
  accentWord?: string;
  description?: string;
  href?: string;
  linkLabel?: string;
}) {
  const rendered =
    accentWord && title.includes(accentWord)
      ? title.split(accentWord).flatMap((part, i) =>
          i === 0 ? [part] : [<span key={i} className="accent">{accentWord}</span>, part]
        )
      : title;
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">{rendered}</h2>
        {description && <p className="mt-3 text-ink-soft">{description}</p>}
      </div>
      {href && linkLabel && (
        <Link href={href} className="flex-shrink-0 text-sm font-semibold text-brand-700 no-underline">
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}

function TrustItem({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="text-2xl" aria-hidden="true">
        {icon}
      </span>
      <div>
        <p className="font-semibold text-ink">{title}</p>
        <p className="mt-0.5 text-sm text-ink-muted">{children}</p>
      </div>
    </div>
  );
}

function categoryEmoji(slug: string): string {
  const map: Record<string, string> = {
    'grab-bars': '🤚',
    'shower-chairs': '🪑',
    'transfer-benches': '🛁',
    'raised-toilet-seats': '🚽',
    'bed-rails': '🛏️',
    'medical-alert-systems': '🆘',
    'pill-organizers': '💊',
    'non-slip-bath-mats': '🧼',
    'large-button-phones': '☎️',
    'reachers-dressing-aids': '🦯',
    'walkers-rollators': '🚶',
    canes: '🦯',
    'bedside-commodes': '🚻',
    'motion-sensor-night-lights': '💡',
    'compression-socks': '🧦',
    'low-vision-magnifiers': '🔍',
    'stair-safety': '🪜',
    'door-wander-alarms': '🚪',
    'overbed-tables': '🍽️',
    'bath-lifts': '🛁',
    'transport-wheelchairs': '♿',
  };
  return map[slug] || '🏠';
}
