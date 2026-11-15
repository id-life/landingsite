'use client';

import Portfolio from '@/app/portfolio/_components/Portfolio';
import Twin from '@/app/twin/Twin';
import Insights from '@/app/insights/Insights';
import Connect from '@/app/connect/Connect';
import Vision from '@/app/vision/Vision';
import { currentPageAtom } from '@/atoms';
import PCFixedUI, { PCAudioPlayer } from '@/components/common/PCFixedUI';
import Engagement from '@/components/engagement/Engagement';
import { OuterLoader } from '@/components/gl/ProgressLoader';
import ThreeWrapper from '@/components/gl/ThreeWrapper';
import Footer from '@/components/layout/footer/Footer';
import FooterContact from '@/components/layout/footer/FooterContact';
import Spectrum from '@/components/spectrum/Spectrum';
import TwinThreeWrapper from '@/components/twin/TwinThreeWrapper';
import { useHomeAnimations } from '@/hooks/anim/useHomeAnimations';
import { useResizeRefresh } from '@/hooks/useResizeRefresh';
import { useDesktopSections } from '@/hooks/anim/useDesktopSections';
import { useSectionUrlSync } from '@/hooks/useSectionUrlSync';
import { useExperienceLifecycle } from '@/hooks/useExperienceLifecycle';
import { initialRouteHandledAtom } from '@/atoms';
import { useGSAP } from '@gsap/react';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { useNavigation } from '@/hooks/useNavigation';

export default function Home() {
  const [currentPage] = useAtom(currentPageAtom);

  const { initializeAnimations } = useHomeAnimations();

  // Refresh ScrollTrigger and ScrollSmoother on window resize
  useResizeRefresh();
  // Scroll restoration and URL mapping are scoped to each mount of the experience.
  useExperienceLifecycle();
  // The section controller's desktop driver and inputs: wheel, keys and touch each step one section (MOT-01).
  useDesktopSections();
  // Address bar and tab title follow the visible section (after the initial deep link is applied).
  const initialRouteHandled = useAtomValue(initialRouteHandledAtom);
  useSectionUrlSync(currentPage, initialRouteHandled);
  // The arrows and the SCROLL cue ask for a section through navigateToAtom (this used to live in the desktop nav).
  useNavigation();
  // A reload starts at the top, where the deep link is applied from (this used to live in the desktop nav).
  useEffect(() => {
    const toTop = () => window.scrollTo({ top: 0 });
    window.addEventListener('beforeunload', toTop);
    return () => window.removeEventListener('beforeunload', toTop);
  }, []);

  // Section views are counted by GA4 from the URL (one page_view per pushState / replaceState, DATA-05); there is no
  // parallel section event, so a deep link no longer reports a phantom Mission view.

  // 初始化所有主页动画
  useGSAP(() => {
    initializeAnimations();
  });

  return (
    <>
      <OuterLoader />
      <ThreeWrapper />
      <TwinThreeWrapper />
      <PCAudioPlayer />
      <div id="wrapper">
        <div id="content">
          <Vision />
          <Portfolio />
          <Insights />
          <Spectrum />
          <Engagement />
          <Twin />
          <Connect />
          <Footer />
          <FooterContact />
        </div>
      </div>
      <PCFixedUI />
    </>
  );
}
