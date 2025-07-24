import PodcastList from '@/app/podcast/_components/PodcastList';
import PodcastCover from '@/app/podcast/_components/PodcastCover';
import type { Metadata } from 'next';

import '@/styles/geo.css';

export const revalidate = 300; // 5min

export const metadata: Metadata = { title: 'News-Immortal Dragons' };

export default async function PodcastPage() {
  return (
    <div className="mt-2">
      <PodcastCover />
      <div className="mt-8.5 h-px w-full bg-gray-950/20" />
      <div className="my-15">
        <PodcastList />
      </div>
    </div>
  );
}
