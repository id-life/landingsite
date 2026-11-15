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
import { useSectionInput } from '@/hooks/anim/useSectionInput';
import { useSectionUrlSync } from '@/hooks/useSectionUrlSync';
import { useExperienceLifecycle } from '@/hooks/useExperienceLifecycle';
import { initialRouteHandledAtom } from '@/atoms';
import { useGSAP } from '@gsap/react';
import { useAtom, useAtomValue } from 'jotai';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SCROLL_SMOOTHER_DEFAULTS } from '@/utils/gsap-config';
import { reportError } from '@/lib/report';

// ENG-16: the ScrollSmoother exists before any section creates its ScrollTrigger (GSAP's ScrollSmoother docs: "create
// the scrollSmoother before your scrollTriggers"). Rendered first, its layout effect runs before the sections'
// do. Created after them, a pinned section's spacer survived Strict Mode's revert and the second mount
// nested another inside it (the page shrank from 22,590 to 9,090 px).
function ScrollSmootherRoot() {
  useGSAP(() => {
    try {
      ScrollSmoother.create(SCROLL_SMOOTHER_DEFAULTS);
    } catch (error) {
      reportError(error, { area: 'animation', step: 'create_smoother' });
    }
  });
  return null;
}

export default function Home() {
  const [currentPage] = useAtom(currentPageAtom);

  const { initializeAnimations } = useHomeAnimations();

  // Refresh ScrollTrigger and ScrollSmoother on window resize
  useResizeRefresh();
  // Scroll restoration and URL mapping are scoped to each mount of the experience.
  useExperienceLifecycle();
  // Keyboard and touch step through sections like the wheel does.
  useSectionInput();
  // Address bar and tab title follow the visible section (after the initial deep link is applied).
  const initialRouteHandled = useAtomValue(initialRouteHandledAtom);
  useSectionUrlSync(currentPage, initialRouteHandled);

  // Section views are counted by GA4 from the URL (one page_view per pushState / replaceState, DATA-05); there is no
  // parallel section event, so a deep link no longer reports a phantom Mission view.

  // 初始化所有主页动画
  useGSAP(() => {
    initializeAnimations();
  });

  return (
    <>
      <ScrollSmootherRoot />
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
