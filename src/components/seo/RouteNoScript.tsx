import type { ReactNode } from 'react';
import dayjs from 'dayjs';
import { fetchInsightsWithGeo } from '@/apis';
import { FUND, FUND_ADDRESS_LINE } from '@/content/fund';
import { SLOGANS } from '@/content/slogans';
import { BOOKS, SPECTRUM_GROUPS } from '@/content/initiatives';
import { TWIN_FEATURES, TWIN_FEATURES_CN } from '@/content/twin';
import { CONNECT_STRENGTHS } from '@/content/connect';
import { PORTFOLIO_PHONE_FIRST_PAGE, portfolio } from '@/app/portfolio/_components/portfolioData';
import { WORLD_MAP_DOTS } from '@/constants/engagement';
import { NEWS_ROW_PAGE_LAPTOP, toInsightItems } from '@/hooks/insights/insightItems';
import { DESKTOP_TREE_QUERY, PHONE_TREE_QUERY } from '@/styles/device-classes';

/**
 * PERF-03 A1 / SEO-01 A1: what an experience route shows, for a visitor without JavaScript. Inside <noscript>, so a
 * browser that runs JavaScript never draws it: his loader stays the first thing on screen and the intro is untouched.
 *
 * Per route AND per version: every line is one that route's own section draws with JavaScript on arrival, on the
 * version it is marked for (read on his site and on this build with the audit's drawn-text listing, the slogans and
 * the Presence tour over a dwell), and a line the other version does not draw is not drawn there either. The lines
 * come from the same data the section renders; the few written in a section's markup are repeated word for word and
 * test/route-noscript.test.mjs checks each against that file. Plain running text in the page's body face and colour on
 * its background: no heading words, labels or punctuation of ours.
 */
export type ExperienceRoute = 'home' | 'portfolio' | 'insights' | 'spectrum' | 'presence' | 'digitaltwin' | 'connect';

/** Lines written in the sections' markup (file in the comment), repeated word for word. */
export const SECTION_HEADINGS = {
  portfolio: 'Portfolio', // src/app/portfolio/_components/Portfolio.tsx
  insights: 'NEWS & TALKS', // src/app/insights/_components/NewsAndTalksSection.tsx
  presence: 'Presence', // src/components/engagement/Engagement.tsx
  presenceLine: 'GLOBAL REACH. EAST & WEST', // src/components/engagement/Engagement.tsx
  spectrum: 'Spectrum', // src/components/spectrum/Spectrum.tsx
  moonshot: 'MOONSHOT', // src/app/connect/FixedConnect.tsx
  moonshotLine: 'We Stand with Bold Unorthodox Ideas and Brave Contrarian Founders', // src/app/connect/FixedConnect.tsx
} as const;

/**
 * The fewest NEWS & TALKS cards the phone row draws on arrival at the windows read (it fits its cards to the window's
 * height: 4 at 393x659, 6 at 390x844).
 */
const NEWS_ROW_PAGE_PHONE_FEWEST = 4;

/** Which version draws a line: both, the laptop version only, or the phone version only. */
type V = 'both' | 'laptop' | 'phone';

function Line({ v = 'both', lang, children }: { v?: V; lang?: string; children: ReactNode }) {
  return (
    <p className={v === 'both' ? undefined : `ns-${v}`} lang={lang}>
      {children}
    </p>
  );
}

/** The twelve slogans, in their published order. */
function Slogans({ v }: { v: V }) {
  return SLOGANS.map((s) => (
    <Line key={s.id} v={v} lang={s.locale === 'zh' ? 'zh-Hans' : undefined}>
      {s.text}
    </Line>
  ));
}

/** The NEWS & TALKS row's cards, as the row draws them (toInsightItems; publisher and date as on the card). */
async function newsCards() {
  try {
    const res = await fetchInsightsWithGeo();
    return res.code === 200 && Array.isArray(res.data) ? toInsightItems(res.data) : [];
  } catch {
    return [];
  }
}

