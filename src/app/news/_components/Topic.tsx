'use client';

import { useState } from 'react';
import dayjs from 'dayjs';
import { NewsPageItem } from '@/apis/types';
import VideoModal from '@/app/insights/_components/VideoModal';

export default function Topic({ data }: { data?: NewsPageItem }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!data) return null;

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
      <div onClick={handleClick} className="group block cursor-pointer">
        <div className="relative h-87 overflow-hidden mobile:h-[12.5rem]">
          <img
            src={data.cover || '/imgs/news/insights-bg.webp'}
            alt={data.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent mobile:from-black/90 mobile:via-black/50" />
          {isYouTube && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-600 text-white opacity-80 transition-opacity group-hover:opacity-100">
                <svg className="ml-1 h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-6 mobile:p-5">
            {data.publishDate && (
              <div className="mb-2 font-medium text-white mobile:mb-1.5 mobile:text-xs">
                {dayjs(data.publishDate).format('MMM DD, YYYY')}
              </div>
            )}
            <h2 className="flex items-center gap-3 font-semibold text-white">
              <span className="truncate text-4xl/[2.75rem] mobile:text-lg/8">{data.title}</span>
              {data.source && (
                <span className="shrink-0 rounded bg-orange/20 px-2 py-0.5 font-oxanium text-lg/8 font-bold uppercase text-orange backdrop-blur-md mobile:px-2.5 mobile:py-1 mobile:text-sm/4">
                  {data.source}
                </span>
              )}
            </h2>
            {data.brief && (
              <p className="mt-4 line-clamp-2 font-medium text-white mobile:mt-2 mobile:text-sm">
                {data.brief.replace(/[#*]/g, '').trim()}
              </p>
            )}
          </div>
        </div>
      </div>

      {isYouTube && (
        <VideoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} videoId={data.videoId!} title={data.title} />
      )}
    </>
  );
}
