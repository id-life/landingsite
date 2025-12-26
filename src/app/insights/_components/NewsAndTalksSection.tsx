'use client';

import React, { useRef, useState } from 'react';
import dayjs from 'dayjs';
import { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useMobileItemsPerPage } from '@/hooks/useMobileItemsPerPage';
import YouTubeThumbnail from '@/app/insights/_components/YouTubeThumbnail';
import VideoModal from '@/app/insights/_components/VideoModal';
import NavigationArrowButton from '@/app/insights/_components/NavigationArrowButton';
import MobilePaginationDots from '@/app/insights/_components/MobilePaginationDots';
import ViewAllButton from '@/app/insights/_components/ViewAllButton';
import { cn } from '@/utils';
import { InsightItem } from '@/hooks/insights/fetch';

type NewsAndTalksSectionProps = {
  items?: InsightItem[];
  isLoading?: boolean;
  isMobile?: boolean;
};

const ITEMS_PER_PAGE_DESKTOP = 8; // 4x2 grid
const ITEMS_PER_PAGE_MOBILE = 3;

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

  // Mobile layout: keep the overlay style
  if (isMobile) {
    return (
      <>
        <div className="group relative h-[9.25rem] cursor-pointer overflow-hidden rounded">
          <div className="absolute inset-0">
            <YouTubeThumbnail pic={thumbnailPic} videoId={item.videoId ?? ''} title={item.title} onClick={handleClick} />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-black" />
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-4">
            <div className="flex items-center gap-2 font-oxanium text-sm uppercase text-white">
              {item.publisher && (
                <>
                  <span className="text-white/80">{item.publisher}</span>
                  <span className="text-white/50">·</span>
                </>
              )}
              {item.publishDate && <span>{dayjs(item.publishDate).format('MMM DD, YYYY')}</span>}
            </div>
            <h3 className="mt-1 line-clamp-2 font-poppins text-lg/6 font-medium text-white">{item.title}</h3>
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

export default function NewsAndTalksSection({ items = [], isLoading, isMobile = false }: NewsAndTalksSectionProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef<SwiperType>();
  const containerRef = useRef<HTMLDivElement>(null);
  const mobileItemsPerPage = useMobileItemsPerPage(containerRef, isMobile);
  const itemsPerPage = isMobile ? mobileItemsPerPage : ITEMS_PER_PAGE_DESKTOP;

  const totalPages = Math.ceil(items.length / itemsPerPage);

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
    window.open('/news', '_blank');
  };

  const renderContent = () => {
    if (isLoading) {
      if (isMobile) {
        return (
          <div className="flex flex-col gap-5">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="h-[148px] animate-pulse rounded bg-gray-800/50" />
            ))}
          </div>
        );
      }
      // Desktop loading: 4x2 grid skeleton
      return (
        <div className="grid grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex flex-col">
              <div className="h-[148px] animate-pulse rounded bg-gray-800/50" />
              <div className="mt-0 space-y-2 border-2 border-white bg-white/50 p-3">
                <div className="h-12 animate-pulse rounded bg-gray-800/30" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-gray-800/20" />
              </div>
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
          onSlideChange={(swiper) => setCurrentPage(swiper.activeIndex)}
          onBeforeInit={(swiper) => (swiperRef.current = swiper)}
          slidesPerView={1}
          spaceBetween={16}
        >
          {Array.from({ length: totalPages }).map((_, pageIndex) => {
            const pageItems = items.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage);

            return (
              <SwiperSlide key={pageIndex}>
                <div className="flex flex-col gap-5">
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
          setCurrentPage(swiper.activeIndex);
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
    <div ref={containerRef} className="flex h-full flex-col">
      {/* Mobile: wrap header + content for vertical centering */}
      <div className={cn(isMobile ? 'flex flex-1 flex-col justify-center overflow-hidden' : 'flex flex-1 flex-col')}>
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
            <NavigationArrowButton onClick={handlePrev} disabled={isBeginning} direction="prev" />
          )}

          {renderContent()}

          {/* Desktop right arrow */}
          {!isMobile && totalPages > 1 && <NavigationArrowButton onClick={handleNext} disabled={isEnd} direction="next" />}
        </div>
      </div>

      {/* Mobile Pagination only */}
      {isMobile && (
        <MobilePaginationDots totalPages={totalPages} currentPage={currentPage} onPageChange={handlePaginationClick} />
      )}
    </div>
  );
}
