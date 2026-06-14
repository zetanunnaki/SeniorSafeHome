import { cn } from '@/lib/utils';

/** Side-by-side pros and cons — scannable for readers and answer engines. */
export function ProsCons({
  pros = [],
  cons = [],
  className,
}: {
  pros?: string[];
  cons?: string[];
  className?: string;
}) {
  if (pros.length === 0 && cons.length === 0) return null;
  return (
    <div className={cn('not-prose grid gap-4 sm:grid-cols-2', className)}>
      <div className="rounded-xl border border-sage-200 bg-sage-50 p-5">
        <h3 className="!mt-0 flex items-center gap-2 text-base font-semibold text-sage-700">
          <span aria-hidden="true">👍</span> Pros
        </h3>
        <ul className="mt-3 space-y-2">
          {pros.map((p) => (
            <li key={p} className="flex gap-2 text-ink-soft">
              <span className="mt-0.5 font-bold text-sage-600" aria-hidden="true">
                +
              </span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-5">
        <h3 className="!mt-0 flex items-center gap-2 text-base font-semibold text-rose-700">
          <span aria-hidden="true">👎</span> Cons
        </h3>
        <ul className="mt-3 space-y-2">
          {cons.map((c) => (
            <li key={c} className="flex gap-2 text-ink-soft">
              <span className="mt-0.5 font-bold text-rose-500" aria-hidden="true">
                −
              </span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
