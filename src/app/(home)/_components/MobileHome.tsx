'use client';

import MobilePortfolio from '@/app/portfolio/_components/MobilePortfolio';
import MobileTwin from '@/app/twin/MobileTwin';
import MobileInsights from '@/app/insights/MobileInsights';
import MobileConnect from '@/app/connect/MobileConnect';
import MobileVision from '@/app/vision/_components/MobileVision';
import { mobileCurrentPageAtom } from '@/atoms';
import MobileFixedUI from '@/components/common/MobileFixedUI';
import MobileEngagement from '@/components/engagement/MobileEngagement';
import MobileThreeWrapper from '@/components/gl/MobileThreeWrapper';
import { OuterLoader } from '@/components/gl/ProgressLoader';
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

export default function MobileHome() {
  const mobileCurrentPage = useAtomValue(mobileCurrentPageAtom);

  useMobileHomeAnimateInit();
  // Scroll restoration and URL mapping are scoped to each mount of the experience.
  useExperienceLifecycle();
  // The phone tree changes section through the same controller as the desktop deck (MOT-01).
  usePhoneSectionDriver();
  // Vertical swipes step through sections, like the arrow buttons.
  useMobileSwipe();
  // Mobile section changes push their own URL; keep the tab title in step.
  const initialRouteHandled = useAtomValue(initialRouteHandledAtom);
  useSectionUrlSync(mobileCurrentPage, initialRouteHandled, { replaceUrl: false });

  return (
    <>
      <OuterLoader />
      <MobileThreeWrapper />
      <div id="wrapper" className="">
        <MobileVision />
        <MobilePortfolio />
        <MobileInsights />
        <MobileSpectrum />
        <MobileEngagement />
        <MobileTwin />
        <MobileConnect />
        <MobileFooter />
        <MobileFooterContact />
      </div>
      <MobileFixedUI />
    </>
  );
}
