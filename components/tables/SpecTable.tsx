import type { Product } from '@/lib/types';

function humanizeKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

/** Simple key/value specifications table for a single product. */
export function SpecTable({
  product,
  specs,
  title = 'Specifications',
}: {
  product?: Product;
  specs?: Record<string, string>;
  title?: string;
}) {
  const data = specs ?? product?.specs;
  if (!data || Object.keys(data).length === 0) return null;
  return (
    <section className="not-prose">
      {title && <h3 className="text-xl font-semibold text-ink">{title}</h3>}
      <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full text-left text-sm">
          <tbody className="divide-y divide-slate-200">
            {Object.entries(data).map(([k, v]) => (
              <tr key={k} className="even:bg-slate-50">
                <th scope="row" className="w-1/2 p-3 font-medium text-ink-soft">
                  {humanizeKey(k)}
                </th>
                <td className="p-3 text-ink">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
