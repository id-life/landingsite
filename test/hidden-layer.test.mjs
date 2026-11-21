// The hidden layer holds (lead, 2026-11-21): what his site serves stays word for word, shown or hidden, unless an
// answer of his takes it out. For each route the built page's hidden layer (test/helpers/hidden-layer.mjs) is held
// against the recorded copy of his (test/fixtures/his-hidden-layer.json, read from his production site):
// - every hidden text of his is in the build's hidden layer, unless an answer of his named below took it out;
// - every hidden text of the build is his, or one of the roadmap's named additions below, or what an answer put in.
// A new hidden text, or a missing one of his, fails here until it is named with its reason. And text he has ruled out
// (the fixture's ruledOut) must appear nowhere in a built page.
// Reads the prerendered pages of the last `next build` (.next/server/app). With no build it is skipped, and says so; with
// a build older than the checked-out commit it fails and says that, rather than reporting a stale page's differences
// (CI runs it in the build job, after the build).
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import his from './fixtures/his-hidden-layer.json';
import { decode, hiddenLayer, norm, runText } from './helpers/hidden-layer.mjs';
import { diseaseManagementStatusItems } from '@/constants/disease-management';

const FILES = {
  '/': 'index',
  '/portfolio': 'portfolio',
  '/spectrum': 'spectrum',
  '/presence': 'presence',
  '/insights': 'insights',
  '/connect': 'connect',
  '/digitaltwin': 'digitaltwin',
  '/news': 'news',
  '/news/immortal-dragons-news-and-updates': 'news/immortal-dragons-news-and-updates',
  '/news/immortal-dragons-milestones-and-portfolio': 'news/immortal-dragons-milestones-and-portfolio',
  '/podcast': 'podcast',
  '/spectrum/disease-management': 'spectrum/disease-management',
  '/spectrum/influence-network': 'spectrum/influence-network',
};
const built = (route) => `.next/server/app/${FILES[route]}.html`;
const haveBuild = existsSync(built('/'));

/** Which build is read: its time against the checked-out commit's (null when git is not at hand). */
function buildAge() {
  const builtAt = statSync('.next/BUILD_ID').mtimeMs;
  let committedAt = null;
  try {
    committedAt = Number(execSync('git log -1 --format=%ct HEAD', { encoding: 'utf8' }).trim()) * 1000;
  } catch {
    /* no git: nothing to compare */
  }
  return { builtAt: new Date(builtAt).toISOString(), committedAt, stale: committedAt !== null && builtAt < committedAt };
}

/**
 * PERF-03 A1 (merge/w2, approved by the lead): each experience route's own drawn text for a visitor without JavaScript,
 * inside one <noscript data-route-noscript> block (src/components/seo/RouteNoScript.tsx; its strings are held by
 * test/route-noscript.test.mjs). Exempt here by its container, not by its strings, which follow his data.
 */
const ROUTE_NOSCRIPT = /<noscript data-route-noscript=""[^>]*>[\s\S]*?<\/noscript>/g;

/** His answers that take hidden text of his out, each with the text it takes out and the text it puts in. */
const ANSWERS = [
  {
    answer: '12f (16 investments) and 12j (no investment stage), 2026-11-18',
    out: [
      /^基金已完成15余项投资，投资阶段覆盖前种子轮至A轮，不限地域。/,
      /^15余项$/,
      /^The fund has made 15\+ investments ranging from pre-seed to Series A/,
      /^Investments: 15\+$/,
    ],
    in: [
      /^基金已完成16项投资，不限地域。/,
      /^16项$/,
      /^The fund has made 16 investments, and is geographically agnostic\./,
      /^Investments: 16$/,
    ],
  },
  {
    answer: '12j (no investment stage), 2026-11-18',
    out: [
      /^投资阶段$/,
      /^前种子轮至A轮，不限地域$/,
      /^Investment stage: pre-seed to Series A, geographically agnostic$/,
      /^Partnering with Pre-Seed to Series-A startups under \$100m valuations\.$/,
      /^与估值1亿美元以下的种子轮至A轮企业合作$/,
    ],
    in: [/^Partnering with startups under \$100m valuations\.$/, /^与估值1亿美元以下的企业合作$/],
  },
  { answer: 'd, 2026-11-18 (R3 Bio: "Stealth mode biotech")', out: [/^全身替换（Wholebody Replacement）$/], in: [] },
  {
    answer: 'his instruction of 2026-11-17 (the heading becomes "Papers & Reviews 论文与综述")',
    out: [/^Peer Reviews$/],
    in: [/^Papers & Reviews$/],
  },
  {
    answer: '12h ("Healthy")',
    out: [/^Health Longevity and Medicine Conference$/],
    in: [/^Healthy Longevity and Medicine Conference$/],
  },
  {
    answer: 'the Long Talk show address (/podcast/long-talk; his old /podcast?c=lt answers 308 to it)',
    out: [/^https:\/\/www\.id\.life\/podcast\?c=lt$/],
    in: [/^https:\/\/www\.id\.life\/podcast\/long-talk$/],
  },
];

