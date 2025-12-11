'use client';

import { useState } from 'react';
import InsightNews, { NewsItem } from './InsightNews';
import Pagination from './Pagination';

const ITEMS_PER_PAGE = 4;
const MAX_ITEMS = 16;

// Mock data - 可以替换为实际数据
const mockNewsData: NewsItem[] = [
  {
    id: '1',
    title: 'Immortal Dragons Launch Fund I: $40m Purpose-Driven Longevity Fund',
    date: 'JUL 17, 2025',
    tag: 'New',
    url: 'https://finance.yahoo.com/news/immortal-dragons-launches-40m-longevity-211000083.html',
  },
  {
    id: '2',
    title: 'Immortal Dragons Invest In Etheros Pharmaceutical: Battling Oxidative Stress With Catalytic Antioxidants',
    date: 'JUL 17, 2025',
    tag: 'New',
    url: '#',
  },
  {
    id: '3',
    title: 'Immortal Dragons Back Frontier Bio: Insights Coverage On 3D Biofabrication',
    date: 'JUL 17, 2025',
    tag: 'Coverage',
    url: '#',
  },
  {
    id: '4',
    title: "Immortal Dragon's Featured Article In BioWorld",
    date: 'JUL 17, 2025',
    tag: 'New',
    url: '#',
  },
  {
    id: '5',
    title: 'Longevity Investment Trends: What Investors Need To Know',
    date: 'JUL 10, 2025',
    tag: 'Coverage',
    url: '#',
  },
  {
    id: '6',
    title: 'The Future of Anti-Aging Research: Expert Perspectives',
    date: 'JUL 10, 2025',
    tag: 'New',
    url: '#',
  },
  {
    id: '7',
    title: 'Breakthrough in Cellular Rejuvenation Technology',
    date: 'JUL 05, 2025',
    tag: 'New',
    url: '#',
  },
  {
    id: '8',
    title: 'Immortal Dragons Partners with Leading Research Institute',
    date: 'JUL 01, 2025',
    tag: 'Coverage',
    url: '#',
  },
];

export default function NewsSection() {
  const [currentPage, setCurrentPage] = useState(0);

  // 限制最多16个项目
  const newsData = mockNewsData.slice(0, MAX_ITEMS);
  const totalPages = Math.ceil(newsData.length / ITEMS_PER_PAGE);
  const currentItems = newsData.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

  return (
    <div className="flex h-full flex-col">
      <h2 className="font-oxanium text-2xl font-semibold uppercase">NEWS & COVERAGE</h2>

      <div className="mt-9 flex flex-1 flex-col justify-between">
        {currentItems.map((item) => (
          <InsightNews key={item.id} item={item} />
        ))}
      </div>

      <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  );
}
