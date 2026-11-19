import React, { ReactNode } from 'react';
import SiteHeader from '@/components/site/SiteHeader';
import PodcastNavTabs from '@/app/podcast/_components/PodcastNavTabs';
import SubscribePopup from '@/components/layout/footer/SubscribePopup';
import { PHONE_LAYOUT_UNIT, PHONE_TREE_QUERY } from '@/styles/device-classes';

// The phone deck: the phone layout in the deck's unit, 16 px up to 599 px and growing above (two versions, RWD-02); the
// laptop deck keeps the original's fixed sizes. No characters React would escape may appear in it.
const PODCAST_CSS = `@media ${PHONE_TREE_QUERY} { :root { --u: ${PHONE_LAYOUT_UNIT}; } }`;

// A server component: it was a client layout (useIsMobile), which made every podcast page client code.
export default function PodcastLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <style>{PODCAST_CSS}</style>
      <div className="flex w-full flex-col items-center px-10 mobile:px-5">
        {/* The original's 50rem column on every width. */}
        <div className="w-full max-w-[50rem]">
          {/* The original podcast header: the logo, the two show tabs beside it, Subscribe (tabs under it on phones). */}
          <SiteHeader
            variant="solid"
            currentId="podcast"
            className="relative py-10 mobile:py-5"
            pageLinks={<PodcastNavTabs />}
          />
          {children}
        </div>
      </div>
      <SubscribePopup openOnArrival />
    </div>
  );
}
