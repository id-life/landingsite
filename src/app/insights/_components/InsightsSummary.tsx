import { fetchInsightsWithGeo } from '@/apis';
import { PODCAST_COVER, PODCAST_NAV_LIST } from '@/app/podcast/_components/constant';
import { transformToNewsPageItems } from '@/app/news/_lib/newsItems';
import PageSEOContent, { type SEOItem } from '@/components/seo/PageSEOContent';
import { absoluteUrl } from '@/constants/site';

const MAX_ITEMS = 20;

// Same source and order as the News & Talks section; an API failure only drops the list.
async function newsItems(): Promise<SEOItem[]> {
  try {
    const res = await fetchInsightsWithGeo();
    if (res.code !== 200 || !Array.isArray(res.data)) return [];
    const items = res.data.filter((item) => item.contentType !== 'geo');
    return transformToNewsPageItems(items)
      .slice(0, MAX_ITEMS)
      .map((item) => ({
        title: item.title,
        text: [[item.source, item.publishDate?.slice(0, 10)].filter(Boolean).join(' · ')].filter(Boolean),
        href: item.url ? (item.url.startsWith('/') ? absoluteUrl(item.url) : item.url) : undefined,
      }));
  } catch {
    return [];
  }
}

export default async function InsightsSummary({ title, description }: { title: string; description: string }) {
  return (
    <PageSEOContent
      title={title}
      intro={[description]}
      sections={[
        { heading: 'News & Talks', items: await newsItems() },
        {
          heading: 'Podcast',
          items: PODCAST_NAV_LIST.map(({ id, link }) => ({
            title: `${PODCAST_COVER[id].title} ${PODCAST_COVER[id].enTitle}`,
            href: absoluteUrl(link),
          })),
        },
      ]}
    />
  );
}
