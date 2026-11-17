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
import { useSkipToSection } from '@/hooks/useSkipToSection';
import { useNavigation } from '@/hooks/useNavigation';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SCROLL_SMOOTHER_DEFAULTS } from '@/utils/gsap-config';
import { reportError } from '@/lib/report';
import { useSubscribeBridge } from '@/components/layout/footer/SubscribePopupHost';
import MotionPreferenceConfig from '@/components/common/MotionPreferenceConfig';

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
  // ENG-02: without WebGL no canvas, loader or model mounts; the server-rendered poster is the hero.
  const webgl = useExperienceMode() !== 'static';

  const { initializeAnimations } = useHomeAnimations();

  // Refresh ScrollTrigger and ScrollSmoother on window resize
  useResizeRefresh();
  // Scroll restoration and URL mapping are scoped to each mount of the experience.
  useExperienceLifecycle();
  // The header's SUBSCRIBE buttons are plain DOM events (NAV-04, PERF-10); this connects them to the popup.
  useSubscribeBridge();
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

  useSkipToSection();

  return (
    // motion components follow the Motion preference (MOT-02)
    <MotionPreferenceConfig>
      <ScrollSmootherRoot />
      <MotionRuntime />
      {webgl ? <OuterLoader /> : <StaticReveal />}
      {/* The Digital Twin's 3D stage (canvas + controls), mounted once outside the scrolled content (RWD-02). */}
      {webgl && <TwinThreeWrapper />}
      <PCAudioPlayer />
      {/* The skip link's target: after the header and the player, so the next Tab is the section's first control. */}
      <span id="content-start" tabIndex={-1} className="sr-only" />
      <div id="wrapper">
        <div id="content">
          <Vision />
          <Portfolio />
          <Insights />
          <Spectrum />
          <Engagement deck="desktop" />
          <Twin deck="desktop" />
          <Connect />
          <Footer />
          <FooterContact />
        </div>
      </div>
      <PCFixedUI />
    </MotionPreferenceConfig>
  );
}
