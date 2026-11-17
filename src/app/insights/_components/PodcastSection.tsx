'use client';

import { useState, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { noteRowPage, useKeptRowPage } from '@/hooks/insights/useKeptRowPage';
import { rowKeyboardProps } from '@/app/insights/_components/rowKeyboard';
import { PodcastCard } from '@/app/insights/_components/PodcastCard';
import { fetchPodcastList } from '@/apis';
import { useMobileItemsPerPage } from '@/hooks/useMobileItemsPerPage';
import { PCNavigationArrowButton, MobileNavigationArrowButton } from '@/app/insights/_components/NavigationArrowButton';
import MobilePaginationDots from '@/app/insights/_components/MobilePaginationDots';
import ViewAllButton, { HEADING, HEADING_PHONE } from '@/app/insights/_components/ViewAllButton';
import { STORAGE_KEY } from '@/constants/storage';
import { cn } from '@/utils';
import SectionLoadError from '@/components/common/SectionLoadError';

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
  isMobile?: boolean;
  compact?: boolean; // Show only 2 items in a grid without swiper (for combined view)
  isVisible?: boolean;
};

const COMPACT_ITEMS_PER_PAGE = 2;

export default function PodcastSection({ isMobile = false, compact = false, isVisible = true }: PodcastSectionProps) {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [isCompactBeginning, setIsCompactBeginning] = useState(true);
  const [isCompactEnd, setIsCompactEnd] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const swiperRef = useRef<SwiperType>(undefined);
  const compactSwiperRef = useRef<SwiperType>(undefined);
  // The page each row shows is kept in the history entry (NAV-02).
  useKeptRowPage('podcast', swiperRef, !isMobile && !compact);
  useKeptRowPage('podcast-phone-list', swiperRef, isMobile && !compact);
  useKeptRowPage('podcast-phone', compactSwiperRef, compact);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = useMobileItemsPerPage(containerRef, isMobile, 156, isVisible); // 播客卡片106 + 间距20 + 30

  // 只获取 podcast_id 分类的播客
  const {
    data: podcastIDData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['podcast_list', 'podcast_id'],
    queryFn: () => fetchPodcastList('podcast_id'),
    select: (res) => (res.code === 200 ? res.data : []),
  });

  const podcastData = useMemo<PodcastItem[]>(() => {
    const allPodcasts = podcastIDData || [];
    return allPodcasts
      .sort((a, b) => (b?.sequence || 0) - (a?.sequence || 0)) // 越大越靠前，优先使用insightSequence排序
      .map((item) => ({
        id: item.id,
        title: item.title,
        subtitle: `${item.artist || '不朽真龙 Immortal Dragons'} · 《医药群星》`,
        description: item.description || '',
        duration: item.duration,
        date: item.createdAt,
        xyzLink: item.xyzLink,
        podcastLink: item.podcastLink,
        spotifyLink: item.spotifyLink,
      }));
  }, [podcastIDData]);

  const totalPages = isMobile ? Math.ceil(podcastData.length / itemsPerPage) : 1;
  const totalCompactPages = Math.ceil(podcastData.length / COMPACT_ITEMS_PER_PAGE);

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  const handleCompactPrev = () => {
    compactSwiperRef.current?.slidePrev();
  };

  const handleCompactNext = () => {
    compactSwiperRef.current?.slideNext();
  };

  const handlePaginationClick = (index: number) => {
    swiperRef.current?.slideTo(index);
    setCurrentPage(index);
  };

  // The VIEW ALL link navigates; this only marks the return page so Back restores Insights on the phone.
  const handleViewAllClick = () => {
    if (isMobile) sessionStorage.setItem(STORAGE_KEY.MOBILE_RETURN_PAGE, 'insights_page');
  };

  const renderContent = () => {
    if (isError) return <SectionLoadError onRetry={() => void refetch()} />;
    if (isLoading) {
      const skeletonCount = compact ? 2 : isMobile ? 2 : 3;
      return (
        <div className={cn('flex gap-6', (isMobile || compact) && 'grid grid-cols-2 gap-3')}>
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <div key={index} className="w-full space-y-3 bg-white/50 p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="h-6 w-3/4 animate-pulse rounded bg-tone-800/50" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-tone-800/50" />
                </div>
                <div className="h-11 w-11 animate-pulse rounded bg-tone-800/50" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Compact mode: Swiper with 2 items per page (for combined view on mobile Insights)
    if (compact) {
      return (
        <Swiper
          {...rowKeyboardProps}
          className="h-full w-full"
          onSlideChange={(swiper) => {
            noteRowPage();
            setIsCompactBeginning(swiper.isBeginning);
            setIsCompactEnd(swiper.isEnd);
          }}
          onBeforeInit={(swiper) => (compactSwiperRef.current = swiper)}
          slidesPerView={1}
          spaceBetween={16}
        >
          {Array.from({ length: totalCompactPages }).map((_, pageIndex) => {
            const pageItems = podcastData.slice(pageIndex * COMPACT_ITEMS_PER_PAGE, (pageIndex + 1) * COMPACT_ITEMS_PER_PAGE);
            return (
              <SwiperSlide key={pageIndex}>
                <div className="grid grid-cols-2 gap-3">
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

    // Mobile layout: dynamic items per page, vertical
    if (isMobile) {
      return (
        <Swiper
          {...rowKeyboardProps}
          className="h-full w-full"
          onBeforeInit={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => {
            setCurrentPage(swiper.activeIndex);
            noteRowPage();
          }}
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
        {...rowKeyboardProps}
        className="h-full w-full"
        onBeforeInit={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => {
          noteRowPage();
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        slidesPerView={2}
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
    <div ref={containerRef} className={cn('relative flex flex-col', isMobile && !compact && 'h-full')}>
      {/* Mobile: wrap header + content for vertical centering (not in compact mode) */}
      <div className={cn(isMobile && !compact && 'flex flex-1 flex-col overflow-hidden [justify-content:safe_center]')}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className={cn(HEADING, isMobile && HEADING_PHONE)}>PODCAST</h2>
            {/* Platform logos: each grows its hit area to 44 px on coarse pointers (RWD-06, tap-area); the boxes keep the original's size. */}
            <div className="flex items-center gap-1.5">
              <a
                href="https://www.xiaoyuzhoufm.com/podcast/68244dd700fe41f83952e9d8"
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center justify-center opacity-100 transition-opacity tap-area hover:opacity-80"
              >
                <img src="/svgs/podcast/fm_xyz_fill.svg" alt="Xiaoyuzhou FM" className="size-6" />
              </a>
              <a
                href="https://open.spotify.com/show/5j7IvewaR6znPMk4XC4Bvu"
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center justify-center opacity-100 transition-opacity tap-area hover:opacity-80"
              >
                <img src="/svgs/podcast/fm_spotify_fill.svg" alt="Spotify" className="size-6" />
              </a>
              <a
                href="https://podcasts.apple.com/cn/podcast/%E4%B8%8D%E6%9C%BD%E7%9C%9F%E9%BE%99-immortaldragons/id1815210084?l=en-GB"
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center justify-center opacity-100 transition-opacity tap-area hover:opacity-80"
              >
                <img src="/svgs/podcast/fm_podcast_fill.svg" alt="Apple Podcasts" className="size-6" />
              </a>
            </div>
          </div>
          <ViewAllButton href="/podcast" onClick={handleViewAllClick} isMobile={isMobile} />
        </div>

        {/* Content */}
        {/* Phone deck: the original's 32 px arrows over the cards' edges; in landscape (four narrow cards) the cards are
            inset by the arrows' width so the arrows do not cover their text. */}
        <div className={cn('relative mt-3', !isMobile && 'pr-0', compact && totalCompactPages > 1 && 'shortScreen:px-6')}>
          {/* Desktop arrows */}
          {!isMobile && !compact && (
            <PCNavigationArrowButton onClick={handlePrev} disabled={isBeginning} direction="prev" className="-left-5" />
          )}

          {/* Compact mode arrows */}
          {compact && totalCompactPages > 1 && (
            <MobileNavigationArrowButton onClick={handleCompactPrev} disabled={isCompactBeginning} direction="prev" />
          )}

          {renderContent()}

          {!isMobile && !compact && (
            <PCNavigationArrowButton onClick={handleNext} disabled={isEnd} direction="next" className="-right-5" />
          )}

          {/* Compact mode arrows */}
          {compact && totalCompactPages > 1 && (
            <MobileNavigationArrowButton onClick={handleCompactNext} disabled={isCompactEnd} direction="next" />
          )}
        </div>
      </div>

      {/* Mobile Internal Pagination (not shown in compact mode) */}
      {isMobile && !compact && (
        <MobilePaginationDots totalPages={totalPages} currentPage={currentPage} onPageChange={handlePaginationClick} />
      )}
    </div>
  );
}
