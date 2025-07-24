'use client';

import { useSearchParams } from 'next/navigation';
import { PODCAST_NAV_LIST, PodcastCategory } from '@/app/podcast/_components/constant';
import PodcastListItem from '@/app/podcast/_components/PodcastListItem';

export default function PodcastList() {
  const searchParams = useSearchParams();
  const search = (searchParams.get('tab') ?? PODCAST_NAV_LIST[0].id) as PodcastCategory;

  return (
    <div className="grid gap-12">
      <PodcastListItem />
      <PodcastListItem />
      <PodcastListItem />
      <PodcastListItem />
      <PodcastListItem />
      <PodcastListItem />
      <PodcastListItem />
      <PodcastListItem />
      <PodcastListItem />
    </div>
  );
}