async function Lines({ route }: { route: ExperienceRoute }) {
  switch (route) {
    case 'home':
      // The hero's slogans rotate through all twelve on both versions.
      return <Slogans v="both" />;
    case 'portfolio':
      return (
        <>
          <Line>{SECTION_HEADINGS.portfolio}</Line>
          {/* The laptop draws every tile's name; the phone its first page, each name with its description. */}
          {portfolio.map((item, i) =>
            i < PORTFOLIO_PHONE_FIRST_PAGE ? (
              <div key={item.slug}>
                <Line>{item.title}</Line>
                <Line v="phone">{item.description}</Line>
              </div>
            ) : (
              <Line key={item.slug} v="laptop">
                {item.title}
              </Line>
            ),
          )}
          <Line>{FUND.email}</Line>
          <Slogans v="laptop" />
        </>
      );
    case 'insights': {
      const news = (await newsCards()).slice(0, NEWS_ROW_PAGE_LAPTOP);
      return (
        <>
          <Line v="laptop">{SECTION_HEADINGS.insights}</Line>
          {news.map((item, i) => {
            const v: V = i < NEWS_ROW_PAGE_PHONE_FEWEST ? 'both' : 'laptop';
            const meta = [item.publisher, item.publishDate && dayjs(item.publishDate).format('MMM DD, YYYY')].filter(Boolean);
            return (
              <div key={item.id}>
                <Line v={v}>{item.title}</Line>
                {meta.length > 0 && <Line v={v}>{meta.join(' · ')}</Line>}
              </div>
            );
          })}
          <Slogans v="laptop" />
        </>
      );
    }
    case 'spectrum':
      return (
        <>
          <Line>{SECTION_HEADINGS.spectrum}</Line>
          {/* The phone's first page is the first group and its books; the laptop draws every group. */}
          {SPECTRUM_GROUPS.map((g, i) => (
            <div key={g.id}>
              <Line v={i === 0 ? 'both' : 'laptop'}>{g.text.en}</Line>
              <Line v={i === 0 ? 'both' : 'laptop'} lang="zh-Hans">
                {g.text.zh}
              </Line>
              {g.id === 'translation-publishing' && BOOKS.map((b) => <Line key={b.slug}>{b.title}</Line>)}
            </div>
          ))}
          <Slogans v="laptop" />
        </>
      );
    case 'presence':
      return (
        <>
          {/* The phone's tour draws the heading and its line; the laptop map only its places. */}
          <Line v="phone">{SECTION_HEADINGS.presence}</Line>
          <Line v="phone">{SECTION_HEADINGS.presenceLine}</Line>
          {WORLD_MAP_DOTS.filter((d) => d.label).map((d) => (
            <Line key={d.key ?? `${d.label}-${d.country}`}>
              {d.label}, {d.country}
            </Line>
          ))}
          <Slogans v="laptop" />
        </>
      );
    case 'digitaltwin':
      // The phone's Twin draws no text of these on arrival (only DEMO); the laptop draws the features.
      return (
        <>
          {TWIN_FEATURES.map((f) => (
            <Line key={f} v="laptop">
              {f}
            </Line>
          ))}
          <Line v="laptop" lang="zh-Hans">
            {TWIN_FEATURES_CN}
          </Line>
          <Slogans v="laptop" />
        </>
      );
    case 'connect':
      // Connect shows no slogans on either version; the phone spells MOONSHOT letter by letter.
      return (
        <>
          <Line v="laptop">{SECTION_HEADINGS.moonshot}</Line>
          <Line>{SECTION_HEADINGS.moonshotLine}</Line>
          <Line>{CONNECT_STRENGTHS[0].text.en}</Line>
          <Line>{FUND_ADDRESS_LINE}</Line>
          <Line>{FUND.email}</Line>
        </>
      );
  }
}

// Only without JavaScript. The block inherits the body's face, size and colour and sits on the page's own background;
// lines are plain paragraphs. The phone version's body does not scroll (the experience pages its sections), so it
// scrolls here; long words wrap instead of widening the page.
const NOSCRIPT_CSS = [
  'body{height:auto;overflow-y:auto;overflow-x:hidden}',
  '.route-noscript{position:relative;z-index:2;max-width:60rem;margin:0 auto;padding:7rem 1.25rem 4rem;overflow-wrap:anywhere}',
  '.route-noscript--home{margin-top:100svh;padding-top:2rem}',
  '.route-noscript p{margin:0 0 .5em}',
  `@media ${PHONE_TREE_QUERY}{.route-noscript .ns-laptop{display:none}}`,
  `@media ${DESKTOP_TREE_QUERY}{.route-noscript .ns-phone{display:none}}`,
].join('');

// The home route's poster is fixed to the window; without JavaScript it stays with the first screen instead, so the
// text below it scrolls into view clear of the wordmark.
const NOSCRIPT_HOME_CSS = '#hero-poster{position:absolute;height:100svh}';

/** The route's text for a visitor without JavaScript (see the file's comment). Render it from the route's page. */
export default async function RouteNoScript({ route }: { route: ExperienceRoute }) {
  return (
    // data-route-noscript: the container test/hidden-layer.test.mjs exempts as this route's drawn text (named there).
    <noscript data-route-noscript="">
      <style>{route === 'home' ? NOSCRIPT_CSS + NOSCRIPT_HOME_CSS : NOSCRIPT_CSS}</style>
      {/* Below the first screen on the home route (the poster is the hero there), at the top elsewhere. */}
      <main className={route === 'home' ? 'route-noscript route-noscript--home' : 'route-noscript'}>
        <Lines route={route} />
      </main>
    </noscript>
  );
}
