import dayjs from 'dayjs';
import Markdown from 'react-markdown';
import relativeTime from 'dayjs/plugin/relativeTime';
import { fetchNewsContent, fetchNewsList } from '@/apis';
import 'github-markdown-css';
import '@/styles/markdown.css';

dayjs.extend(relativeTime);

export const revalidate = 60; // TODO: change 5min
export const dynamicParams = true;

export async function generateStaticParams() {
  const data = await fetchNewsList();
  const news = data.code == 200 ? data.data : [];
  return news.map((item) => ({ id: item.id.toString() }));
}

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const res = await fetchNewsContent(id);
  const data = res.code == 200 ? res.data : undefined;

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
          <Markdown>{data?.content}</Markdown>
        </div>
      </div>
    </div>
  );
}
