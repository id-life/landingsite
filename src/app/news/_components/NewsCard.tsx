'use client';

import { Fragment, useState } from 'react';
import { NewsPageItem } from '@/apis/types';
import YouTubeThumbnail from '@/app/insights/_components/YouTubeThumbnail';
import CardShell from '@/components/common/CardShell';
import { safeHref } from '@/utils/safe-href';
import { track } from '@/lib/analytics/track';
import { youtubeWatchUrl } from '@/utils/youtube';
import dynamic from 'next/dynamic';

// The video modal (Floating UI) loads when a video card is first opened, not with the page.
const VideoModal = dynamic(() => import('@/app/insights/_components/VideoModal'), { ssr: false });

export default function NewsCard({ data }: { data: NewsPageItem }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Stays true after the first open, so the modal can play its closing transition.
  const [modalLoaded, setModalLoaded] = useState(false);
  const isYouTube = !!data.videoId;

  // Articles are real links (crawlable, middle-click and keyboard work): external press opens in a
  // new tab, our own articles in the same tab. Videos open the modal on a plain click and are still real links
  // to their YouTube page (crawlers, middle-click, no JavaScript).
  const isExternal = Boolean(data.isExternal && data.url);
  const href = isYouTube ? undefined : isExternal ? safeHref(data.url) : `/news/${data.id}`;
  const openVideo = () => {
    setModalLoaded(true);
    setIsModalOpen(true);
  };
  const cardClassName =
    'group block cursor-pointer overflow-hidden bg-white duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-lg mobile:rounded-lg';

  return (
    <>
      <CardShell
        href={href}
        external={isExternal}
        onActivate={openVideo}
        onNavigate={() => track('news_item_click', { item_id: String(data.id), placement: 'news_list' })}
        linkFallback={isYouTube ? youtubeWatchUrl(data.videoId!) : undefined}
        className={cardClassName}
      >
        <div className="relative aspect-[335/157] overflow-hidden mobile:rounded-t-lg">
          <YouTubeThumbnail
            pic={data.cover || '/imgs/news/insights-bg.webp'}
            videoId={data.videoId ?? ''}
            title={data.title}
            onClick={() => {}}
            sizes="(max-width: 768px) 92vw, 30vw"
          />
        </div>
        <div className="p-4 mobile:p-3">
          <h3 className="line-clamp-2 text-lg font-semibold mobile:text-base">{data.title}</h3>
          {/* The source and the date never squeeze into columns: the date moves to the next line whole where both do not fit. */}
          <div className="mt-4 flex flex-wrap items-center gap-x-2 text-sm font-medium text-ink-muted mobile:mt-1.5 mobile:text-sm/4.5">
            {data?.source || data?.publishDate ? (
              <Fragment>
                {data?.source && <span>{data.source}</span>}
                {data?.source && data.publishDate && <span>·</span>}
                {data?.publishDate && <span className="whitespace-nowrap">{data.publishLabel}</span>}{' '}
              </Fragment>
            ) : (
              <span>Article</span>
            )}
          </div>
        </div>
      </CardShell>

      {isYouTube && modalLoaded && (
        <VideoModal
          placement="news_list"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          videoId={data.videoId!}
          title={data.title}
        />
      )}
    </>
  );
}
