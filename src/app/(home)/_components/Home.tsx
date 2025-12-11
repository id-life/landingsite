'use client';

import Portfolio from '@/app/portfolio/_components/Portfolio';
import Twin from '@/app/twin/Twin';
import Insights from '@/app/insights/Insights';
import Connect from '@/app/connect/Connect';
import Vision from '@/app/vision/Vision';
import { currentPageAtom } from '@/atoms';
import PCFixedUI from '@/components/common/PCFixedUI';
import Engagement from '@/components/engagement/Engagement';
import { OuterLoader } from '@/components/gl/ProgressLoader';
import ThreeWrapper from '@/components/gl/ThreeWrapper';
import Footer from '@/components/layout/footer/Footer';
import FooterContact from '@/components/layout/footer/FooterContact';
import Spectrum from '@/components/spectrum/Spectrum';
import TwinThreeWrapper from '@/components/twin/TwinThreeWrapper';
import { GA_EVENT_NAMES } from '@/constants/ga';
import { useGA } from '@/hooks/useGA';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useIsMounted } from '@/hooks/useIsMounted';
import { useHomeAnimations } from '@/hooks/anim/useHomeAnimations';
import { useGSAP } from '@gsap/react';
import { useAtom } from 'jotai';
import { useEffect } from 'react';

export default function Home() {
  const [currentPage] = useAtom(currentPageAtom);
  const isMobile = useIsMobile();
  const isMounted = useIsMounted();

  const { trackEvent } = useGA();
  const { initializeAnimations } = useHomeAnimations();

  useEffect(() => {
    if (isMounted && !isMobile) {
      trackEvent({
        name: GA_EVENT_NAMES.ID_PAGE_VIEW,
        label: currentPage.id,
      });
    }
  }, [currentPage, isMobile, isMounted, trackEvent]);

  // 初始化所有主页动画
  useGSAP(() => {
    initializeAnimations();
  });

  return (
    <>
      <OuterLoader />
      <ThreeWrapper />
      <TwinThreeWrapper />
      <div id="wrapper">
        <div id="content">
          <Vision />
          <Portfolio />
          <Spectrum />
          <Engagement />
          <Twin />
          <Insights />
          <Connect />
          <Footer />
          <FooterContact />
        </div>
      </div>
      <PCFixedUI />
    </>
  );
}
