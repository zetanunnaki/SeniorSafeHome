// Renders a JSON-LD <script> block. Use one per schema object, or pass an array.

// Escape characters that could break out of the <script> context. Product
// titles come from the Amazon API, so even though JSON.stringify produces valid
// JSON, we defend against a title containing "</script>" or HTML.
function safeJsonLd(item: object): string {
  return JSON.stringify(item)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

export function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(item) }} />
      ))}
    </>
  );
}
