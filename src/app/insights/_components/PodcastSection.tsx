'use client';

import { useState } from 'react';
import Pagination from './Pagination';
import { PodcastCard } from '@/app/insights/_components/PodcastCard';

export type PodcastItem = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  date: string;
  xyzLink?: string;
  spotifyLink?: string;
  podcastLink?: string;
};

// Mock data - 可以替换为实际数据
const mockPodcastData: PodcastItem[] = [
  {
    id: '1',
    title: '伟.哥 | 从不举到不老的营销神话 (肉身实测)',
    subtitle: '不朽真龙 Immortal Dragons · 《医药群星》',
    description:
      '本期《医药群星》讲述蓝色小药丸“伟哥”如何从心绞痛废案逆袭为改写性生活与制药史的神药，并由此牵出中美舆论、专利水货之争以及长寿经济和 EHS 自测等话题。',
    date: 'Nov 20, 2025',
    duration: '01:10:20',
    xyzLink: '#',
    spotifyLink: '#',
    podcastLink: '#',
  },
  {
    id: '2',
    title: '伟.哥 | 从不举到不老的营销神话 (肉身实测)',
    subtitle: '不朽真龙 Immortal Dragons · 《医药群星》',
    description:
      '本期《医药群星》讲述蓝色小药丸“伟哥”如何从心绞痛废案逆袭为改写性生活与制药史的神药，并由此牵出中美舆论、专利水货之争以及长寿经济和 EHS 自测等话题。',
    date: 'Nov 20, 2025',
    duration: '01:10:20',
    xyzLink: '#',
    spotifyLink: '#',
    podcastLink: '#',
  },
  {
    id: '3',
    title: '伟.哥 | 从不举到不老的营销神话 (肉身实测)',
    subtitle: '不朽真龙 Immortal Dragons · 《医药群星》',
    description:
      '本期《医药群星》讲述蓝色小药丸“伟哥”如何从心绞痛废案逆袭为改写性生活与制药史的神药，并由此牵出中美舆论、专利水货之争以及长寿经济和 EHS 自测等话题。',
    date: 'Nov 20, 2025',
    duration: '01:10:20',
    xyzLink: '#',
    spotifyLink: '#',
    podcastLink: '#',
  },
  {
    id: '4',
    title: '伟.哥 | 从不举到不老的营销神话 (肉身实测)',
    subtitle: '不朽真龙 Immortal Dragons · 《医药群星》',
    description:
      '本期《医药群星》讲述蓝色小药丸“伟哥”如何从心绞痛废案逆袭为改写性生活与制药史的神药，并由此牵出中美舆论、专利水货之争以及长寿经济和 EHS 自测等话题。',
    date: 'Nov 20, 2025',
    duration: '01:10:20',
    xyzLink: '#',
    spotifyLink: '#',
    podcastLink: '#',
  },
  {
    id: '5',
    title: '伟.哥 | 从不举到不老的营销神话 (肉身实测)',
    subtitle: '不朽真龙 Immortal Dragons · 《医药群星》',
    description:
      '本期《医药群星》讲述蓝色小药丸“伟哥”如何从心绞痛废案逆袭为改写性生活与制药史的神药，并由此牵出中美舆论、专利水货之争以及长寿经济和 EHS 自测等话题。',
    date: 'Nov 20, 2025',
    duration: '01:10:20',
    xyzLink: '#',
    spotifyLink: '#',
    podcastLink: '#',
  },
];

const ITEMS_PER_PAGE = 3;

export default function PodcastSection() {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(mockPodcastData.length / ITEMS_PER_PAGE);
  const currentItems = mockPodcastData.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

  return (
    <div className="flex h-full flex-col">
      <h2 className="font-oxanium text-2xl font-semibold uppercase">PODCAST</h2>

      <div className="mt-9 flex flex-1 flex-col justify-between gap-4">
        {Array.from({ length: 3 }).map((_, index) => {
          const item = currentItems[index];
          return item ? <PodcastCard key={item.id} item={item} /> : <div key={index} className="h-[7.5rem]" />;
        })}
      </div>

      <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  );
}
