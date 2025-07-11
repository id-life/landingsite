import { fetchNewsList } from '@/apis';
import NewsCard from './_components/NewsCard';
import type { Metadata } from 'next';
import '@/styles/geo.css';

export const revalidate = 300; // 5min

export const metadata: Metadata = { title: 'News-Immortal Dragons' };

export default async function NewsPage() {
  const data = await fetchNewsList();
  const news = data.code == 200 ? data.data : [];
  const insight = news[0];

  return (
    <div>
      <div>
        {insight && (
          <>
            <h1 className="text-5xl/[4.5rem] font-semibold">Insights</h1>
            <div className="relative mt-4">
              <img className="w-full" src="/imgs/news/insights-bg.webp" alt="" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/30 backdrop-blur-sm">
                <p className="truncate p-4 text-2xl/7 font-semibold">{insight.title}</p>
                <p className="mb-4 line-clamp-2 px-4 text-sm/5 font-medium">{insight.brief.replace(/[#*]/g, '').trim()}</p>
              </div>
            </div>
          </>
        )}
        <h2 className="mt-16 text-4xl/[3.375rem] font-semibold">Latest News</h2>
        <div className="mt-6 grid grid-cols-3 gap-x-6 gap-y-10 mobile:grid-cols-1">
          {news.map((item) => (
            <NewsCard data={item} key={item.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
