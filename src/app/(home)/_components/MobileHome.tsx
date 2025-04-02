'use client';

import MobileEngagement from '@/app/engagement/MobileEngagement';
import MobilePortfolio from '@/app/portfolio/_components/MobilePortfolio';
import MobileTwin from '@/app/twin/MobileTwin';
import MobileValue from '@/app/value/MobileValue';
import MobileVision from '@/app/vision/_components/MobileVision';
import MobileThreeWrapper from '@/components/gl/MobileThreeWrapper';
import MobileFooter from '@/components/layout/footer/MobileFooter';

export default function MobileHome() {
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
      </div>
    </>
  );
}
