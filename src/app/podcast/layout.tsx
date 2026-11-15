import React, { ReactNode } from 'react';
import PodcastHeader from '@/app/podcast/_components/PodcastHeader';
import PodcastNavTabs from '@/app/podcast/_components/PodcastNavTabs';
import ContentPageContact from '@/components/layout/footer/ContentPageContact';
import SubscribePopup from '@/components/layout/footer/SubscribePopup';

// A server component: it was a client layout (useIsMobile), which made every podcast page client code.
export default function PodcastLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="flex w-full flex-col items-center px-10 mobile:px-5">
        <div className="reading-column">
          <PodcastHeader />
          <PodcastNavTabs />
          {children}
        </div>
      </div>
      {/* The page footer: contact row and the About link (CON-01). Server-rendered; only the popup loads on first use. */}
      <ContentPageContact />
      <SubscribePopup />
    </div>
  );
}
