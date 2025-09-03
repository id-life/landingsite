import { fetchNewsList } from '@/apis';
import NewsCard from './_components/NewsCard';
import { ItemList, WithContext } from 'schema-dts';
import type { Metadata } from 'next';
import React from 'react';

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
  const data = await fetchNewsList();
  const news = data.code == 200 ? data.data : [];
  const insight = news[0];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {insight && (
        <>
          <h1 className="text-5xl/[4.5rem] font-semibold mobile:text-2xl">Insights</h1>
          <div className="relative mt-4">
            <img className="w-full" src="/imgs/news/insights-bg.webp" alt="" />
            <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/30 backdrop-blur-sm">
              <p className="truncate p-4 text-2xl/7 font-semibold">{insight.title}</p>
              <p className="mb-4 line-clamp-2 px-4 text-sm/5 font-medium">{insight.brief.replace(/[#*]/g, '').trim()}</p>
            </div>
          </div>
        </>
      )}
      <h2 className="mt-16 text-4xl/[3.375rem] font-semibold mobile:mt-8 mobile:text-2xl">Latest News</h2>
      <div className="mt-6 grid grid-cols-3 gap-x-6 gap-y-10 mobile:grid-cols-1 mobile:gap-5">
        {news.map((item) => (
          <NewsCard data={item} key={item.id} />
        ))}
      </div>
    </>
  );
}
