'use client';

import dayjs from 'dayjs';
import Link from 'next/link';
import { NewsListItem } from '@/apis/types';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function NewsCard({ data }: { data: NewsListItem }) {
  return (
    <div className="bg-white p-4 duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-lg">
      <Link target="_blank" href={`/news/${data.id}`}>
        <div className="flex items-center gap-2 text-base font-medium text-black/50">
          <img src="/imgs/news/article_logo.webp" className="size-6" alt="" />
          Immortal Dragons
        </div>
        <h3 className="mt-2.5 line-clamp-2 h-14 text-lg font-semibold">{data.title}</h3>
        <div className="mt-4 font-medium text-black/50">
          Article <span className="px-1">·</span> {dayjs(data.createdAt).fromNow()}
        </div>
        <p className="mt-4 line-clamp-3 text-sm font-medium">{data.brief}</p>
      </Link>
    </div>
  );
}
