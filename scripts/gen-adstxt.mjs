// Generates public/ads.txt from NEXT_PUBLIC_ADSENSE_CLIENT so the AdSense
// authorized-sellers line stays in sync with the publisher ID used on the site.
// If the env var isn't set, writes a clearly-marked placeholder (no real entry).
import fs from 'node:fs';

const client = (process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '').trim();
// AdSense client looks like "ca-pub-1234567890123456"; ads.txt wants "pub-1234567890123456".
const pub = client.replace(/^ca-/, '');
const out = 'public/ads.txt';

if (/^pub-\d{10,}$/.test(pub)) {
  fs.writeFileSync(out, `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`);
  console.log(`Wrote public/ads.txt for ${pub}`);
} else {
  fs.writeFileSync(
    out,
    `# ads.txt — Google AdSense authorized sellers.
# This is a placeholder. Set NEXT_PUBLIC_ADSENSE_CLIENT (e.g. ca-pub-1234567890123456)
# and rebuild, OR replace the line below with your own publisher ID:
# google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0
`
  );
  console.log('Wrote public/ads.txt placeholder (NEXT_PUBLIC_ADSENSE_CLIENT not set)');
}
