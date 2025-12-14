'use client';

import { NAV_LIST } from '@/components/nav/nav';
import NewsSection from '@/app/insights/_components/NewsSection';
import TalksSection from '@/app/insights/_components/TalksSection';
import PodcastSection from '@/app/insights/_components/PodcastSection';
import { useInsightsData } from '@/hooks/insights/fetch';

export default function Insights() {
  const { news, talks, podcasts, isLoading } = useInsightsData();

  return (
    <div id={NAV_LIST[5].id} className="page-container insights h-screen">
      <div className="flex h-[calc(100vh-10rem)] gap-16 px-32 pt-30">
        <div className="relative flex flex-col">
          <NewsSection data={news} isLoading={isLoading} />
        </div>

        <div className="relative flex flex-col">
          <TalksSection data={talks} isLoading={isLoading} />
        </div>

        <div className="relative flex flex-col">
          <PodcastSection podcasts={podcasts} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
