'use client';

import { useState, useMemo, useRef } from 'react';
import { useAtomValue } from 'jotai';
import { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { PodcastCard } from '@/app/insights/_components/PodcastCard';
import { PlayList, podcastIDAtom, podcastLTAtom } from '@/atoms/audio-player';
import { useMobileItemsPerPage } from '@/hooks/useMobileItemsPerPage';
import NavigationArrowButton from '@/app/insights/_components/NavigationArrowButton';
import MobilePaginationDots from '@/app/insights/_components/MobilePaginationDots';
import ViewAllButton from '@/app/insights/_components/ViewAllButton';
import { cn } from '@/utils';

export type PodcastItem = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  duration: number;
  date: string;
  xyzLink?: string;
  spotifyLink?: string;
  podcastLink?: string;
};

type PodcastSectionProps = {
  podcasts?: { id: number }[];
  isLoading?: boolean;
  isMobile?: boolean;
};

export default function PodcastSection({ podcasts = [], isLoading, isMobile = false }: PodcastSectionProps) {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const swiperRef = useRef<SwiperType>();
  const containerRef = useRef<HTMLDivElement>(null);
  const podcastIDList = useAtomValue(podcastIDAtom);
  const podcastLTList = useAtomValue(podcastLTAtom);
  const itemsPerPage = useMobileItemsPerPage(containerRef, isMobile);

  const allPodcasts = useMemo(() => [...podcastIDList, ...podcastLTList], [podcastIDList, podcastLTList]);

  const podcastData = useMemo<PodcastItem[]>(() => {
    return podcasts
      .map((podcast) => {
        const item = allPodcasts.find((p) => p.id === podcast.id);
        if (!item) return null;
        return {
          id: item.id,
          title: item.title,
          subtitle: `${item.artist || '不朽真龙 Immortal Dragons'} ${item.category === PlayList.PODCAST_ID ? '· 《医药群星》' : '· 龙门阵Long Talk'}`,
          description: item.description || '',
          duration: item.duration,
          date: item.createdAt!,
          xyzLink: item.xyzLink,
          podcastLink: item.podcastLink,
          spotifyLink: item.spotifyLink,
        } as PodcastItem;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [podcasts, allPodcasts]);

  const totalPages = isMobile ? Math.ceil(podcastData.length / itemsPerPage) : 1;

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  const handlePaginationClick = (index: number) => {
    swiperRef.current?.slideTo(index);
    setCurrentPage(index);
  };

  const handleViewAllClick = () => {
    window.open('/podcast', '_blank');
  };

  const renderContent = () => {
    if (isLoading) {
      const skeletonCount = isMobile ? 2 : 3;
      return (
        <div className={cn('flex gap-6', isMobile && 'flex-col gap-5')}>
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <div key={index} className="w-full space-y-3 bg-white/50 p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="h-6 w-3/4 animate-pulse rounded bg-gray-800/50" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-gray-800/50" />
                </div>
                <div className="h-11 w-11 animate-pulse rounded bg-gray-800/50" />
              </div>
              <div className="h-16 animate-pulse rounded bg-gray-800/50" />
            </div>
          ))}
        </div>
      );
    }

    // Mobile layout: dynamic items per page, vertical
    if (isMobile) {
      return (
        <Swiper
          className="h-full w-full"
          onBeforeInit={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => setCurrentPage(swiper.activeIndex)}
          slidesPerView={1}
          spaceBetween={16}
        >
          {Array.from({ length: totalPages }).map((_, pageIndex) => {
            const pageItems = podcastData.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage);

            return (
              <SwiperSlide key={pageIndex}>
                <div className="flex flex-col gap-5">
                  {pageItems.map((item) => (
                    <PodcastCard key={item.id} item={item} isMobile />
                  ))}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      );
    }

    // Desktop layout: horizontal swiper
    return (
      <Swiper
        className="h-full w-full"
        onBeforeInit={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        slidesPerView={3}
        spaceBetween={24}
      >
        {podcastData.map((item) => (
          <SwiperSlide key={item.id}>
            <PodcastCard item={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    );
  };

  return (
    <div ref={containerRef} className={cn('relative flex flex-col', isMobile && 'h-full')}>
      {/* Mobile: wrap header + content for vertical centering */}
      <div className={cn(isMobile && 'flex flex-1 flex-col justify-center overflow-hidden')}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className={cn('font-oxanium text-[1.625rem]/9 font-semibold uppercase', isMobile && 'text-[26px] leading-9')}>
              PODCAST
            </h2>
            {/* Platform logos */}
            {!isMobile && (
              <div className="flex items-center gap-1.5">
                <a
                  href="https://www.xiaoyuzhoufm.com/podcast/68244dd700fe41f83952e9d8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-100 transition-opacity hover:opacity-80"
                >
                  <img src="/svgs/podcast/fm_xyz_fill.svg" alt="Xiaoyuzhou FM" className="size-6" />
                </a>
                <a
                  href="https://open.spotify.com/show/5j7IvewaR6znPMk4XC4Bvu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-100 transition-opacity hover:opacity-80"
                >
                  <img src="/svgs/podcast/fm_spotify_fill.svg" alt="Spotify" className="size-6" />
                </a>
                <a
                  href="https://podcasts.apple.com/cn/podcast/%E4%B8%8D%E6%9C%BD%E7%9C%9F%E9%BE%99-immortaldragons/id1815210084?l=en-GB"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-100 transition-opacity hover:opacity-80"
                >
                  <img src="/svgs/podcast/fm_podcast_fill.svg" alt="Apple Podcasts" className="size-6" />
                </a>
              </div>
            )}
          </div>
          <ViewAllButton onClick={handleViewAllClick} isMobile={isMobile} />
        </div>

        {/* Content */}
        <div className={cn('relative mt-6', !isMobile && 'pr-0')}>
          {/* Desktop arrows */}
          {!isMobile && <NavigationArrowButton onClick={handlePrev} disabled={isBeginning} direction="prev" />}

          {renderContent()}

          {!isMobile && <NavigationArrowButton onClick={handleNext} disabled={isEnd} direction="next" />}
        </div>
      </div>

      {/* Mobile Internal Pagination */}
      {isMobile && (
        <MobilePaginationDots totalPages={totalPages} currentPage={currentPage} onPageChange={handlePaginationClick} />
      )}
    </div>
  );
}
