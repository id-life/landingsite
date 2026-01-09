'use client';

import { useCallback, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import YouTubeThumbnail from '@/app/insights/_components/YouTubeThumbnail';
import VideoModal from '@/app/insights/_components/VideoModal';
import { PCNavigationArrowButton, MobileNavigationArrowButton } from '@/app/insights/_components/NavigationArrowButton';
import ViewAllButton from '@/app/insights/_components/ViewAllButton';
import { cn } from '@/utils';
import { InsightItem } from '@/hooks/insights/fetch';
import { useContainerResize } from '@/hooks/useContainerResize';
import { useWindowResize } from '@/hooks/useWindowResize';
import { useRouter } from 'next/navigation';

type NewsAndTalksSectionProps = {
  items?: InsightItem[];
  isLoading?: boolean;
  isMobile?: boolean;
};

const ITEMS_PER_PAGE_DESKTOP = 8; // 4x2 grid

function NewsCard({ item, isMobile = false }: { item: InsightItem; isMobile?: boolean }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isYouTube = !!item.videoId;

  const handleClick = () => {
    if (isYouTube) {
      setIsModalOpen(true);
    } else if (item?.url) {
      // For internal links (starting with /), use same tab; for external links, open new tab
      if (item.url.startsWith('/')) {
        window.location.href = item.url;
      } else {
        window.open(item.url, '_blank');
      }
    }
  };

  // Use imageUrl if available, otherwise fallback for YouTube videos
  const thumbnailPic = item.imageUrl ?? '';

  // Mobile layout: card style matching Figma design
  if (isMobile) {
    return (
      <>
        <div className="group flex cursor-pointer flex-col overflow-hidden" onClick={handleClick}>
          {/* Image */}
          <div className="relative h-[4.25rem] w-full overflow-hidden">
            <YouTubeThumbnail pic={thumbnailPic} videoId={item.videoId ?? ''} title={item.title} onClick={handleClick} />
          </div>
          {/* Card content */}
          <div className="flex flex-col gap-0.5 bg-white p-2 pt-1.5">
            <h3 className="line-clamp-1 font-poppins text-xs/4 font-medium text-black">{item.title}</h3>
            <div className="flex w-full flex-col text-left font-poppins text-[10px]/3 text-black/40">
              {item.publisher && <p className="line-clamp-1">{item.publisher}</p>}
              {item.publishDate ? <p>{dayjs(item.publishDate).format('MMM DD, YYYY')}</p> : <br />}
            </div>
          </div>
        </div>
        {isYouTube && (
          <VideoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} videoId={item.videoId!} title={item.title} />
        )}
      </>
    );
  }

  // Desktop layout: vertical card with image on top, text below
  return (
    <>
      <div className="group flex cursor-pointer flex-col overflow-hidden" onClick={handleClick}>
        {/* Image */}
        <div className="relative h-[9.25rem] w-full overflow-hidden">
          <YouTubeThumbnail pic={thumbnailPic} videoId={item.videoId ?? ''} title={item.title} onClick={handleClick} />
        </div>
        {/* Card content */}
        <div className="flex flex-col gap-3 bg-white/80 p-4 backdrop-blur-sm">
          <h3 className="line-clamp-2 font-poppins text-lg/6 font-semibold text-black desktop:line-clamp-1">{item.title}</h3>
          <div className="flex items-center gap-1.5 font-poppins text-sm/5 font-medium text-black/40">
            {item.publisher && <span>{item.publisher}</span>}
            {item.publisher && item.publishDate && <span>·</span>}
            {item.publishDate && <span>{dayjs(item.publishDate).format('MMM DD, YYYY')}</span>}
          </div>
        </div>
      </div>
      {isYouTube && (
        <VideoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} videoId={item.videoId!} title={item.title} />
      )}
    </>
  );
}

// Constants for dynamic calculation (in pixels)
const NEWS_HEADER_HEIGHT = 44; // Header text height
const NEWS_CONTENT_GAP = 20; // mt-5 gap between header and content
const PODCAST_SECTION_HEIGHT = 128; // Header (44px) + gap (12px) + 1 row of cards (72px)
const SECTION_GAP = 24; // gap-6 between News and Podcast sections
const NEWS_CARD_ROW_HEIGHT = 124; // Card: image (68px) + content padding + text (56px)
const NEWS_CARD_GAP = 10; // gap-y-2.5 between rows

function calculateMobileItemCount(containerHeight: number): number {
  // Available height for news content (cards area only)
  const availableForNews = containerHeight - NEWS_HEADER_HEIGHT - NEWS_CONTENT_GAP - SECTION_GAP - PODCAST_SECTION_HEIGHT;

  // Calculate how many rows fit: first row is just row height, each additional adds gap + row
  // Formula: availableForNews >= rows * NEWS_CARD_ROW_HEIGHT + (rows - 1) * NEWS_CARD_GAP
  // Simplified: availableForNews >= rows * (NEWS_CARD_ROW_HEIGHT + NEWS_CARD_GAP) - NEWS_CARD_GAP
  const rows = Math.floor((availableForNews + NEWS_CARD_GAP) / (NEWS_CARD_ROW_HEIGHT + NEWS_CARD_GAP));

  // Clamp between 2 and 4 rows
  const clampedRows = Math.max(2, Math.min(4, rows));
  return clampedRows * 2; // 2 columns
}

