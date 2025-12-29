'use client';

import React, { ReactNode, Suspense } from 'react';
import PodcastHeader from '@/app/podcast/_components/PodcastHeader';
import PodcastNavTabs from '@/app/podcast/_components/PodcastNavTabs';
import PodcastSubscribeFooter from '@/app/podcast/_components/PodcastSubscribeFooter';
import MobileFooter from '@/components/layout/footer/MobileFooter';
import { useIsMobile } from '@/hooks/useIsMobile';

export default function PodcastLayout({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();

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
      {isMobile ? <MobileFooter /> : <PodcastSubscribeFooter />}
    </div>
  );
}
