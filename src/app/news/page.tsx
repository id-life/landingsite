import { fetchNewsList, fetchInsightsWithGeo } from '@/apis';
import { InsightsWithGeoItem, NewsListItem, NewsPageItem } from '@/apis/types';
import NewsCard from './_components/NewsCard';
import { ItemList, WithContext } from 'schema-dts';
import type { Metadata } from 'next';
import React from 'react';
import SubTitle from '@/app/news/_components/SubTitle';
import Topic from '@/app/news/_components/Topic';

function extractYouTubeVideoId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? match[1] : null;
}

function transformToNewsPageItems(insightsWithGeoItems: InsightsWithGeoItem[], geoListItems: NewsListItem[]): NewsPageItem[] {
  // Create a map for geo list items by id for brief lookup
  const geoMap = new Map(geoListItems.map((item) => [item.id, item]));

  // Sort: isTop first, then insights by sequence, then geo by sequence
  const sortedItems = [...insightsWithGeoItems].sort((a, b) => {
    // 1. isTop priority
    if (a.isTop && !b.isTop) return -1;
    if (!a.isTop && b.isTop) return 1;
    // 2. insights before geo
    if (a.contentType === 'insights' && b.contentType === 'geo') return -1;
    if (a.contentType === 'geo' && b.contentType === 'insights') return 1;
    // 3. same type: sort by sequence ascending
    return a.sequence - b.sequence;
  });

  return sortedItems.map((item) => {
    const isGeo = item.contentType === 'geo';
    const geoDetails = isGeo && item.id ? geoMap.get(item.id) : undefined;
    const videoId = item.url ? extractYouTubeVideoId(item.url) : null;

    return {
      id: item.id ?? 0,
      title: item.title,
      brief: geoDetails?.brief ?? null,
      cover: item.imageUrl,
      source: item.publisher,
      publishDate: item.publishDate,
      url: item.url,
      videoId,
      isExternal: !!(item.url && !item.url.startsWith('/')),
    };
  });
}

export const revalidate = 300; // 5min

export const metadata: Metadata = {
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
        url: 'https://cdn.id.life/id-life-cover-2.webp',
      },
    ],
  },
};

const jsonLd: WithContext<ItemList> = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Immortal Dragons News',
  description: 'Latest news and insights from Immortal Dragons',
  url: 'https://www.id.life/news',
  numberOfItems: 4,
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'NewsArticle',
        '@id': 'https://www.id.life/news/10001',
        headline: '不朽真龙：引领长寿革命的使命驱动型基金',
        datePublished: '2025-07-10T08:22:16.222Z',
        image: 'https://www.id.life/imgs/news/insights-bg.webp',
        author: {
          '@type': 'Organization',
          name: 'Immortal Dragons',
          url: 'https://www.id.life/news/10001',
        },
      },
    },
    {
      '@type': 'ListItem',
      position: 2,
      item: {
        '@type': 'NewsArticle',
        '@id': 'https://www.id.life/news/10002',
        headline: '探索不朽真龙的投资组合：从Healthspan Capital到Longevity.Technology',
        datePublished: '2025-07-10T08:22:16.357Z',
        image: 'https://www.id.life/imgs/news/insights-bg.webp',
        author: {
          '@type': 'Organization',
          name: 'Immortal Dragons',
          url: 'https://www.id.life/news/10002',
        },
      },
    },
    {
      '@type': 'ListItem',
      position: 3,
      item: {
        '@type': 'NewsArticle',
        '@id': 'https://www.id.life/news/10003',
        headline: 'Boyang的基因疗法实验：不朽真龙创始人的亲身经历',
        datePublished: '2025-07-10T08:22:16.481Z',
        image: 'https://www.id.life/imgs/news/insights-bg.webp',
        author: {
          '@type': 'Organization',
          name: 'Immortal Dragons',
          url: 'https://www.id.life/news/10003',
        },
      },
    },
    {
      '@type': 'ListItem',
      position: 4,
      item: {
        '@type': 'NewsArticle',
        '@id': 'https://www.id.life/news/10004',
        headline: '全身替换技术：不朽真龙投资的激进长寿方案解析',
        datePublished: '2025-07-10T08:22:16.612Z',
        image: 'https://www.id.life/imgs/news/insights-bg.webp',
        author: {
          '@type': 'Organization',
          name: 'Immortal Dragons',
          url: 'https://www.id.life/news/10004',
        },
      },
    },
  ],
};

export default async function NewsPage() {
  // Fetch from both endpoints in parallel
  const [insightsWithGeoRes, geoListRes] = await Promise.all([fetchInsightsWithGeo(), fetchNewsList()]);

  const insightsWithGeoItems =
    insightsWithGeoRes.code === 200 ? insightsWithGeoRes.data.filter((item) => item.contentType !== 'geo') : [];
  const geoListItems = geoListRes.code === 200 ? geoListRes.data : [];

  // Transform and sort
  const news = transformToNewsPageItems(insightsWithGeoItems, geoListItems);
  const [featured, ...restNews] = news;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
