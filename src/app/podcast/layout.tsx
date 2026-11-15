import React, { ReactNode } from 'react';
import SiteHeader from '@/components/site/SiteHeader';
import PodcastNavTabs from '@/app/podcast/_components/PodcastNavTabs';
import ContentPageContact from '@/components/layout/footer/ContentPageContact';
import SubscribePopup from '@/components/layout/footer/SubscribePopup';

// A server component: it was a client layout (useIsMobile), which made every podcast page client code.
export default function PodcastLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="flex w-full flex-col items-center px-10 mobile:px-5">
        <div className="reading-column">
          <SiteHeader variant="solid" currentId="podcast" className="relative py-10 mobile:py-5" />
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
