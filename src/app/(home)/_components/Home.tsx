'use client';

import Portfolio from '@/app/portfolio/_components/Portfolio';
import Twin from '@/app/twin/Twin';
import Insights from '@/app/insights/Insights';
import Connect from '@/app/connect/Connect';
import Vision from '@/app/vision/Vision';
import { currentPageAtom, initialRouteHandledAtom, mobileCurrentPageAtom } from '@/atoms';
import FixedUI, { AudioPlayer } from '@/components/common/FixedUI';
import Engagement from '@/components/engagement/Engagement';
import { OuterLoader, StaticReveal } from '@/components/gl/ProgressLoader';
import { useExperienceMode } from '@/hooks/useExperienceMode';
import MotionRuntime from '@/components/gl/MotionRuntime';
import SubscribeStrip from '@/components/layout/footer/SubscribeStrip';
import SubscribeSheet from '@/components/layout/footer/SubscribeSheet';
import ContactBand from '@/components/layout/footer/ContactBand';
import ContactPanel from '@/components/layout/footer/ContactPanel';
import Spectrum from '@/components/spectrum/Spectrum';
import TwinThreeWrapper from '@/components/twin/TwinThreeWrapper';
import { useHomeAnimations } from '@/hooks/anim/useHomeAnimations';
import { useMobileHomeAnimateInit } from '@/hooks/anim/useMobileHomeAnimations';
import { useResizeRefresh } from '@/hooks/useResizeRefresh';
import { useDesktopSections } from '@/hooks/anim/useDesktopSections';
import { useMobileSwipe } from '@/hooks/anim/useMobileSwipe';
import { usePhoneSectionDriver } from '@/hooks/useMobileNavigation';
import { useSectionUrlSync } from '@/hooks/useSectionUrlSync';
import { useExperienceLifecycle } from '@/hooks/useExperienceLifecycle';
import { useGSAP } from '@gsap/react';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { useSkipToSection } from '@/hooks/useSkipToSection';
import { useNavigation } from '@/hooks/useNavigation';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SCROLL_SMOOTHER_DEFAULTS } from '@/utils/gsap-config';
import { reportError } from '@/lib/report';
import { useSubscribeBridge, useSubscribeOnArrival } from '@/components/layout/footer/SubscribePopupHost';
import { fadeInAnimCompletedAtom } from '@/atoms/geo';
import LinkTracker from '@/components/site/LinkTracker';
import MotionPreferenceConfig from '@/components/common/MotionPreferenceConfig';

export type Deck = 'desktop' | 'phone';

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

/**
 * The experience, one component for both decks (RWD-02; it was Home and MobileHome). The sections are the same seven
 * components on both; what differs is real and is the `deck` property:
 * - the desktop deck is one continuous page: a ScrollSmoother (created first, see above) moves #content inside
 *   #wrapper, each section's timeline is pinned to the scroll (useHomeAnimations), the window's resize refreshes the
 *   pins (useResizeRefresh), and wheel, keys and touch step one section (useDesktopSections);
 * - the phone deck is paged: its section driver (usePhoneSectionDriver), vertical swipes (useMobileSwipe) and a
 *   background theme per section (useMobileHomeAnimateInit);
 * - the parts that are drawn differently: the subscribe and contact parts at the end (SubscribeStrip and ContactBand
 *   against SubscribeSheet and ContactPanel), the Digital Twin's stage (mounted here on the desktop deck), where the
 *   music player is rendered (here on the desktop deck, for the Tab order; in FixedUI on the phone), and the phone's
 *   delegated channel-link tracking.
 * A deck-only hook takes `enabled` and does nothing on the other deck. The hooks keep the order each deck had, since
 * start-up depends on which effects run first. HomeEntry keys this component by deck, so a change of deck mounts it
 * afresh: nothing of one deck's timelines, listeners or state survives into the other.
 */
