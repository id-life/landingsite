'use client';

import { NAV_LIST } from '@/components/nav/nav';
import NewsSection from '@/app/insights/_components/NewsSection';
import TalksSection from '@/app/insights/_components/TalksSection';
import PodcastSection from '@/app/insights/_components/PodcastSection';

export default function Insights() {
  return (
    <div id={NAV_LIST[5].id} className="page-container insights h-screen">
      <div className="grid h-[calc(100vh-10rem)] grid-cols-3 gap-16 px-32 pt-30">
        <div className="relative flex flex-col">
          <NewsSection />
        </div>

        <div className="relative flex flex-col">
          <TalksSection />
        </div>

        <div className="relative flex flex-col">
          <PodcastSection />
        </div>
      </div>
    </div>
  );
}
