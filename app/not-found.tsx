import Link from 'next/link';
import { Container } from '@/components/ui/Container';

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="text-6xl font-bold text-brand-600">404</p>
      <h1 className="mt-4 text-3xl font-bold text-ink">We couldn&apos;t find that page</h1>
      <p className="mx-auto mt-3 max-w-md text-ink-soft">
        The page may have moved. Try one of these instead:
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary no-underline">
          Home
        </Link>
        <Link href="/best" className="btn-secondary no-underline">
          Best Picks
        </Link>
        <Link href="/guides" className="btn-secondary no-underline">
          Safety Guides
        </Link>
        <Link href="/categories" className="btn-secondary no-underline">
          Categories
        </Link>
      </div>
    </Container>
  );
}
