'use client';

import MobilePortfolio from '@/app/portfolio/_components/MobilePortfolio';
import Value from '@/app/value/Value';
import MobileVision from '@/app/vision/_components/MobileVision';
import MobileThreeWrapper from '@/components/gl/MobileThreeWrapper';
import MobileFooter from '@/components/layout/footer/MobileFooter';

export default function MobileHome() {
  return (
    <>
      <MobileThreeWrapper />
      <div id="wrapper" className="h-screen">
        <MobileVision />
        <MobilePortfolio />
        <Value />
        <MobileFooter />
      </div>
    </>
  );
}