export default function NewsAndTalksSection({ items = [], isLoading, isMobile = false }: NewsAndTalksSectionProps) {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [isMobileBeginning, setIsMobileBeginning] = useState(true);
  const [isMobileEnd, setIsMobileEnd] = useState(false);
  const [mobileItemCount, setMobileItemCount] = useState(8); // Default to max
  const swiperRef = useRef<SwiperType>();
  const mobileSwiperRef = useRef<SwiperType>();
  const containerRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE_DESKTOP);
  const totalMobilePages = Math.ceil(items.length / mobileItemCount);
  const router = useRouter();

  const containerResizeCallback = useCallback(
    (entry: ResizeObserverEntry) => {
      if (!isMobile) return;
      const containerHeight = entry.contentRect.height;
      const count = calculateMobileItemCount(containerHeight);
      setMobileItemCount(count);
    },
    [isMobile],
  );

  // Mobile: calculate items based on container height (using ResizeObserver)
  useContainerResize(containerRef, containerResizeCallback, '.mobile-insights-content');

  const windowResizeCallback = useCallback(() => {
    if (!isMobile) return;

    // Only use this fallback if parent container doesn't exist
    const parentContainer = containerRef.current?.closest('.mobile-insights-content');
    if (parentContainer) return;

    const viewportHeight = window.innerHeight;
    const containerHeight = viewportHeight - 140 - 80;
    const count = calculateMobileItemCount(containerHeight);
    setMobileItemCount(count);
  }, [isMobile]);

  // Mobile: fallback to window resize if parent container is not found
  useWindowResize(windowResizeCallback);

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  const handleMobilePrev = () => {
    mobileSwiperRef.current?.slidePrev();
  };

  const handleMobileNext = () => {
    mobileSwiperRef.current?.slideNext();
  };

  const handleViewAllClick = () => {
    if (isMobile) router.push('/news');
    else window.open('/news', '_blank');
  };

  const renderContent = () => {
    if (isLoading) {
      if (isMobile) {
        // Show skeleton based on calculated item count (default 8 initially)
        const skeletonCount = mobileItemCount || 8;
        return (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: skeletonCount }).map((_, index) => (
              <div key={index} className="flex flex-col overflow-hidden">
                <div className="h-[68px] w-full animate-pulse bg-gray-800/50" />
                <div className="space-y-1 bg-white p-3">
                  <div className="h-4 w-3/4 animate-pulse bg-gray-800/30" />
                  <div className="h-3 w-1/2 animate-pulse bg-gray-800/20" />
                </div>
              </div>
            ))}
          </div>
        );
      }
      // Desktop loading: 4x2 grid skeleton
      return (
        <div className="grid grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex flex-col">
              <div className="h-[148px] animate-pulse bg-gray-800/50" />
              <div className="mt-0 space-y-2 border-2 border-white bg-white/50 p-3">
                <div className="h-12 animate-pulse bg-gray-800/30" />
                <div className="h-4 w-2/3 animate-pulse bg-gray-800/20" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Mobile layout: Swiper with 2-column grid pages (2×3 or 2×2 based on screen height)
    if (isMobile) {
      return (
        <Swiper
          className="h-full w-full"
          onSlideChange={(swiper) => {
            setIsMobileBeginning(swiper.isBeginning);
            setIsMobileEnd(swiper.isEnd);
          }}
          onBeforeInit={(swiper) => (mobileSwiperRef.current = swiper)}
          slidesPerView={1}
          spaceBetween={16}
        >
          {Array.from({ length: totalMobilePages }).map((_, pageIndex) => {
            const pageItems = items.slice(pageIndex * mobileItemCount, (pageIndex + 1) * mobileItemCount);
            return (
              <SwiperSlide key={pageIndex}>
                <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
                  {pageItems.map((item) => (
                    <NewsCard key={item.id} item={item} isMobile />
                  ))}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      );
    }

    // Desktop layout: 4x2 grid per page
    return (
      <Swiper
        className="h-full w-full"
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        onBeforeInit={(swiper) => (swiperRef.current = swiper)}
        slidesPerView={1}
        spaceBetween={24}
      >
        {Array.from({ length: totalPages }).map((_, pageIndex) => {
          const pageItems = items.slice(pageIndex * ITEMS_PER_PAGE_DESKTOP, (pageIndex + 1) * ITEMS_PER_PAGE_DESKTOP);

          return (
            <SwiperSlide key={pageIndex}>
              <div className="grid grid-cols-4 gap-4">
                {pageItems.map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    );
  };

  return (
    <div ref={containerRef} className="flex h-full flex-col mobile:h-auto">
      {/* Mobile: wrap header + content for vertical centering */}
      <div className={cn(isMobile ? 'flex flex-col' : 'flex flex-1 flex-col')}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className={cn('font-oxanium text-[1.625rem]/9 font-semibold uppercase', isMobile && 'text-[26px] leading-9')}>
            NEWS & TALKS
          </h2>
          <ViewAllButton onClick={handleViewAllClick} isMobile={isMobile} />
        </div>

        {/* Content with arrow navigation */}
        <div className={cn('relative mt-5', !isMobile && 'flex-1')}>
          {/* Desktop left arrow */}
          {!isMobile && totalPages > 1 && (
            <PCNavigationArrowButton onClick={handlePrev} disabled={isBeginning} direction="prev" />
          )}

          {/* Mobile left arrow */}
          {isMobile && totalMobilePages > 1 && (
            <MobileNavigationArrowButton onClick={handleMobilePrev} disabled={isMobileBeginning} direction="prev" />
          )}

          {renderContent()}

          {/* Desktop right arrow */}
          {!isMobile && totalPages > 1 && <PCNavigationArrowButton onClick={handleNext} disabled={isEnd} direction="next" />}

          {/* Mobile right arrow */}
          {isMobile && totalMobilePages > 1 && (
            <MobileNavigationArrowButton onClick={handleMobileNext} disabled={isMobileEnd} direction="next" />
          )}
        </div>
      </div>
    </div>
  );
}
