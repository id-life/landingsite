'use client';

import MobilePortfolio from '@/app/portfolio/_components/MobilePortfolio';
import MobileValue from '@/app/value/MobileValue';
import MobileVision from '@/app/vision/_components/MobileVision';
import { mobileCurrentPageAtom } from '@/atoms';
import MobileThreeWrapper from '@/components/gl/MobileThreeWrapper';
import MobileFooter from '@/components/layout/footer/MobileFooter';
import { NAV_LIST } from '@/components/nav/nav';
import { useAtomValue } from 'jotai';

export default function MobileHome() {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  return (
    <>
      <MobileThreeWrapper />
      <div id="wrapper" className="">
        <MobileVision />
        <MobilePortfolio />
        <MobileValue />
        {currentPage.id === NAV_LIST[2].id && <MobileFooter />}
      </div>
    </>
  );
}
