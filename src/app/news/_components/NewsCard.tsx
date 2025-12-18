'use client';

import dayjs from 'dayjs';
import Link from 'next/link';
import { NewsListItem } from '@/apis/types';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function NewsCard({ data }: { data: NewsListItem }) {
  const timeAgo = dayjs(data.createdAt).fromNow();

  return (
    <Link
      target="_blank"
      href={`/news/${data.id}`}
      className="group block overflow-hidden bg-white duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={data.cover || '/imgs/news/insights-bg.webp'}
          alt={data.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 text-lg font-semibold">{data.title}</h3>
        <div className="mt-4 flex items-center font-medium text-black/40">
          <span>Article</span>
        </div>
      </div>
    </Link>
  );
}
