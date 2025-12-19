'use client';

import React, { useRef, useState } from 'react';
import dayjs from 'dayjs';
import { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Pagination from './Pagination';
import { TalkItem } from './TalksSection';
import { NewsItem } from './InsightNews';
import { useMobileItemsPerPage } from '@/hooks/useMobileItemsPerPage';
import ViewAllBorderSVG from '@/../public/svgs/podcast/view-all-border.svg?component';
import RightSVG from '@/../public/svgs/podcast/right.svg?component';
import YouTubeThumbnail from '@/app/insights/_components/YouTubeThumbnail';
import { cn } from '@/utils';

type CombinedItem = {
  id: number;
  title: string;
  date: string;
  url: string;
  image?: string | null;
  type: 'news' | 'talk';
  videoId?: string;
  sequence: number;
};

type NewsAndTalksSectionProps = {
  news?: NewsItem[];
  talks?: TalkItem[];
  isLoading?: boolean;
  isMobile?: boolean;
};

const ITEMS_PER_PAGE = 3;

function NewsCard({
  item,
  variant = 'small',
  isMobile = false,
}: {
  item: CombinedItem;
  variant?: 'large' | 'small';
  isMobile?: boolean;
}) {
  const handleClick = () => {
    window.open(item.url, '_blank');
  };

  const isLarge = variant === 'large' && !isMobile;

  // Mobile: fixed height, same for all cards
  // Desktop: large card fills container, small cards are half height
  const cardHeightClass = isMobile ? 'h-[186px]' : isLarge ? 'h-full' : 'h-[calc(50%-0.5rem)]';

  return (
    <div className={`group relative cursor-pointer overflow-hidden rounded ${cardHeightClass}`}>
      {/* YouTubeThumbnail fills the container absolutely */}
      <div className="absolute inset-0">
        <YouTubeThumbnail
          pic={'https://cdn1.p12.games/p12-news/NplPQeEGomBkvng0'}
          videoId={item.videoId ?? ''}
          title={item.title}
          onClick={handleClick}
        />
      </div>
      {/* Gradient and text overlay - pointer-events-none to allow hover through */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0',
          isMobile
            ? 'bg-gradient-to-b from-transparent to-black'
            : 'bg-gradient-to-t from-black/80 via-black/20 to-transparent',
        )}
      />
      <div className={cn('pointer-events-none absolute inset-0 flex flex-col justify-end', isMobile ? 'p-4' : 'p-6')}>
        <span className={cn('font-oxanium uppercase text-white', isMobile ? 'text-base leading-6' : 'mb-2 text-base')}>
          {dayjs(item.date).format('MMM DD, YYYY')}
        </span>
        <h3
          className={cn(
            'font-poppins font-semibold text-white',
            isMobile
              ? 'mt-1 line-clamp-2 text-base font-medium leading-5'
              : isLarge
                ? 'line-clamp-3 text-xl/6'
                : 'line-clamp-2 text-base/5',
          )}
        >
          {item.title}
        </h3>
      </div>
    </div>
  );
}

export default function NewsAndTalksSection({ news = [], talks = [], isLoading, isMobile = false }: NewsAndTalksSectionProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const swiperRef = useRef<SwiperType>();
  const containerRef = useRef<HTMLDivElement>(null);
  const mobileItemsPerPage = useMobileItemsPerPage(containerRef, isMobile);
  const itemsPerPage = isMobile ? mobileItemsPerPage : ITEMS_PER_PAGE;

  // Combine news and talks into a single array, sorted by sequence
  const combinedData: CombinedItem[] = [
    ...talks.map((talk) => ({
      id: talk.id,
      title: talk.title,
      date: talk.date,
      url: talk.url,
      image: talk.essayPic,
      type: 'talk' as const,
      videoId: talk.videoId,
      sequence: talk.sequence,
    })),
    ...news.map((n) => ({
      id: n.id + 10000, // Offset to avoid ID collision
      title: n.title,
      date: n.date,
      url: n.url,
      image: null,
      type: 'news' as const,
      sequence: n.sequence,
    })),
  ].sort((a, b) => a.sequence - b.sequence);

  const totalPages = Math.ceil(combinedData.length / itemsPerPage);

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
              <div key={index} className="h-[186px] animate-pulse rounded bg-gray-800/50" />
            ))}
          </div>
        );
      }
      return (
        <div className="flex h-full gap-4">
          <div className="h-full flex-1 animate-pulse rounded bg-gray-800/50" />
          <div className="flex h-full w-[19rem] flex-col gap-4">
            <div className="h-1/2 animate-pulse rounded bg-gray-800/50" />
            <div className="h-1/2 animate-pulse rounded bg-gray-800/50" />
          </div>
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
            const pageItems = combinedData.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage);

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

    // Desktop layout: 1 large + 2 small per page
    return (
      <Swiper
        className="h-full w-full"
        onSlideChange={(swiper) => setCurrentPage(swiper.activeIndex)}
        onBeforeInit={(swiper) => (swiperRef.current = swiper)}
        slidesPerView={1}
        spaceBetween={16}
      >
        {Array.from({ length: totalPages }).map((_, pageIndex) => {
          const pageItems = combinedData.slice(pageIndex * ITEMS_PER_PAGE, (pageIndex + 1) * ITEMS_PER_PAGE);
          const [mainItem, ...sideItems] = pageItems;

          return (
            <SwiperSlide key={pageIndex}>
              <div className="flex h-full gap-4">
                {mainItem && (
                  <div className="h-full flex-1">
                    <NewsCard item={mainItem} variant="large" />
                  </div>
                )}
                <div className="flex h-full w-[19rem] flex-col gap-4">
                  {sideItems.map((item) => (
                    <NewsCard key={item.id} item={item} variant="small" />
                  ))}
                  {sideItems.length < 2 &&
                    Array.from({ length: 2 - sideItems.length }).map((_, i) => (
                      <div key={`empty-${i}`} className="h-[calc(50%-0.5rem)]" />
                    ))}
                </div>
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
          <h2 className={cn('font-oxanium text-2xl font-semibold uppercase', isMobile && 'text-[26px] leading-9')}>
            NEWS & TALKS
          </h2>
          <div
            onClick={handleViewAllClick}
            className={cn(
              'group relative flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-base font-semibold',
              isMobile && 'px-2 py-1.5 text-sm',
            )}
          >
            <ViewAllBorderSVG
              className={cn(
                'absolute left-0 top-0 h-full w-full fill-black group-hover:fill-red-600',
                isMobile && 'fill-red-600',
              )}
            />
            <p className={cn('group-hover:text-red-600', isMobile && 'text-red-600')}>VIEW ALL</p>
            <RightSVG
              key="view-all"
              className={cn('w-5 fill-black group-hover:fill-red-600', isMobile && 'w-3.5 fill-red-600')}
            />
          </div>
        </div>

        {/* Content */}
        <div className={cn('mt-5', !isMobile && 'h-[16.25rem] flex-1')}>{renderContent()}</div>
      </div>

      {/* Pagination */}
      {isMobile ? (
        totalPages > 1 && (
          <div className="flex-center gap-2 py-4">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => handlePaginationClick(index)}
                className={cn('h-0.5 w-6 transition-all duration-300', {
                  'bg-foreground': index === currentPage,
                  'bg-gray-250': index !== currentPage,
                })}
              />
            ))}
          </div>
        )
      ) : (
        <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePaginationClick} />
      )}
    </div>
  );
}
