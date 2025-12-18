'use client';

import React, { useRef, useState } from 'react';
import dayjs from 'dayjs';
import { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Pagination from './Pagination';
import { TalkItem } from './TalksSection';
import { NewsItem } from './InsightNews';
import ViewAllBorderSVG from '@/../public/svgs/podcast/view-all-border.svg?component';
import RightSVG from '@/../public/svgs/podcast/right.svg?component';
import YouTubeThumbnail from '@/app/insights/_components/YouTubeThumbnail';

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
};

const ITEMS_PER_PAGE = 3;

function NewsCard({ item, variant = 'small' }: { item: CombinedItem; variant?: 'large' | 'small' }) {
  const handleClick = () => {
    window.open(item.url, '_blank');
  };

  const isLarge = variant === 'large';

  return (
    <div className={`group relative cursor-pointer overflow-hidden rounded ${isLarge ? 'h-full' : 'h-[calc(50%-0.5rem)]'}`}>
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
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-6">
        <span className="mb-2 font-oxanium text-base uppercase text-white">{dayjs(item.date).format('MMM DD, YYYY')}</span>
        <h3
          className={`font-poppins font-semibold text-white ${isLarge ? 'line-clamp-3 text-xl/6' : 'line-clamp-2 text-base/5'}`}
        >
          {item.title}
        </h3>
      </div>
    </div>
  );
}

export default function NewsAndTalksSection({ news = [], talks = [], isLoading }: NewsAndTalksSectionProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const swiperRef = useRef<SwiperType>();

  // Combine news and talks into a single array, sorted by date
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

  const totalPages = Math.ceil(combinedData.length / ITEMS_PER_PAGE);

  const handlePaginationClick = (index: number) => {
    swiperRef.current?.slideTo(index);
    setCurrentPage(index);
  };

  const handleViewAllClick = () => {
    window.open('/news', '_blank');
  };

  const renderContent = () => {
    if (isLoading) {
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
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <h2 className="font-oxanium text-2xl font-semibold uppercase">NEWS & TALKS</h2>
        <div
          onClick={handleViewAllClick}
          className="group relative flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-base font-semibold"
        >
          <ViewAllBorderSVG className="absolute left-0 top-0 h-full w-full fill-black group-hover:fill-red-600" />
          <p className="group-hover:text-red-600">VIEW ALL</p>
          <RightSVG key="view-all" className="w-5 fill-black group-hover:fill-red-600" />
        </div>
      </div>

      <div className="mt-6 h-[16.25rem] flex-1">{renderContent()}</div>
      <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePaginationClick} />
    </div>
  );
}
