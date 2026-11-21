import { FUND, FUND_ADDRESS_LINE } from '@/content/fund';
import { SLOGANS } from '@/content/slogans';
import { BOOKS, SPECTRUM_GROUPS } from '@/content/initiatives';
import { TWIN_FEATURES, TWIN_FEATURES_CN } from '@/content/twin';
import { CONNECT_STRENGTHS } from '@/content/connect';
import { portfolio } from '@/app/portfolio/_components/portfolioData';
import { WORLD_MAP_DOTS } from '@/constants/engagement';
import { newsItems } from '@/app/insights/_components/InsightsSummary';

/**
 * PERF-03 A1 / SEO-01 A1: what an experience route shows, for a visitor without JavaScript. Inside <noscript>, so a
 * browser that runs JavaScript never draws it: his loader stays the first thing on screen and the intro is untouched.
 *
 * Every string is one the route's own section draws with JavaScript, on the laptop or the phone version (read from
 * both on his site and on this build: the audit's drawn-text listing), taken from the same data the section renders:
 * the slogans, which the hero and the laptop's fixed controls rotate through on every section; the portfolio tiles;
 * the News & Talks row (the same request and order as the row); Spectrum's groups and books; the Presence map's
 * places; the Digital Twin's features; Connect's MOONSHOT page and contact block. The few headings that are written
 * in the section's markup are repeated here word for word; test/route-noscript.test.mjs checks each against that file.
 * Nothing here is new text, and nothing the route does not show.
 */
export type ExperienceRoute = 'home' | 'portfolio' | 'insights' | 'spectrum' | 'presence' | 'digitaltwin' | 'connect';

/** Headings written in the sections' markup (file in the comment), repeated word for word. */
export const SECTION_HEADINGS = {
  portfolio: 'Portfolio', // src/app/portfolio/_components/Portfolio.tsx
  insights: 'NEWS & TALKS', // src/app/insights/_components/NewsAndTalksSection.tsx
  presence: 'Presence', // src/components/engagement/Engagement.tsx
  presenceLine: 'GLOBAL REACH. EAST & WEST', // src/components/engagement/Engagement.tsx
  spectrum: 'Spectrum', // src/components/spectrum/Spectrum.tsx
  moonshot: 'MOONSHOT', // src/app/connect/FixedConnect.tsx
  moonshotLine: 'We Stand with Bold Unorthodox Ideas and Brave Contrarian Founders', // src/app/connect/FixedConnect.tsx
} as const;

function Slogans() {
  return (
    <ul>
      {SLOGANS.map((s) => (
        <li key={s.id} lang={s.locale === 'zh' ? 'zh-Hans' : 'en'}>
          {s.text}
        </li>
      ))}
    </ul>
  );
}

async function Body({ route }: { route: ExperienceRoute }) {
  switch (route) {
    case 'home':
      return null;
    case 'portfolio':
      return (
        <>
          <h2>{SECTION_HEADINGS.portfolio}</h2>
          <ul>
            {portfolio.map((item) => (
              <li key={item.slug}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </li>
            ))}
          </ul>
          <p>{FUND.email}</p>
        </>
      );
    case 'insights': {
      const news = await newsItems();
      return (
        <>
          <h2>{SECTION_HEADINGS.insights}</h2>
          <ul>
            {news.map((item) => (
              <li key={`${item.title}-${item.href ?? ''}`}>
                <h3>{item.href ? <a href={item.href}>{item.title}</a> : item.title}</h3>
                {item.text?.map((line) => (
                  <p key={String(line)}>{typeof line === 'string' ? line : line.text}</p>
                ))}
              </li>
            ))}
          </ul>
        </>
      );
    }
    case 'spectrum':
      return (
        <>
          <h2>{SECTION_HEADINGS.spectrum}</h2>
          <ul>
            {SPECTRUM_GROUPS.map((g) => (
              <li key={g.id}>
                <h3>
                  {g.text.en} <span lang="zh-Hans">{g.text.zh}</span>
                </h3>
                {g.id === 'translation-publishing' && (
                  <ul>
                    {BOOKS.map((b) => (
                      <li key={b.slug}>{b.title}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </>
      );
    case 'presence':
      return (
        <>
          <h2>{SECTION_HEADINGS.presence}</h2>
          <p>{SECTION_HEADINGS.presenceLine}</p>
          <ul>
            {WORLD_MAP_DOTS.filter((d) => d.label).map((d) => (
              <li key={d.key ?? `${d.label}-${d.country}`}>
                {d.label}, {d.country}
              </li>
            ))}
          </ul>
        </>
      );
    case 'digitaltwin':
      return (
        <ul>
          {TWIN_FEATURES.map((f) => (
            <li key={f}>{f}</li>
          ))}
          <li lang="zh-Hans">{TWIN_FEATURES_CN}</li>
        </ul>
      );
    case 'connect':
      return (
        <>
          <h2>{SECTION_HEADINGS.moonshot}</h2>
          <p>{SECTION_HEADINGS.moonshotLine}</p>
          <p>{CONNECT_STRENGTHS[0].text.en}</p>
          <p>{FUND_ADDRESS_LINE}</p>
          <p>{FUND.email}</p>
        </>
      );
  }
}

const NOSCRIPT_CSS = [
  'body{height:auto;overflow:auto}',
  '.route-noscript{position:relative;z-index:2;max-width:60rem;margin:0 auto;padding:7rem 1.25rem 4rem;color:var(--color-ink,#222);font-size:1rem;line-height:1.5}',
  '.route-noscript--home{margin-top:100svh;padding-top:2rem}',
  '.route-noscript h2{font-size:1.5rem;font-weight:700;margin:1.5rem 0 .75rem}',
  '.route-noscript h3{font-weight:600;margin-top:.75rem}',
  '.route-noscript ul{margin:.5rem 0}',
].join('');

/** The route's text for a visitor without JavaScript (see the file's comment). Render it from the route's page. */
export default async function RouteNoScript({ route }: { route: ExperienceRoute }) {
  return (
    <noscript>
      {/* Only without JavaScript: the phone version's body does not scroll (the experience pages its sections), so it
          scrolls here; the text sits on the page's own background in the site's ink. */}
      <style>{NOSCRIPT_CSS}</style>
      {/* Below the first screen on the home route (the poster is the hero there), at the top elsewhere, above the
          page's fixed background layers; the header stays above it. */}
      <main className={route === 'home' ? 'route-noscript route-noscript--home' : 'route-noscript'}>
        <Body route={route} />
        <Slogans />
      </main>
    </noscript>
  );
}
