'use client';

import { useRef, useState } from 'react';
import { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Pagination from './Pagination';
import TalkCard from '@/app/insights/_components/TalkCard';
import { InsightsCategory } from '@/apis/types';

export type TalkItem = {
  id: number;
  title: string;
  description: string;
  videoId: string;
  url: string;
  date: string;
  essayPic?: string | null;
  category?: InsightsCategory;
  sequence: number;
};

const ITEMS_PER_PAGE = 3;

type TalksSectionProps = {
  data?: TalkItem[];
  isLoading?: boolean;
  showPagination?: boolean;
};

export default function TalksSection({ data = [], isLoading, showPagination = true }: TalksSectionProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const swiperRef = useRef<SwiperType>();

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const handlePaginationClick = (index: number) => {
    swiperRef.current?.slideTo(index);
    setCurrentPage(index);
  };

  const renderContent = () => {
    if (isLoading) {
      return Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex h-42 gap-5">
          <div className="h-42 w-75 animate-pulse rounded bg-gray-800/50" />
          <div className="flex flex-1 flex-col justify-between py-1">
            <div className="h-6 w-3/4 animate-pulse rounded bg-gray-800/50" />
            <div className="h-4 w-1/4 animate-pulse rounded bg-gray-800/50" />
          </div>
        </div>
      ));
    }

    if (!showPagination) {
      return data.map((item) => <TalkCard key={item.id} item={item} />);
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
          <SwiperSlide key={i}>
            <div className="flex h-full flex-col justify-between">
              {Array.from({ length: 3 }).map((_, index) => {
                const item = data[i * ITEMS_PER_PAGE + index];
                return item ? <TalkCard key={item.id} item={item} /> : <div key={index} className="h-42" />;
              })}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    );
  };

  return (
    <div className="flex h-full flex-col">
      <h2 className="font-oxanium text-2xl font-semibold uppercase">TALKS & ESSAYS</h2>
      <div className="mt-9 flex max-w-[40.25rem] flex-1 flex-col justify-between mobile:gap-4">{renderContent()}</div>
      {showPagination && <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePaginationClick} />}
    </div>
  );
}
