'use client';

import { useRef, useState } from 'react';
import InsightNews, { NewsItem } from './InsightNews';
import Pagination from '@/app/insights/_components/Pagination';
import { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

const ITEMS_PER_PAGE = 4;
const MAX_ITEMS = 16;

type NewsSectionProps = {
  data?: NewsItem[];
  isLoading?: boolean;
  showPagination?: boolean;
};

export default function NewsSection({ data = [], isLoading, showPagination = true }: NewsSectionProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const swiperRef = useRef<SwiperType>();

  const newsData = data.slice(0, MAX_ITEMS);
  const totalPages = Math.ceil(newsData.length / ITEMS_PER_PAGE);

  const handlePaginationClick = (index: number) => {
    swiperRef.current?.slideTo(index);
    setCurrentPage(index);
  };

  const renderContent = () => {
    if (isLoading) {
      return Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="h-[6.5rem] animate-pulse rounded bg-gray-800/50" />
      ));
    }
    if (!showPagination) {
      return newsData.map((item) => <InsightNews key={item.id} item={item} />);
    }

    return (
      <Swiper
        className="h-full w-full"
        onSlideChange={(swiper) => setCurrentPage(swiper.activeIndex)}
        onBeforeInit={(swiper) => (swiperRef.current = swiper)}
        slidesPerView={1}
        spaceBetween={16}
      >
        {Array.from({ length: totalPages }).map((_, i) => (
          <SwiperSlide key={i} className="">
            <div className="flex h-full flex-col justify-between">
              {Array.from({ length: 4 }).map((_, index) => {
                const item = newsData[i * 4 + index];
                return item ? <InsightNews key={item.id} item={item} /> : <div key={index} className="h-[6.5rem]" />;
              })}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    );
  };

  return (
    <div className="flex h-full flex-col">
      <h2 className="font-oxanium text-2xl font-semibold uppercase">NEWS & COVERAGE</h2>
      <div className="mt-9 flex max-w-100 flex-1 flex-col justify-between mobile:gap-4">{renderContent()}</div>
      {showPagination && <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePaginationClick} />}
    </div>
  );
}
