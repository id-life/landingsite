'use client';

import React, { useState } from 'react';
import dayjs from 'dayjs';
import { TalkItem } from '@/app/insights/_components/TalksSection';
import YouTubeThumbnail from '@/app/insights/_components/YouTubeThumbnail';
import VideoModal from '@/app/insights/_components/VideoModal';

export default function TalkCard({ item }: { item: TalkItem }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    window.open(item.url, '_blank');
  };

  return (
    <>
      <div className="group flex gap-5 mobile:flex-col mobile:gap-3">
        <div className="relative h-42 w-75 flex-shrink-0 mobile:h-[9.8125rem] mobile:w-full">
          <YouTubeThumbnail
            pic={'https://cdn1.p12.games/p12-news/NplPQeEGomBkvng0'}
            videoId={item.videoId}
            title={item.title}
            onClick={handleClick}
          />
        </div>
        <div className="flex w-80 flex-1 flex-col justify-between py-1 mobile:w-full">
          <h3 onClick={handleClick} className="cursor-pointer font-poppins text-xl/6 font-semibold hover:underline">
            {item.title}
          </h3>
          <span className="text-right text-gray-450">{dayjs(item.date).format('MMM DD, YYYY')}</span>
        </div>
      </div>

      <VideoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} videoId={item.videoId} title={item.title} />
    </>
  );
}
