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

async function podcastLines() {
  try {
    const results = await Promise.all([fetchPodcastList('podcast_id'), fetchPodcastList('podcast_lt')]);
    return results.flatMap((res) =>
      res.code === 200 && Array.isArray(res.data)
        ? res.data.map((item) => `- [${item.title}](${absoluteUrl(`/podcast/${item.id}`)})`)
        : [],
    );
  } catch {
    return [];
  }
}

export async function GET() {
  const [news, podcasts] = await Promise.all([newsLines(), podcastLines()]);

  const body = [
    LLMS_HEADER,
    section('Portfolio', portfolioLines()),
    section('Latest news', news),
    section('Podcast episodes', podcasts),
    LLMS_CHINESE_SUMMARY,
  ]
    .filter(Boolean)
    .join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
