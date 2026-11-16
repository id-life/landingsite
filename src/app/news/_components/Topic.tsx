'use client';

import { useState } from 'react';
import { NewsPageItem } from '@/apis/types';
import CoverImage from '@/components/media/CoverImage';
import CardShell from '@/components/common/CardShell';
import { safeHref } from '@/utils/safe-href';
import { track } from '@/lib/analytics/track';
import { youtubeWatchUrl } from '@/utils/youtube';
import dynamic from 'next/dynamic';

// The video modal (Floating UI) loads when a video card is first opened, not with the page.
const VideoModal = dynamic(() => import('@/app/insights/_components/VideoModal'), { ssr: false });

export default function Topic({ data }: { data?: NewsPageItem }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Stays true after the first open, so the modal can play its closing transition.
  const [modalLoaded, setModalLoaded] = useState(false);

  if (!data) return null;

  const isYouTube = !!data.videoId;

  const isExternal = Boolean(data.isExternal && data.url);
  const href = isYouTube ? undefined : isExternal ? safeHref(data.url) : `/news/${data.id}`;

  return (
    <>
      <CardShell
        href={href}
        external={isExternal}
        onActivate={() => {
          setModalLoaded(true);
          setIsModalOpen(true);
        }}
        onNavigate={() => track('news_item_click', { item_id: String(data.id), placement: 'news_featured' })}
        linkFallback={isYouTube ? youtubeWatchUrl(data.videoId!) : undefined}
        className="group block cursor-pointer"
      >
        {/* On a short screen (a phone held sideways) the hero takes about a third of the height, so the headline and
            the subscribe heading stay on the first screen; unchanged on screens taller than 500 px. */}
        <div className="relative h-87 overflow-hidden mobile:h-[12.5rem] [@media(max-height:500px)]:h-[35svh]">
          <CoverImage
            src={data.cover || '/imgs/news/insights-bg.webp'}
            alt={data.title}
            sizes="(max-width: 768px) 100vw, 1200px"
            priority
            className="transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent mobile:from-black/90 mobile:via-black/50" />
          {isYouTube && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent text-white opacity-80 transition-opacity group-hover:opacity-100">
                <svg className="ml-1 h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-6 mobile:p-5">
            {data.publishDate && (
              <div className="mb-2 text-body font-medium text-white mobile:mb-1.5 mobile:text-caption">{data.publishLabel}</div>
            )}
            <h2 className="flex items-center gap-3 font-semibold text-white">
              {/* Title and source tag kept at their original 36 and 18 px (no role: title is 38 at 1440 and 44 at 1920, and cut this one-line title
                  where wave 0 showed it whole). */}
              <span className="truncate text-4xl/[2.75rem] mobile:text-lg/8">{data.title}</span>
              {data.source && (
                <span className="shrink-0 rounded bg-data-yellow/20 px-2 py-0.5 font-display text-lg/8 font-bold uppercase text-data-yellow backdrop-blur-md mobile:px-2.5 mobile:py-1 mobile:text-sm/4">
                  {data.source}
                </span>
              )}
            </h2>
            {data.brief && (
              <p className="mt-4 line-clamp-2 text-body font-medium text-white mobile:mt-2 mobile:text-body-sm">
                {data.brief.replace(/[#*]/g, '').trim()}
              </p>
            )}
          </div>
        </div>
      </CardShell>

      {isYouTube && modalLoaded && (
        <VideoModal
          placement="news_featured"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          videoId={data.videoId!}
          title={data.title}
        />
      )}
    </>
  );
}
