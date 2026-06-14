// Generates public/llms.txt (llmstxt.org format) so AI answer engines
// (ChatGPT, Perplexity, Google AI, Claude) can discover and cite the site.
// Run after content/category changes:  node scripts/gen-llms.mjs
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const site = JSON.parse(fs.readFileSync('data/site.json', 'utf8'));
const categories = JSON.parse(fs.readFileSync('data/categories.json', 'utf8'));
const base = site.url.replace(/\/$/, '');

function readContent(dir) {
  const d = path.join('content', dir);
  if (!fs.existsSync(d)) return [];
  return fs
    .readdirSync(d)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => {
      const { data } = matter(fs.readFileSync(path.join(d, f), 'utf8'));
      return { slug: data.slug || f.replace(/\.mdx$/, ''), title: data.title || data.slug, description: data.description || '' };
    });
}

const best = readContent('best');
const guides = readContent('guides');
const giftGuides = readContent('gift-guides');

const lines = [];
lines.push(`# ${site.name}`);
lines.push('');
lines.push(
  `> ${site.description} Independent, editorially-selected Amazon product picks (rated 4.5★+ and in stock) with comparison roundups, buying guides, and a plain-language glossary for older adults and the families and caregivers who support them. As an Amazon Associate, ${site.name} earns from qualifying purchases.`
);
lines.push('');
lines.push(
  'All product picks are chosen on safety and value, not commissions. Health guidance is cautious and non-alarmist; readers are pointed to a doctor, pharmacist, or occupational therapist for medical decisions.'
);
lines.push('');

lines.push('## Product categories');
lines.push('');
for (const c of categories) {
  lines.push(`- [${c.name}](${base}/categories/${c.slug}/): ${c.shortDescription}`);
}
lines.push('');

if (best.length) {
  lines.push('## Best-of roundups (comparison guides)');
  lines.push('');
  for (const a of best) lines.push(`- [${a.title}](${base}/best/${a.slug}/): ${a.description}`);
  lines.push('');
}

if (guides.length) {
  lines.push('## Buying & safety guides');
  lines.push('');
  for (const a of guides) lines.push(`- [${a.title}](${base}/guides/${a.slug}/): ${a.description}`);
  lines.push('');
}

if (giftGuides.length) {
  lines.push('## Gift guides');
  lines.push('');
  for (const a of giftGuides) lines.push(`- [${a.title}](${base}/gift-guides/${a.slug}/): ${a.description}`);
  lines.push('');
}

lines.push('## About');
lines.push('');
lines.push(`- [About ${site.name}](${base}/about/)`);
lines.push(`- [Editorial policy](${base}/editorial-policy/)`);
lines.push(`- [Affiliate disclosure](${base}/affiliate-disclosure/)`);
lines.push(`- [Glossary of senior home-safety terms](${base}/glossary/)`);
lines.push('');

const out = lines.join('\n');
fs.writeFileSync('public/llms.txt', out);
console.log(`Wrote public/llms.txt (${categories.length} categories, ${best.length} roundups, ${guides.length} guides).`);
