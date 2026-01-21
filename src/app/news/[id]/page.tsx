import React, { cache } from 'react';
import dayjs from 'dayjs';
import Markdown from 'react-markdown';
import relativeTime from 'dayjs/plugin/relativeTime';
import { fetchNewsContent } from '@/apis';
import rehypeRaw from 'rehype-raw';
import 'github-markdown-css/github-markdown-light.css';
import '@/styles/markdown.css';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { NewsArticle, WithContext } from 'schema-dts';
import { formatKeywords } from '@/utils';

dayjs.extend(relativeTime);

export const revalidate = 300; // 5min
export const dynamicParams = true;
export const dynamic = 'force-static';

const getCacheNewsContent = cache(async (id: string) => {
  const res = await fetchNewsContent(id);
  return res.code == 200 ? res.data : undefined;
});

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = params;
  const data = await getCacheNewsContent(id);
  return {
    title: `${data?.title} - Immortal Dragons`,
    description: data?.description,
    keywords: formatKeywords(data?.keyWords),
    openGraph: {
      title: `${data?.title} - Immortal Dragons`,
      siteName: 'Immortal Dragons',
      description: data?.description,
      images: [
        {
          url: 'https://cdn.id.life/id-life-cover-2.webp',
        },
      ],
    },
  };
}

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const { id } = await params;

  const data = await getCacheNewsContent(id);

  if (!data || data.status === 'UNPUBLISH') {
    return notFound();
  }

  const jsonLd: WithContext<NewsArticle> = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: data.title,
    author: {
      '@type': 'Organization',
      name: 'Immortal Dragons',
    },
    datePublished: data.createdAt,
    dateModified: data.createdAt,
    image: 'https://cdn.id.life/id-life-cover-2.webp',
    description: data.content.slice(0, 50),
    publisher: {
      '@type': 'Organization',
      name: 'Immortal Dragons',
      logo: {
        '@type': 'ImageObject',
        url: 'https://cdn.id.life/logo.png',
      },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div>
        <div className="mt-5 flex items-center justify-between mobile:mt-3.5">
          <div className="text-xl/5 font-medium mobile:text-xs/5">
            <Link href="/news">News</Link>
            <span className="ml-1 text-black/50">&gt; Article</span>
          </div>
        </div>
        <div className="mt-10 rounded-3xl bg-white p-20 mobile:mt-3 mobile:rounded-lg mobile:p-3">
          <div className="flex items-center justify-center gap-2 text-sm/5 font-semibold">
            <img src="/imgs/news/article_logo.webp" className="size-7" alt="" />
            Immortal Dragons
          </div>
          <h1 className="mt-5 text-center text-[2.375rem]/[3.75rem] font-semibold mobile:mt-3 mobile:text-lg">{data.title}</h1>
          <div className="mx-auto mb-15 mt-10 max-w-80 border-b border-dashed border-black mobile:mb-10 mobile:mt-7.5" />
          <div className="markdown-body mobile:[&_p]:text-sm">
            <Markdown rehypePlugins={[rehypeRaw]}>{data.content}</Markdown>
          </div>
        </div>
      </div>
    </>
  );
}
