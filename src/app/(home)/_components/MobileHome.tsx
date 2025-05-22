'use client';

import MobileEngagement from '@/app/engagement/MobileEngagement';
import MobilePortfolio from '@/app/portfolio/_components/MobilePortfolio';
import MobileTwin from '@/app/twin/MobileTwin';
import MobileValue from '@/app/value/MobileValue';
import MobileVision from '@/app/vision/_components/MobileVision';
import { mobileCurrentPageAtom } from '@/atoms';
import MobileThreeWrapper from '@/components/gl/MobileThreeWrapper';
import MobileFooter from '@/components/layout/footer/MobileFooter';
import MobileFooterContact from '@/components/layout/footer/MobileFooterContact';
import { GA_EVENT_NAMES } from '@/constants/ga';
import { useGA } from '@/hooks/useGA';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';

export default function MobileHome() {
  const mobileCurrentPage = useAtomValue(mobileCurrentPageAtom);
  const isMobile = useIsMobile();

  const { trackEvent } = useGA();

  useEffect(() => {
    if (!isMobile) return;

    trackEvent({
      name: GA_EVENT_NAMES.ID_PAGE_VIEW,
      label: mobileCurrentPage.id,
    });
  }, [mobileCurrentPage, isMobile]);

  return (
    <>
      <MobileThreeWrapper />
      <div id="wrapper" className="">
        <MobileVision />
        <MobilePortfolio />
        <MobileEngagement />
        <MobileTwin />
        <MobileValue />
        <MobileFooter />
        <MobileFooterContact />
      </div>
    </>
  );
}
