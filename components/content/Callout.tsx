import { cn } from '@/lib/utils';

const STYLES = {
  info: { box: 'border-brand-200 bg-brand-50', icon: 'ℹ️', label: 'Note' },
  tip: { box: 'border-sage-200 bg-sage-50', icon: '💡', label: 'Tip' },
  warning: { box: 'border-amber-300 bg-amber-50', icon: '⚠️', label: 'Important' },
  safety: { box: 'border-rose-200 bg-rose-50', icon: '🛟', label: 'Safety note' },
} as const;

/** Highlighted callout for tips, warnings, and safety notes inside MDX. */
export function Callout({
  type = 'info',
  title,
  children,
}: {
  type?: keyof typeof STYLES;
  title?: string;
  children: React.ReactNode;
}) {
  const s = STYLES[type];
  return (
    <div className={cn('not-prose my-6 rounded-xl border p-5', s.box)}>
      <p className="flex items-center gap-2 font-semibold text-ink">
        <span aria-hidden="true">{s.icon}</span>
        {title || s.label}
      </p>
      <div className="mt-2 text-ink-soft [&>*+*]:mt-2">{children}</div>
    </div>
  );
}
