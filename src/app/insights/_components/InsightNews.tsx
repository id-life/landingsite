'use client';

import dayjs from 'dayjs';

export type NewsItem = {
  id: number;
  title: string;
  date: string;
  tag: 'News' | 'Coverage';
  url: string;
  sequence: number;
};

type InsightNewsProps = {
  item: NewsItem;
};

export default function InsightNews({ item }: InsightNewsProps) {
  const tagStyles = {
    News: 'bg-blue-600/20 text-blue-600',
    Coverage: 'bg-purple/20 text-purple',
  };

  return (
    <div className="w-100 mobile:w-auto">
      <a
        className="line-clamp-3 block h-[4.5rem] font-poppins text-xl/6 font-semibold hover:underline"
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {item.title}
      </a>
      <div className="mt-4 flex items-center justify-between">
        <span className={`rounded px-1.5 py-1 font-oxanium text-base/5 font-semibold ${tagStyles[item.tag]}`}>{item.tag}</span>
        <span className="text-gray-450">{dayjs(item.date).format('MMM DD, YYYY')}</span>
      </div>
    </div>
  );
}
