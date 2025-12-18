'use client';

import { useState, useMemo, useRef } from 'react';
import { useAtomValue } from 'jotai';
import { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { PodcastCard } from '@/app/insights/_components/PodcastCard';
import { PlayList, podcastIDAtom, podcastLTAtom } from '@/atoms/audio-player';
import ViewAllBorderSVG from '@/../public/svgs/podcast/view-all-border.svg?component';
import RightSVG from '@/../public/svgs/podcast/right.svg?component';
import ArrowDownSVG from '@/../public/svgs/arrow.svg?component';

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

type PodcastSectionProps = {
  podcasts?: { id: number }[];
  isLoading?: boolean;
};

export default function PodcastSection({ podcasts = [], isLoading }: PodcastSectionProps) {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
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
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [podcasts, allPodcasts]);

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  const handleViewAllClick = () => {
    window.open('/podcast', '_blank');
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={`w-full space-y-3`}>
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="h-6 w-3/4 animate-pulse rounded bg-gray-800/50" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-gray-800/50" />
                </div>
                <div className="h-11 w-11 animate-pulse rounded bg-gray-800/50" />
              </div>
              <div className="h-16 animate-pulse rounded bg-gray-800/50" />
            </div>
          ))}
        </div>
      );
    }

    // if (!showPagination) {
    //   return (
    //     <div className="flex flex-col gap-4">
    //       {podcastData.map((item) => (
    //         <PodcastCard key={item.id} item={item} />
    //       ))}
    //     </div>
    //   );
    // }

    return (
      <Swiper
        className="h-full w-full"
        onBeforeInit={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        slidesPerView={3}
        spaceBetween={24}
      >
        {podcastData.map((item) => (
          <SwiperSlide key={item.id}>
            <PodcastCard item={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    );
  };

  /*
  if (!showPagination) {
    return (
      <div className="flex flex-col">
        <h2 className="font-oxanium text-2xl font-semibold uppercase">PODCASTS</h2>
        <div className="mt-9 flex flex-col gap-4">{renderContent()}</div>
      </div>
    );
  }
*/

  return (
    <div className="relative flex flex-col">
      <div className="flex items-center justify-between">
        <h2 className="font-oxanium text-2xl font-semibold uppercase">PODCAST</h2>
        <div
          onClick={handleViewAllClick}
          className="group relative flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-base font-semibold"
        >
          <ViewAllBorderSVG className="absolute left-0 top-0 h-full w-full fill-black group-hover:fill-red-600" />
          <p className="group-hover:text-red-600">VIEW ALL</p>
          <RightSVG key="view-all" className="w-5 fill-black group-hover:fill-red-600" />
        </div>
      </div>

      <div className="relative mt-6">
        <button
          onClick={handlePrev}
          disabled={isBeginning}
          className="absolute -left-16 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border bg-white transition-opacity disabled:opacity-30"
        >
          <ArrowDownSVG className="size-5 rotate-90 fill-black" />
        </button>

        {renderContent()}

        <button
          onClick={handleNext}
          disabled={isEnd}
          className="absolute -right-16 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border bg-white transition-opacity disabled:opacity-30"
        >
          <ArrowDownSVG className="h-5 -rotate-90 fill-black" />
        </button>
      </div>
    </div>
  );
}
