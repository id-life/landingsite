import * as Sentry from '@sentry/nextjs';
import { PHASE_PRODUCTION_BUILD } from 'next/constants';
import { fetchInsightsWithGeo } from '@/apis';
import { InsightsWithGeoItem, NewsPageItem } from '@/apis/types';
import { transformToNewsPageItems } from '@/app/news/_lib/newsItems';
import NewsCard from './_components/NewsCard';
import { ItemList, WithContext } from 'schema-dts';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { pageMeta } from '@/content/pages';
import React from 'react';
import SubTitle from '@/app/news/_components/SubTitle';
import Topic from '@/app/news/_components/Topic';
import JsonLd from '@/components/seo/JsonLd';

export const revalidate = 300; // 5min

// Title topic and description from the content layer (src/content/pages.ts), shared with llms.txt.
export const metadata: Metadata = buildMetadata(pageMeta('news'));

// Generate JSON-LD dynamically from news data
function generateNewsJsonLd(news: NewsPageItem[]): WithContext<ItemList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Immortal Dragons News',
    description: 'Latest news and insights from Immortal Dragons',
    url: 'https://www.id.life/news',
    numberOfItems: news.length,
    itemListElement: news.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'NewsArticle',
        '@id': item.url?.startsWith('/')
          ? `https://www.id.life${item.url}`
          : (item.url ?? `https://www.id.life/news/${item.id}`),
        headline: item.title,
        ...(item.publishDate && { datePublished: item.publishDate }),
        image: item.cover ?? 'https://www.id.life/imgs/news/insights-bg.webp',
        author: {
          '@type': 'Organization',
          name: item.source ?? 'Immortal Dragons',
        },
      },
    })),
  };
}

/**
 * The articles, or null when the API could not be reached while building. An unreachable API must not fail
 * `next build`: the page then renders its empty state and the error goes to Sentry. At runtime (ISR
 * revalidation) the error is rethrown, because Next keeps serving the last good page only when the
 * regeneration throws; catching it there would replace the good page with an empty one.
 */
async function loadInsights(): Promise<InsightsWithGeoItem[] | null> {
  try {
    const res = await fetchInsightsWithGeo();
    return res.code === 200 && Array.isArray(res.data) ? res.data.filter((item) => item.contentType !== 'geo') : [];
  } catch (error) {
    if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD) throw error;
    Sentry.captureException(error);
    return null;
  }
}

export default async function NewsPage() {
  const insightsItems = await loadInsights();

  // Transform and sort
  const news = transformToNewsPageItems(insightsItems ?? []);
  const [featured, ...restNews] = news;
  const jsonLd = generateNewsJsonLd(news);

  return (
    <>
      <JsonLd data={jsonLd} />
      {/* Not on the screen, as on the original page (the owner shows no heading here). */}
      <h1 className="sr-only">News</h1>
      {insightsItems === null ? (
        <p role="status" className="py-24 text-center font-text text-body font-medium text-black/60 mobile:py-16">
          新闻暂时无法加载，请稍后再来。The news could not be loaded right now; please check back soon.
        </p>
      ) : (
        <>
          <Topic data={featured} />
          <div className="mt-7.5 mobile:mt-3">
            <SubTitle />
          </div>
          <div className="mt-7.5 grid grid-cols-3 gap-x-6 gap-y-10 mobile:mt-3 mobile:grid-cols-1 mobile:gap-3">
            {restNews.map((item) => (
              <NewsCard data={item} key={item.id} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
