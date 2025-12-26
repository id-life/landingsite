'use client';

import React, { ReactNode, Suspense } from 'react';
import PodcastHeader from '@/app/podcast/_components/PodcastHeader';
import PodcastNavTabs from '@/app/podcast/_components/PodcastNavTabs';
import MobileFooter from '@/components/layout/footer/MobileFooter';

export default function PodcastLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="px-8 mobile:px-5 middle:px-[10rem] desktop:px-[20rem]">
        <Suspense>
          <PodcastHeader />
          <PodcastNavTabs />
        </Suspense>
        {children}
      </div>
      <MobileFooter />
    </>
  );
}
