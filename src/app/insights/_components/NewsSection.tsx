'use client';

import { useState } from 'react';
import InsightNews, { NewsItem } from './InsightNews';
import Pagination from '@/app/insights/_components/Pagination';

const ITEMS_PER_PAGE = 4;
const MAX_ITEMS = 16;

type NewsSectionProps = {
  data?: NewsItem[];
  isLoading?: boolean;
  showPagination?: boolean;
};

export default function NewsSection({ data = [], isLoading, showPagination = true }: NewsSectionProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const newsData = data.slice(0, MAX_ITEMS);
  const totalPages = Math.ceil(newsData.length / ITEMS_PER_PAGE);
  const currentItems = showPagination
    ? newsData.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE)
    : newsData;

  return (
    <div className="flex h-full flex-col">
      <h2 className="font-oxanium text-2xl font-semibold uppercase">NEWS & COVERAGE</h2>

      <div className="mt-9 flex flex-1 flex-col justify-between mobile:gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-[6.5rem] animate-pulse rounded bg-gray-800/50" />
            ))
          : showPagination
            ? Array.from({ length: 4 }).map((_, index) => {
                const item = currentItems[index];
                return item ? <InsightNews key={item.id} item={item} /> : <div key={index} className="h-[6.5rem]" />;
              })
            : currentItems.map((item) => <InsightNews key={item.id} item={item} />)}
      </div>

      {showPagination && <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />}
    </div>
  );
}
