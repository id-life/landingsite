'use client';

import { useState } from 'react';
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
};

const ITEMS_PER_PAGE = 3;

type TalksSectionProps = {
  data?: TalkItem[];
  isLoading?: boolean;
};

export default function TalksSection({ data = [], isLoading }: TalksSectionProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const currentItems = data.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

  return (
    <div className="flex h-full flex-col">
      <h2 className="font-oxanium text-2xl font-semibold uppercase">TALKS & ESSAYS</h2>

      <div className="mt-9 flex flex-1 flex-col justify-between">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex h-42 gap-5">
                <div className="h-42 w-75 animate-pulse rounded bg-gray-800/50" />
                <div className="flex flex-1 flex-col justify-between py-1">
                  <div className="h-6 w-3/4 animate-pulse rounded bg-gray-800/50" />
                  <div className="h-4 w-1/4 animate-pulse rounded bg-gray-800/50" />
                </div>
              </div>
            ))
          : Array.from({ length: 3 }).map((_, index) => {
              const item = currentItems[index];
              return item ? <TalkCard key={item.id} item={item} /> : <div key={index} className="h-42" />;
            })}
      </div>

      <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  );
}
