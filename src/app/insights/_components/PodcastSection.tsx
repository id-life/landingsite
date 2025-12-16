'use client';

import { useState, useMemo, useRef } from 'react';
import { useAtomValue } from 'jotai';
import { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Pagination from './Pagination';
import { PodcastCard } from '@/app/insights/_components/PodcastCard';
import { PlayList, podcastIDAtom, podcastLTAtom } from '@/atoms/audio-player';
import ViewAllBorderSVG from '@/../public/svgs/podcast/view-all-border.svg?component';
import RightSVG from '@/../public/svgs/podcast/right.svg?component';

export type PodcastItem = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  duration: number;
  date: string;
  xyzLink?: string;
  spotifyLink?: string;
  podcastLink?: string;
};

const ITEMS_PER_PAGE = 3;

type PodcastSectionProps = {
  podcasts?: { id: number }[];
  isLoading?: boolean;
  showPagination?: boolean;
};

export default function PodcastSection({ podcasts = [], isLoading, showPagination = true }: PodcastSectionProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const swiperRef = useRef<SwiperType>();
  const podcastIDList = useAtomValue(podcastIDAtom);
  const podcastLTList = useAtomValue(podcastLTAtom);

  const allPodcasts = useMemo(() => [...podcastIDList, ...podcastLTList], [podcastIDList, podcastLTList]);

  const podcastData = useMemo<PodcastItem[]>(() => {
    return podcasts
      .map((podcast) => {
        const item = allPodcasts.find((p) => p.id === podcast.id);
        if (!item) return null;
        return {
          id: item.id,
          title: item.title,
          subtitle: `${item.artist || '不朽真龙 Immortal Dragons'} ${item.category === PlayList.PODCAST_ID ? '' : '· 龙门阵Long Talk'}`,
          description: item.description || '',
          duration: item.duration,
          date: item.createdAt!,
          xyzLink: item.xyzLink,
          podcastLink: item.podcastLink,
          spotifyLink: item.spotifyLink,
        } as PodcastItem;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .slice(0, 12);
  }, [podcasts, allPodcasts]);

  const totalPages = Math.ceil(podcastData.length / ITEMS_PER_PAGE);

  const handlePaginationClick = (index: number) => {
    swiperRef.current?.slideTo(index);
    setCurrentPage(index);
  };

  const handleViewAllClick = () => {
    window.open('/podcast', '_blank');
  };

  const renderContent = () => {
    if (isLoading) {
      return Array.from({ length: 3 }).map((_, index) => (
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
      ));
    }

    if (!showPagination) {
      return podcastData.map((item) => <PodcastCard key={item.id} item={item} />);
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
            <div className="flex h-full flex-col justify-between gap-4">
              {Array.from({ length: 3 }).map((_, index) => {
                const item = podcastData[i * ITEMS_PER_PAGE + index];
                return item ? <PodcastCard key={item.id} item={item} /> : <div key={index} className="h-[7.5rem]" />;
              })}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    );
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <h2 className="font-oxanium text-2xl font-semibold uppercase">PODCASTS</h2>
        <div
          onClick={handleViewAllClick}
          className="group relative flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-base font-semibold"
        >
          <ViewAllBorderSVG className="absolute left-0 top-0 h-full w-full fill-black group-hover:fill-red-600" />
          <p className="group-hover:text-red-600">VIEW ALL</p>
          <RightSVG key="view-all" className="w-5 fill-black group-hover:fill-red-600" />
        </div>
      </div>

      <div className="mt-9 flex max-w-[30.75rem] flex-1 flex-col justify-between gap-4">{renderContent()}</div>
      {showPagination && <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePaginationClick} />}
    </div>
  );
}
