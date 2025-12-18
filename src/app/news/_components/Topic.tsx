'use client';

import dayjs from 'dayjs';
import Link from 'next/link';
import { NewsListItem } from '@/apis/types';

export default function Topic({ data }: { data?: NewsListItem }) {
  if (!data) return null;

  return (
    <Link href={`/news/${data.id}`} target="_blank" className="group block">
      <div className="relative h-87 overflow-hidden">
        <img
          src={data.cover || '/imgs/news/insights-bg.webp'}
          alt={data.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-[75%] p-6 mobile:p-4">
          <div className="mb-2 font-medium text-white/80">{dayjs(data.createdAt).format('MMM DD, YYYY')}</div>
          <h2 className="flex items-center gap-3 text-4xl font-semibold text-white mobile:text-lg">
            <span className="truncate">{data.title}</span>
            {data.source && (
              <span className="shrink-0 rounded bg-orange/20 px-2 py-0.5 text-xs font-bold uppercase text-orange backdrop-blur-md">
                {data.source}
              </span>
            )}
          </h2>
          <p className="mt-4 line-clamp-2 font-medium text-white">{data.brief?.replace(/[#*]/g, '').trim()}</p>
        </div>
      </div>
    </Link>
  );
}
