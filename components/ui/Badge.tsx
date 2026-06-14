import { cn } from '@/lib/utils';

const TONES: Record<string, string> = {
  best: 'bg-brand-600 text-white',
  value: 'bg-sage-600 text-white',
  premium: 'bg-ink text-white',
  neutral: 'bg-slate-100 text-ink-soft',
};

/** Picks a tone from common editorial badge labels. */
function toneFor(label: string): string {
  const l = label.toLowerCase();
  if (l.includes('value') || l.includes('budget')) return TONES.value;
  if (l.includes('premium') || l.includes('comfort')) return TONES.premium;
  if (l.includes('best') || l.includes('top') || l.includes('overall')) return TONES.best;
  return TONES.neutral;
}

export function Badge({
  children,
  tone,
  className,
}: {
  children: string;
  tone?: keyof typeof TONES;
  className?: string;
}) {
  const cls = tone ? TONES[tone] : toneFor(children);
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide',
        cls,
        className
      )}
    >
      {children}
    </span>
  );
}