export default function Home({ deck }: { deck: Deck }) {
  const desktop = deck === 'desktop';
  // The section each deck reports (the two decks keep their own atom); only the deck's own is read.
  const currentPage = useAtomValue(desktop ? currentPageAtom : mobileCurrentPageAtom);
  // ENG-02: without WebGL no canvas, loader or model mounts; the server-rendered poster is the hero.
  const webgl = useExperienceMode() !== 'static';

  const { initializeAnimations } = useHomeAnimations();
  useMobileHomeAnimateInit(!desktop);
  // Refresh ScrollTrigger and ScrollSmoother on window resize
  useResizeRefresh(desktop);
  // Scroll restoration and URL mapping are scoped to each mount of the experience.
  useExperienceLifecycle();
  // The header's SUBSCRIBE buttons are plain DOM events (NAV-04, PERF-10); this connects them to the popup.
  useSubscribeBridge();
  // The popup also opens by itself when the intro ends (the owner's answer 5c).
  useSubscribeOnArrival(useAtomValue(fadeInAnimCompletedAtom));
  // Each deck's driver for the section controller and its inputs (MOT-01): on the desktop deck wheel, keys and touch
  // step one section; on the phone the arrows and vertical swipes do.
  useDesktopSections(desktop);
  usePhoneSectionDriver(!desktop);
  useMobileSwipe(!desktop);
  // Address bar and tab title follow the visible section (after the initial deep link is applied). The phone's section
  // changes push their own URL.
  const initialRouteHandled = useAtomValue(initialRouteHandledAtom);
  useSectionUrlSync(currentPage, initialRouteHandled, { replaceUrl: desktop });
  // The arrows and the SCROLL cue ask for a section through navigateToAtom (this used to live in the desktop nav).
  useNavigation(desktop);
  // A reload starts at the top, where the deep link is applied from (this used to live in the desktop nav). Only when
  // the page is really unloaded: a page the browser keeps in its back/forward cache (pagehide with persisted) comes
  // back exactly as it was left, and the scroll moved to the top on the way out made the smoother glide the deck up
  // to the first screen as soon as it was restored (and the address follow it to /).
  useEffect(() => {
    if (!desktop) return;
    const toTop = (event: PageTransitionEvent) => {
      if (!event.persisted) window.scrollTo({ top: 0 });
    };
    window.addEventListener('pagehide', toTop);
    return () => window.removeEventListener('pagehide', toTop);
  }, [desktop]);

  // Section views are counted by GA4 from the URL (one page_view per pushState / replaceState, DATA-05); there is no
  // parallel section event, so a deep link no longer reports a phantom Mission view.

  // The desktop deck's section timelines (after the smoother and the sections exist).
  useGSAP(() => {
    if (desktop) initializeAnimations();
  });

  useSkipToSection();

  const sections = (
    <>
      <Vision />
      <Portfolio deck={deck} />
      <Insights />
      <Spectrum />
      <Engagement deck={deck} />
      <Twin deck={deck} />
      <Connect />
      {desktop ? <SubscribeStrip ease="token" /> : <SubscribeSheet />}
      {desktop ? <ContactBand /> : <ContactPanel />}
    </>
  );

  return (
    // motion components follow the Motion preference (MOT-02)
    <MotionPreferenceConfig>
      {desktop && <ScrollSmootherRoot />}
      <MotionRuntime />
      {webgl ? <OuterLoader /> : <StaticReveal />}
      {/* The Digital Twin's 3D stage (canvas + controls), mounted once outside the scrolled content (RWD-02). */}
      {desktop && webgl && <TwinThreeWrapper />}
      {desktop && <AudioPlayer />}
      {/* The skip link's target: after the header (and the desktop deck's player), so the next Tab is the section's
          first control. */}
      <span id="content-start" tabIndex={-1} className="sr-only" />
      {/* The desktop deck's smoother moves #content inside #wrapper; the phone's sections sit in #wrapper directly. */}
      <div id="wrapper">{desktop ? <div id="content">{sections}</div> : sections}</div>
      <FixedUI deck={deck} />
      {/* Channel links of the phone's contact panel are tracked by one delegated listener (data-channel). */}
      {!desktop && <LinkTracker />}
    </MotionPreferenceConfig>
  );
}
