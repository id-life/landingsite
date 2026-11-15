'use client';

import Portfolio from '@/app/portfolio/_components/Portfolio';
import Twin from '@/app/twin/Twin';
import Insights from '@/app/insights/Insights';
import Connect from '@/app/connect/Connect';
import Vision from '@/app/vision/Vision';
import { currentPageAtom } from '@/atoms';
import PCFixedUI, { PCAudioPlayer } from '@/components/common/PCFixedUI';
import Engagement from '@/components/engagement/Engagement';
import { OuterLoader, StaticReveal } from '@/components/gl/ProgressLoader';
import { useExperienceMode } from '@/hooks/useExperienceMode';
import MotionRuntime from '@/components/gl/MotionRuntime';
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

export default function Home() {
  const [currentPage] = useAtom(currentPageAtom);
  // ENG-02: without WebGL no canvas, loader or model mounts; the server-rendered poster is the hero.
  const webgl = useExperienceMode() !== 'static';

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
      <MotionRuntime />
      {webgl ? <OuterLoader /> : <StaticReveal />}
      {webgl && <ThreeWrapper />}
      {webgl && <TwinThreeWrapper />}
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
