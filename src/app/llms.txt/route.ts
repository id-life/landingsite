import { fetchNewsList, fetchPodcastList } from '@/apis';
import { portfolio } from '@/app/portfolio/_components/portfolioData';
import { absoluteUrl } from '@/constants/site';
import { LLMS_CHINESE_SUMMARY, LLMS_HEADER } from './content';

// Regenerate at most once a day so new portfolio, news and podcast entries flow in.
export const revalidate = 86400;

const MAX_NEWS = 20;

const section = (title: string, lines: string[]) => (lines.length ? `## ${title}\n\n${lines.join('\n')}\n` : '');

function portfolioLines() {
  return portfolio.map(({ title, description, link }) => `- ${link ? `[${title}](${link})` : title}: ${description}`);
}

// API failures only drop the affected section; llms.txt itself must always render.
async function newsLines() {
  try {
    const res = await fetchNewsList();
    if (res.code !== 200 || !Array.isArray(res.data)) return [];
    return [...res.data]
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
      .slice(0, MAX_NEWS)
      .map((item) => `- [${item.title}](${absoluteUrl(`/news/${item.id}`)}) — ${item.createdAt.slice(0, 10)}`);
  } catch {
    return [];
  }
}

// The two shows restart their episode numbering (both have an E01), so each gets its own heading.
const PODCAST_SERIES = [
  {
    category: 'podcast_id',
    title: '不朽真龙 Immortal Dragons Podcast',
    path: '/podcast',
    about: 'Longevity science, technology and investment, including Chinese translations of talks by longevity researchers.',
  },
  {
    category: 'podcast_lt',
    title: '龙门阵 Long Talk',
    path: '/podcast?c=lt',
    about: 'Casual conversations from the Immortal Dragons team on health, technology, culture and everyday life.',
  },
];

async function podcastSeriesBlock({ category, title, path, about }: (typeof PODCAST_SERIES)[number]) {
  try {
    const res = await fetchPodcastList(category);
    if (res.code !== 200 || !Array.isArray(res.data) || !res.data.length) return '';
    const episodes = res.data.map((item) => `- [${item.title}](${absoluteUrl(`/podcast/${item.id}`)})`);
    return `### ${title}\n\n${about} All episodes: ${absoluteUrl(path)}\n\n${episodes.join('\n')}\n`;
  } catch {
    return '';
  }
}

async function podcastSection() {
  const blocks = (await Promise.all(PODCAST_SERIES.map(podcastSeriesBlock))).filter(Boolean);
  return blocks.length ? `## Podcast episodes\n\n${blocks.join('\n')}` : '';
}

export async function GET() {
  const [news, podcasts] = await Promise.all([newsLines(), podcastSection()]);

  const body = [
    LLMS_HEADER,
    section('Portfolio', portfolioLines()),
    section('Latest news', news),
    podcasts,
    LLMS_CHINESE_SUMMARY,
  ]
    .filter(Boolean)
    .join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
