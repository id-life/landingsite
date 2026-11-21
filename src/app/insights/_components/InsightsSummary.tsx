import { fetchInsightsWithGeo } from '@/apis';
import { PODCAST_COVER, PODCAST_NAV_LIST } from '@/app/podcast/_components/constant';
import { transformToNewsPageItems } from '@/app/news/_lib/newsItems';
import PageSEOContent, { type SEOItem } from '@/components/seo/PageSEOContent';
import { absoluteUrl } from '@/constants/site';

const MAX_ITEMS = 20;

// Same source and order as the News & Talks section; an API failure only drops the list. Also the route's text
// without JavaScript (src/components/seo/RouteNoScript.tsx).
export async function newsItems(): Promise<SEOItem[]> {
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
        // The NEWS & TALKS row shows these same items, in the same order, as real links (the cards past its first page
        // through its arrows): kept from screen readers here so none is announced twice. The podcast shows named below
        // appear nowhere else on the page, so that section stays announced.
        { heading: 'News & Talks', items: await newsItems(), shownOnPage: true },
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
