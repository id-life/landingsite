'use client';

import { useState } from 'react';
import dayjs from 'dayjs';
import { NewsPageItem } from '@/apis/types';
import VideoModal from '@/app/insights/_components/VideoModal';

export default function NewsCard({ data }: { data: NewsPageItem }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isYouTube = !!data.videoId;

  const handleClick = () => {
    if (isYouTube) {
      setIsModalOpen(true);
    } else if (data.isExternal && data.url) {
      window.open(data.url, '_blank');
    } else {
      window.open(`/news/${data.id}`, '_blank');
    }
  };

  return (
    <>
      <div
        onClick={handleClick}
        className="group block cursor-pointer overflow-hidden bg-white duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-lg"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={data.cover || '/imgs/news/insights-bg.webp'}
            alt={data.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {isYouTube && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white">
                <svg className="ml-1 h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="line-clamp-2 text-lg font-semibold">{data.title}</h3>
          <div className="mt-4 flex items-center gap-2 text-sm font-medium uppercase text-black/40">
            {data?.source && <span>{data.source}</span>}
            {data?.source && data.publishDate && <span>·</span>}
            {data?.publishDate && <span>{dayjs(data.publishDate).format('MMM DD, YYYY')}</span>}
          </div>
        </div>
      </div>

      {isYouTube && (
        <VideoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} videoId={data.videoId!} title={data.title} />
      )}
    </>
  );
}
