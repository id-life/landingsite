import { useMemo } from 'react';
import PodcastList from '@/app/podcast/_components/PodcastList';
import PodcastCover from '@/app/podcast/_components/PodcastCover';
import { PODCAST_NAV_LIST, PodcastCategory } from '@/app/podcast/_components/constant';
import type { Metadata } from 'next';

export const revalidate = 300; // 5min

export const metadata: Metadata = { title: 'Podcast-Immortal Dragons' };

type SearchParams = { [key: string]: PodcastCategory | undefined };

export default async function PodcastPage({ searchParams }: { searchParams: SearchParams }) {
  const { c } = searchParams;
  const category = useMemo(() => c ?? PODCAST_NAV_LIST[0].id, [c]);

  return (
    <div className="mt-2">
      <PodcastCover category={category} />
      <div className="mt-8.5 h-px bg-gray-950/20 mobile:mt-7.5" />
      <div className="my-15 mobile:my-9">
        <PodcastList category={category} />
      </div>
    </div>
  );
}
