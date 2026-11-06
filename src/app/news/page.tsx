import { fetchInsightsWithGeo } from '@/apis';
import { NewsPageItem } from '@/apis/types';
import { transformToNewsPageItems } from '@/app/news/_lib/newsItems';
import NewsCard from './_components/NewsCard';
import { ItemList, WithContext } from 'schema-dts';
import type { Metadata } from 'next';
import React from 'react';
import SubTitle from '@/app/news/_components/SubTitle';
import Topic from '@/app/news/_components/Topic';

export const revalidate = 300; // 5min

export const metadata: Metadata = {
  alternates: { canonical: '/news' },
  title: 'News 新闻 | Immortal Dragons',
  description:
    "Explore the latest news and coverage on Immortal Dragons' longevity investments, partnerships, insights and sharing.",
  keywords: [
    'Longevity',
    'anti-aging',
    'life extension',
    'investment fund',
    'innovation',
    'biotech',
    'pharmaceutical',
    'healthcare',
    'Immortal Dragons',
  ],
  openGraph: {
    title: 'News 新闻 | Immortal Dragons',
    siteName: 'Immortal Dragons',
    description:
      "Explore the latest news and coverage on Immortal Dragons' longevity investments, partnerships, insights and sharing.",
    images: [
      {
        url: 'https://resources.id.life/id-life-cover-2.webp',
      },
    ],
  },
};

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

export default async function NewsPage() {
  const insightsRes = await fetchInsightsWithGeo();
  const insightsItems = insightsRes.code === 200 ? insightsRes.data.filter((item) => item.contentType !== 'geo') : [];

  // Transform and sort
  const news = transformToNewsPageItems(insightsItems);
  const [featured, ...restNews] = news;
  const jsonLd = generateNewsJsonLd(news);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="sr-only">News 新闻</h1>
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
  );
}
