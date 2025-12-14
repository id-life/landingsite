'use client';

import { useState, useMemo } from 'react';
import Pagination from './Pagination';
import { PodcastCard } from '@/app/insights/_components/PodcastCard';
import { PodcastItem as APIPodcastItem } from '@/apis/types';

export type PodcastItem = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  date: string;
  xyzLink?: string;
  spotifyLink?: string;
  podcastLink?: string;
};

const ITEMS_PER_PAGE = 3;

// Helper function to format duration from seconds to HH:MM:SS
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

type PodcastSectionProps = {
  data?: APIPodcastItem[];
  isLoading?: boolean;
};

export default function PodcastSection({ data = [], isLoading }: PodcastSectionProps) {
  const [currentPage, setCurrentPage] = useState(0);

  // Transform API data to component format
  const podcastData = useMemo(() => {
    return data.map((item) => ({
      id: String(item.id),
      title: item.title,
      subtitle: `${item.artist || '不朽真龙 Immortal Dragons'} · ${item.album}`,
      description: item.description,
      duration: formatDuration(item.duration),
      date: new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      xyzLink: item.xyzLink || undefined,
      spotifyLink: item.spotifyLink || undefined,
      podcastLink: item.podcastLink || undefined,
    }));
  }, [data]);

  const totalPages = Math.ceil(podcastData.length / ITEMS_PER_PAGE);
  const currentItems = podcastData.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

  return (
    <div className="flex h-full flex-col">
      <h2 className="font-oxanium text-2xl font-semibold uppercase">PODCAST</h2>

      <div className="mt-9 flex flex-1 flex-col justify-between gap-4">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="h-6 w-3/4 animate-pulse rounded bg-gray-800/50" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-gray-800/50" />
                  </div>
                  <div className="h-11 w-11 animate-pulse rounded bg-gray-800/50" />
                </div>
                <div className="h-16 animate-pulse rounded bg-gray-800/50" />
              </div>
            ))
          : Array.from({ length: 3 }).map((_, index) => {
              const item = currentItems[index];
              return item ? <PodcastCard key={item.id} item={item} /> : <div key={index} className="h-[7.5rem]" />;
            })}
      </div>

      <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  );
}