/** The roadmap's named additions to the hidden layer, each with its reason. */
const ADDITIONS = [
  {
    reason: 'names of controls that draw no text (he was told on 2026-11-19 that controls keep undrawn names)',
    runs: [
      'aria-label: Menu',
      'aria-label: Immortal Dragons home',
      'aria-label: Podcast shows',
      'aria-label: Xiaoyuzhou',
      'aria-label: Spotify',
      'aria-label: Apple Podcasts',
      'aria-label: Contact and subscribe',
      'sr-only: Email',
      'aria-label: Breadcrumb',
    ],
  },
  {
    reason: "his h1 on /, as the hero's heading text (CON-05) and the header's logo name",
    runs: ['sr-only: Immortal Dragons 不朽真龙', 'aria-label: Immortal Dragons 不朽真龙'],
  },
  {
    reason: "the header's SUBSCRIBE, invisible until the header's entrance (his word, drawn after it)",
    runs: ['tw-invisible: Subscribe'],
  },
  {
    reason: "each tool page's one h1 and its description (CON-14 A8, gated in wave 1), from his own title and description",
    runs: [
      'sr-only: Disease Management & Cure Status',
      'aria-label: Disease Management & Cure Status',
      'sr-only: 可治疗与可控制疾病列表 A list of curable and manageable diseases',
      'sr-only: Influence Network',
      'aria-label: Influence Network',
      'sr-only: 长寿领域人物影响力与关系图 Longevity influencer network and relationship map',
    ],
  },
];

// The disease tables the page draws (CON-14), in the server HTML inside the content wrapper that starts at opacity 0
// for its entrance (shown by JavaScript, or by the noscript rule): drawn text, not hidden text.
// (Compared without case: the status cells draw "curable" as "Curable".)
const DISEASE_DRAWN = new Set(
  diseaseManagementStatusItems
    .flatMap((item) => [
      item.title,
      ...item.counts.map(String),
      ...item.columns.map((c) => String(c.header)),
      ...item.data.flatMap((row) => Object.values(row).map((v) => norm(String(v)))),
    ])
    .map((text) => text.toLowerCase()),
);
DISEASE_DRAWN.add('download csv');
DISEASE_DRAWN.add('see more');

const matches = (patterns, text) => patterns.some((p) => p.test(text));

/** The held comparison for one route's built HTML: his hidden texts missing, and hidden texts nobody named. */
export function holdHiddenLayer(route, html) {
  const mine = hiddenLayer(html.replace(ROUTE_NOSCRIPT, ''));
  const mineText = ` ${mine.map(runText).join(' ')} `;
  const hisRuns = his.routes[route] ?? [];
  const hisText = ` ${hisRuns.map(runText).join(' ')} `;
  const outPatterns = ANSWERS.flatMap((a) => a.out);
  const inPatterns = ANSWERS.flatMap((a) => a.in);
  const additions = new Set(ADDITIONS.flatMap((a) => a.runs));
  const missing = [...new Set(hisRuns)].filter((run) => {
    const text = runText(run);
    return !mineText.includes(` ${text} `) && !mineText.includes(text) && !matches(outPatterns, text);
  });
  const unnamed = [...new Set(mine)].filter((run) => {
    const text = runText(run);
    if (hisText.includes(text) || additions.has(run) || matches(inPatterns, text)) return false;
    if (route === '/spectrum/disease-management' && run.startsWith('tw-invisible: ') && DISEASE_DRAWN.has(text.toLowerCase())) {
      return false;
    }
    return true;
  });
  return { missing, unnamed };
}

/**
 * Text his site serves that he has ruled out (the fixture's ruledOut: sentences from the beginning, middle and end of
 * an article the home page used to inject). It must appear nowhere in a built page: not in its HTML, not in its flight
 * payload (the RSC data in the page and the route's .rsc file), whitespace and escapes aside.
 */
const flat = (raw) =>
  decode(
    raw
      .replace(/\\u0027/g, "'")
      .replace(/\\n/g, ' ')
      .replace(/\\"/g, '"')
      .replace(/&apos;/g, "'"),
  ).replace(/\s+/g, ' ');
export function ruledOutFound(raw) {
  const text = flat(raw);
  return his.ruledOut.texts.filter((sentence) => text.includes(sentence));
}

describe('the hold itself', () => {
  test('finds a ruled-out sentence however the page carries it', () => {
    const [first] = his.ruledOut.texts;
    expect(ruledOutFound(`<p class="sr-only">${first.replace(/'/g, '&#x27;').replace(/ /g, '\n  ')}</p>`)).toEqual([first]);
    expect(ruledOutFound(`self.__next_f.push([1,"${first.replace(/'/g, '\\u0027')}"])`)).toEqual([first]);
    expect(ruledOutFound('<p>Immortal Dragons</p>')).toEqual([]);
  });

  test('exempts the route-noscript block by its container, and still catches hidden text anywhere else', () => {
    const html =
      '<body><noscript data-route-noscript=""><main class="route-noscript"><p>Any line of the route</p></main></noscript>' +
      '<noscript><p>A noscript line outside the block</p></noscript><div class="sr-only">A stray hidden line</div></body>';
    expect(holdHiddenLayer('/news', html).unnamed).toEqual([
      'noscript: A noscript line outside the block',
      'sr-only: A stray hidden line',
    ]);
  });
});

describe.skipIf(!haveBuild)('the hidden layer against his (built pages)', () => {
  test('the build read is not older than the checked-out commit', () => {
    const age = buildAge();
    expect(
      age.stale,
      `.next was built at ${age.builtAt}, before HEAD (${new Date(age.committedAt).toISOString()}): rebuild before reading it`,
    ).toBe(false);
  });
  for (const route of Object.keys(FILES)) {
    test(route, () => {
      if (buildAge().stale)
        throw new Error('the build in .next is older than HEAD: rebuild before reading it (see the test above)');
      const html = readFileSync(built(route), 'utf8');
      const rsc = built(route).replace(/\.html$/, '.rsc');
      const payload = existsSync(rsc) ? readFileSync(rsc, 'utf8') : '';
      expect({ ...holdHiddenLayer(route, html), ruledOut: ruledOutFound(html + payload) }).toEqual({
        missing: [],
        unnamed: [],
        ruledOut: [],
      });
    });
  }
});

describe.skipIf(haveBuild)('the hidden layer against his (no build in .next: run `next build` first)', () => {
  test.skip('skipped: no prerendered pages to read', () => {});
});
