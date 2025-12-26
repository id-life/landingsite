'use client';

import React, { ReactNode, Suspense } from 'react';
import PodcastHeader from '@/app/podcast/_components/PodcastHeader';
import PodcastNavTabs from '@/app/podcast/_components/PodcastNavTabs';
import MobileFooter from '@/components/layout/footer/MobileFooter';

export default function PodcastLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="flex w-full flex-col items-center px-10 mobile:px-5">
        <div className="max-w-[50rem]">
          <Suspense>
            <PodcastHeader />
            <PodcastNavTabs />
          </Suspense>
          {children}
        </div>
      </div>
      <MobileFooter />
    </div>
  );
}
