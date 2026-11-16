// Tell IndexNow search engines (Bing, Yandex, Naver, Seznam, Yep) which URLs changed.
// Bing's index also feeds ChatGPT search and Copilot.
//
//   npm run indexnow                      submit every URL in the live sitemap
//   npm run indexnow -- /podcast /news    submit only these paths
//   npm run indexnow -- --dry-run         print what would be sent
//
// Run it after a production deploy: the engines fetch the key file from the live site to verify.

const SITE = 'https://www.id.life';
// Public by design: the same value is served at `${SITE}/${KEY}.txt` (public/<key>.txt).
const KEY = '86fa8a843db69187d8ec3c887ed6b9a7';
const ENDPOINT = 'https://api.indexnow.org/indexnow';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const paths = args.filter((arg) => !arg.startsWith('--'));

async function sitemapUrls() {
  const res = await fetch(`${SITE}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap.xml returned ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].replaceAll('&amp;', '&'));
}

const urlList = paths.length ? paths.map((path) => new URL(path, SITE).href) : await sitemapUrls();
if (!urlList.length) throw new Error('no URLs to submit');

console.log(`${dryRun ? 'Would submit' : 'Submitting'} ${urlList.length} URL(s):`);
urlList.forEach((url) => console.log(`  ${url}`));

if (!dryRun) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
  });
  // 200 = accepted, 202 = accepted, key check pending. Anything else is a failure.
  console.log(`IndexNow responded ${res.status} ${res.statusText}`);
  if (res.status !== 200 && res.status !== 202) {
    console.error(await res.text());
    process.exitCode = 1;
  }
}
