'use client';

import MobilePortfolio from '@/app/portfolio/_components/MobilePortfolio';
import Twin from '@/app/twin/Twin';
import Insights from '@/app/insights/Insights';
import Connect from '@/app/connect/Connect';
import Vision from '@/app/vision/Vision';
import { mobileCurrentPageAtom } from '@/atoms';
import FixedUI from '@/components/common/FixedUI';
import Engagement from '@/components/engagement/Engagement';
import { OuterLoader, StaticReveal } from '@/components/gl/ProgressLoader';
import { useExperienceMode } from '@/hooks/useExperienceMode';
import MotionRuntime from '@/components/gl/MotionRuntime';
import SubscribeSheet from '@/components/layout/footer/SubscribeSheet';
import ContactPanel from '@/components/layout/footer/ContactPanel';
import Spectrum from '@/components/spectrum/Spectrum';
import { useMobileHomeAnimateInit } from '@/hooks/anim/useMobileHomeAnimations';
import { useAtomValue } from 'jotai';
import { useSkipToSection } from '@/hooks/useSkipToSection';
import { useSectionUrlSync } from '@/hooks/useSectionUrlSync';
import { useMobileSwipe } from '@/hooks/anim/useMobileSwipe';
import { useExperienceLifecycle } from '@/hooks/useExperienceLifecycle';
import { usePhoneSectionDriver } from '@/hooks/useMobileNavigation';
import { initialRouteHandledAtom } from '@/atoms';
import { useSubscribeBridge } from '@/components/layout/footer/SubscribePopupHost';
import LinkTracker from '@/components/site/LinkTracker';
import MotionPreferenceConfig from '@/components/common/MotionPreferenceConfig';

export default function MobileHome() {
  const mobileCurrentPage = useAtomValue(mobileCurrentPageAtom);
  // ENG-02: without WebGL no canvas, loader or model mounts; the server-rendered poster is the hero.
  const webgl = useExperienceMode() !== 'static';

  useMobileHomeAnimateInit();
  // Scroll restoration and URL mapping are scoped to each mount of the experience.
  useExperienceLifecycle();
  // The header's SUBSCRIBE buttons are plain DOM events (NAV-04, PERF-10); this connects them to the popup.
  useSubscribeBridge();
  // The phone tree changes section through the same controller as the desktop deck (MOT-01).
  usePhoneSectionDriver();
  // Vertical swipes step through sections, like the arrow buttons.
  useMobileSwipe();
  // Mobile section changes push their own URL; keep the tab title in step.
  const initialRouteHandled = useAtomValue(initialRouteHandledAtom);
  useSectionUrlSync(mobileCurrentPage, initialRouteHandled, { replaceUrl: false });

  useSkipToSection();

  return (
    // motion components follow the Motion preference (MOT-02)
    <MotionPreferenceConfig>
      <MotionRuntime />
      {webgl ? <OuterLoader /> : <StaticReveal />}
      {/* The skip link's target: where the content begins, after the header. */}
      <span id="content-start" tabIndex={-1} className="sr-only" />
      <div id="wrapper" className="">
        <Vision />
        <MobilePortfolio />
        <Insights />
        <Spectrum />
        <Engagement deck="phone" />
        <Twin deck="phone" />
        <Connect />
        <SubscribeSheet />
        <ContactPanel />
      </div>
      <FixedUI deck="phone" />
      {/* Channel links of the contact panel are tracked by one delegated listener (data-channel). */}
      <LinkTracker />
    </MotionPreferenceConfig>
  );
}
