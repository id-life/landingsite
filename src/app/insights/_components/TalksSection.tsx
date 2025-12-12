'use client';

import { useState } from 'react';
import Pagination from './Pagination';
import TalkCard from '@/app/insights/_components/TalkCard';

export type TalkItem = {
  id: string;
  title: string;
  description: string;
  videoId: string;
  url: string;
  date: string;
};

// Mock data - 可以替换为实际数据
const mockTalksData: TalkItem[] = [
  {
    id: '1',
    title: 'The Future of Longevity Science',
    description: 'A deep exploration into cutting-edge research transforming our understanding of aging and healthspan.',
    videoId: 'NFSqoVjI54w',
    url: 'https://www.youtube.com/watch?v=NFSqoVjI54w',
    date: 'JUL 17, 2025',
  },
  {
    id: '2',
    title: 'Investment Strategies in Biotech',
    description: 'Key insights on navigating the complex landscape of biotechnology investments for maximum impact.',
    videoId: 'NFSqoVjI54w',
    url: 'https://www.youtube.com/watch?v=NFSqoVjI54w',
    date: 'JUL 17, 2025',
  },
  {
    id: '3',
    title: 'Cellular Rejuvenation Breakthroughs',
    description: 'Examining the latest advancements in cellular reprogramming and their implications for human health.',
    videoId: 'NFSqoVjI54w',
    url: 'https://www.youtube.com/watch?v=NFSqoVjI54w',
    date: 'JUL 17, 2025',
  },
  {
    id: '4',
    title: 'AI in Drug Discovery',
    description: 'How artificial intelligence is revolutionizing the pharmaceutical industry and accelerating innovation.',
    videoId: 'NFSqoVjI54w',
    url: 'https://www.youtube.com/watch?v=NFSqoVjI54w',
    date: 'JUL 17, 2025',
  },
  {
    id: '5',
    title: 'AI in Drug Discovery',
    description: 'How artificial intelligence is revolutionizing the pharmaceutical industry and accelerating innovation.',
    videoId: 'NFSqoVjI54w',
    url: 'https://www.youtube.com/watch?v=NFSqoVjI54w',
    date: 'JUL 17, 2025',
  },
];

const ITEMS_PER_PAGE = 3;

export default function TalksSection() {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(mockTalksData.length / ITEMS_PER_PAGE);
  const currentItems = mockTalksData.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

  return (
    <div className="flex h-full flex-col">
      <h2 className="font-oxanium text-2xl font-semibold uppercase">TALKS & ESSAYS</h2>

      <div className="mt-9 flex flex-1 flex-col justify-between">
        {Array.from({ length: 3 }).map((_, index) => {
          const item = currentItems[index];
          return item ? <TalkCard key={item.id} item={item} /> : <div key={index} className="h-[7.5rem]" />;
        })}
      </div>

      <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  );
}
