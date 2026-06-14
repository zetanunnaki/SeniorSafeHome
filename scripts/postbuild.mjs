// Post-build steps for GitHub Pages:
//  - Write .nojekyll so GitHub Pages serves _next/ assets (Jekyll ignores _-prefixed dirs).
//  - Write CNAME if NEXT_PUBLIC_CUSTOM_DOMAIN is set (custom apex domain deploys).

import fs from 'node:fs';
import path from 'node:path';

const out = path.join(process.cwd(), 'out');

if (!fs.existsSync(out)) {
  console.warn('[postbuild] out/ directory not found — did `next build` run? Skipping.');
  process.exit(0);
}

fs.writeFileSync(path.join(out, '.nojekyll'), '');
console.log('[postbuild] Wrote out/.nojekyll');

const customDomain = process.env.NEXT_PUBLIC_CUSTOM_DOMAIN;
if (customDomain) {
  fs.writeFileSync(path.join(out, 'CNAME'), `${customDomain}\n`);
  console.log(`[postbuild] Wrote out/CNAME (${customDomain})`);
}
