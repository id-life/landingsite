import React, { cache } from 'react';
import dayjs from 'dayjs';
import Markdown from 'react-markdown';
import { notFound } from 'next/navigation';
import relativeTime from 'dayjs/plugin/relativeTime';
import { fetchNewsContent } from '@/apis';
import rehypeRaw from 'rehype-raw';
import 'github-markdown-css';
import '@/styles/markdown.css';

dayjs.extend(relativeTime);

export const revalidate = 300; // 5min
export const dynamicParams = true;
export const dynamic = 'force-static';

const excludeNews = [1, 59];

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
  return { title: data ? `${data.title} - Immortal Dragons` : 'Immortal Dragons' };
}

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const { id } = await params;
  if (excludeNews.includes(Number(id))) return notFound();

  const data = await getCacheNewsContent(id);

  return (
    <div>
      <div className="mt-5 flex items-center justify-between">
        <div className="text-xl/5 font-medium">
          Home <span className="text-black/50">&gt; Article</span>
        </div>
        <p className="text-sm font-semibold">{dayjs(data?.createdAt).fromNow()}</p>
      </div>
      <div className="mt-10 rounded-3xl bg-white p-20">
        <div className="mb-5 flex items-center justify-center gap-2 text-sm/5 font-semibold">
          <img src="/imgs/news/article_logo.webp" className="size-7" alt="" />
          Immortal Dragons
        </div>
        <h1 className="mt-5 text-center text-[2.375rem]/[3.75rem] font-semibold capitalize">{data?.title}</h1>
        <div className="mx-auto mb-15 mt-10 w-80 border-b border-dashed border-black" />
        <div className="markdown-body">
          <Markdown rehypePlugins={[rehypeRaw]}>{data?.content}</Markdown>
        </div>
      </div>
    </div>
  );
}
