'use client';

import React, { useState } from 'react';
import dayjs from 'dayjs';
import { TalkItem } from '@/app/insights/_components/TalksSection';
import YouTubeThumbnail from '@/app/insights/_components/YouTubeThumbnail';
import VideoModal from '@/app/insights/_components/VideoModal';
import { track } from '@/lib/analytics/track';
import { safeHref } from '@/utils/safe-href';

export default function TalkCard({ item }: { item: TalkItem }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // A talk opens on YouTube in a new tab: a real link (DATA-03), counted as video_open.
  const href = safeHref(item.url);
  const onOpen = () => track('video_open', { video_id: item.videoId || String(item.id), placement: 'insights_talks' });

  return (
    <>
      <div className="group flex gap-5 mobile:flex-col mobile:gap-3">
        <div className="relative h-42 w-75 flex-shrink-0 mobile:h-[9.8125rem] mobile:w-full">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onOpen}
            tabIndex={-1}
            aria-hidden="true"
            className="block h-full"
          >
            <YouTubeThumbnail
              pic={'https://cdn1.p12.games/p12-news/NplPQeEGomBkvng0'}
              videoId={item.videoId}
              title={item.title}
              onClick={() => {}}
            />
          </a>
        </div>
        <div className="flex w-80 flex-1 flex-col justify-between py-1 mobile:w-full">
          <h3 className="font-poppins text-xl/6 font-semibold hover:underline">
            <a href={href} target="_blank" rel="noopener noreferrer" onClick={onOpen}>
              {item.title}
            </a>
          </h3>
          <span className="text-right text-gray-450">{dayjs(item.date).format('MMM DD, YYYY')}</span>
        </div>
      </div>

      <VideoModal
        placement="insights_talks"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoId={item.videoId}
        title={item.title}
      />
    </>
  );
}
