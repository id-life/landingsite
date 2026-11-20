import { fetchInsightsWithGeo, fetchPodcastList } from '@/apis';
import { portfolioChineseMarkdownLines, portfolioMarkdownLines } from '@/app/portfolio/_components/portfolioProfiles';
import { PODCAST_COVER, PODCAST_METADATA, PODCAST_NAV_LIST, type PodcastNavItem } from '@/app/podcast/_components/constant';
import { FUND_PRESS, PORTFOLIO_PRESS, pressMarkdownLines } from '@/constants/press';
import { absoluteUrl } from '@/constants/site';
import { LLMS_CHINESE_SUMMARY, LLMS_HEADER } from './content';

// Regenerate at most once a day so new portfolio, news and podcast entries flow in.
export const revalidate = 86400;

const MAX_NEWS = 20;

const section = (title: string, lines: string[]) => (lines.length ? `## ${title}\n\n${lines.join('\n')}\n` : '');

// Same source as the /news page (/insights/with-geo), so the section follows whatever ops publish there.
// Title, publisher, date and link are taken as-is from the API; nothing is written here.
// API failures only drop the affected section; llms.txt itself must always render.
async function newsLines() {
  try {
    const res = await fetchInsightsWithGeo();
    if (res.code !== 200 || !Array.isArray(res.data)) return [];
    const time = (date: string | null) => (date ? Date.parse(date) : 0);
    return [...res.data]
      .sort((a, b) => time(b.publishDate) - time(a.publishDate))
      .flatMap((item) => {
        const url = item.url ?? (item.id ? `/news/${item.id}` : null);
        if (!url) return [];
        const title = item.title.replace(/[[\]]/g, '\\$&');
        const details = [item.publisher, item.publishDate?.slice(0, 10)].filter(Boolean);
        return [
          `- [${title}](${url.startsWith('/') ? absoluteUrl(url) : url})${details.map((detail) => ` — ${detail}`).join('')}`,
        ];
      })
      .slice(0, MAX_NEWS);
  } catch {
    return [];
  }
}

// The two shows restart their episode numbering (both have an E01), so each gets its own heading.
// Titles, descriptions and links come from the podcast page's own constants — no separate copy.
async function podcastSeriesBlock({ id, link }: PodcastNavItem) {
  const { title, enTitle } = PODCAST_COVER[id];
  const description = PODCAST_METADATA[id].description ?? '';
  try {
    const res = await fetchPodcastList(`podcast_${id}`);
    if (res.code !== 200 || !Array.isArray(res.data) || !res.data.length) return '';
    const episodes = res.data.map((item) => `- [${item.title}](${absoluteUrl(`/podcast/${item.id}`)})`);
    return `### ${title} ${enTitle}\n\n${description}\n\nAll episodes: ${absoluteUrl(link)}\n\n${episodes.join('\n')}\n`;
  } catch {
    return '';
  }
}

async function podcastSection() {
  const blocks = (await Promise.all(PODCAST_NAV_LIST.map(podcastSeriesBlock))).filter(Boolean);
  return blocks.length ? `## Podcast episodes\n\n${blocks.join('\n')}` : '';
}

export async function GET() {
  const [news, podcasts] = await Promise.all([newsLines(), podcastSection()]);

  const body = [
    LLMS_HEADER,
    section('Portfolio', portfolioMarkdownLines({ detailed: true })),
    section('Press releases', pressMarkdownLines(FUND_PRESS)),
    section('Portfolio company news', pressMarkdownLines(PORTFOLIO_PRESS)),
    section('Latest news', news),
    podcasts,
    LLMS_CHINESE_SUMMARY,
    section('投资组合公司', portfolioChineseMarkdownLines()),
  ]
    .filter(Boolean)
    .join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
