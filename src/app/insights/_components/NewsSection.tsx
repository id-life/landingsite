'use client';

import { useState } from 'react';
import InsightNews, { NewsItem } from './InsightNews';

const ITEMS_PER_PAGE = 4;
const MAX_ITEMS = 16;

type NewsSectionProps = {
  data?: NewsItem[];
  isLoading?: boolean;
};

export default function NewsSection({ data = [], isLoading }: NewsSectionProps) {
  const [currentPage, setCurrentPage] = useState(0);

  // 限制最多16个项目
  const newsData = data.slice(0, MAX_ITEMS);
  const totalPages = Math.ceil(newsData.length / ITEMS_PER_PAGE);
  const currentItems = newsData.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

  return (
    <div className="flex h-full flex-col">
      <h2 className="font-oxanium text-2xl font-semibold uppercase">NEWS & COVERAGE</h2>

      <div className="mt-9 flex flex-1 flex-col justify-between">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-[6.5rem] animate-pulse rounded bg-gray-800/50" />
            ))
          : Array.from({ length: 4 }).map((_, index) => {
              const item = currentItems[index];
              return item ? <InsightNews key={item.id} item={item} /> : <div key={index} className="h-[6.5rem]" />;
            })}
      </div>
    </div>
  );
}
