'use client';

import MobilePortfolio from '@/app/portfolio/_components/MobilePortfolio';
import MobileTwin from '@/app/twin/MobileTwin';
import Insights from '@/app/insights/Insights';
import Connect from '@/app/connect/Connect';
import Vision from '@/app/vision/Vision';
import { mobileCurrentPageAtom } from '@/atoms';
import MobileFixedUI from '@/components/common/MobileFixedUI';
import MobileEngagement from '@/components/engagement/MobileEngagement';
import { OuterLoader, StaticReveal } from '@/components/gl/ProgressLoader';
import { useExperienceMode } from '@/hooks/useExperienceMode';
import MotionRuntime from '@/components/gl/MotionRuntime';
import MobileFooter from '@/components/layout/footer/MobileFooter';
import MobileFooterContact from '@/components/layout/footer/MobileFooterContact';
import MobileSpectrum from '@/components/spectrum/MobileSpectrum';
import { useMobileHomeAnimateInit } from '@/hooks/anim/useMobileHomeAnimations';
import { useAtomValue } from 'jotai';
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

  return (
    // motion components follow the Motion preference (MOT-02)
    <MotionPreferenceConfig>
      <MotionRuntime />
      {webgl ? <OuterLoader /> : <StaticReveal />}
      <div id="wrapper" className="">
        <Vision />
        <MobilePortfolio />
        <Insights />
        <MobileSpectrum />
        <MobileEngagement />
        <MobileTwin />
        <Connect />
        <MobileFooter />
        <MobileFooterContact />
      </div>
      <MobileFixedUI />
      {/* Channel links of the contact panel are tracked by one delegated listener (data-channel). */}
      <LinkTracker />
    </MotionPreferenceConfig>
  );
}
