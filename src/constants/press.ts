// Press releases and syndicated coverage about Immortal Dragons and its portfolio companies.
// Titles and dates are copied from the published pages.

export type PressItem = {
  title: string;
  source: string;
  url: string;
  date?: string;
};

/** Coverage whose subject is Immortal Dragons itself (also exposed as Organization.subjectOf). */
export const FUND_PRESS: PressItem[] = [
  {
    title: 'Immortal Dragons Launches $40M Longevity Fund to Support Radical Life Extensions',
    source: 'Yahoo Finance',
    url: 'https://finance.yahoo.com/news/immortal-dragons-launches-40m-longevity-211000083.html',
    date: '2025-07-16',
  },
  {
    title: 'Singapore: The Longevity Lab Reimagining Human Life Extension',
    source: 'AP News',
    url: 'https://apnews.com/press-release/marketersmedia/singapore-the-longevity-lab-reimagining-human-life-extension-c747cb7502e6004e7732fa63638244b1',
    date: '2025-12-31',
  },
];

/** News from portfolio companies. */
export const PORTFOLIO_PRESS: PressItem[] = [
  {
    title: 'Unlimited Bio Registers First-in-Class Dual Gene Therapy Trial',
    source: 'Markets Insider',
    url: 'https://markets.businessinsider.com/news/stocks/unlimited-bio-registers-first-in-class-dual-gene-therapy-trial-1035950701',
    date: '2026-03-20',
  },
  {
    title: "Frontier Bio Wins 'Best Paper' at 50th Annual VESS Meeting for Single-Surgery Regenerative Vascular Graft",
    source: 'Yahoo Finance',
    url: 'https://finance.yahoo.com/sectors/healthcare/articles/frontier-bio-wins-best-paper-180000903.html',
    date: '2026-04-09',
  },
];

export const pressMarkdownLines = (items: PressItem[]) =>
  items.map(({ title, source, url, date }) => `- [${title}](${url}) — ${[source, date].filter(Boolean).join(', ')}`);
