import { fadeInAnimCompletedAtom, globalLoadedAtom, isLoadingUIAtom } from '@/atoms/geo';
import { heroReadyAtom, serverLoaderHandedOverAtom } from '@/atoms/loading';
import { coverHoldForLanding } from '@/motion/coverHold';
import { jotaiStore } from '@/atoms/store';
import { ensureDesktopUIVisible, ensureMobileUIVisible } from '@/utils/ui';
import Background from '@/components/common/Background';
import { LoaderMark } from '@/components/gl/LoaderMark';
import { heroLoadingManager } from '@/components/gl/heroAssets';
import { reportAssetFailed, reportExperienceError, reportExperienceReady } from '@/lib/analytics/experience';
import { advanceStage, markExperiencePage } from '@/lib/analytics/stage';
import { FloatingOverlay, FloatingPortal } from '@floating-ui/react';
import { useProgress } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useAtomValue, useSetAtom } from 'jotai';
import { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import { experienceModeAtom, markHeroSceneFailed } from '@/hooks/useExperienceMode';
import { EASE } from '@/motion/tokens';
import { INTRO } from '@/components/gl/model/vision/intro';
import { PHONE_TREE_QUERY } from '@/styles/device-classes';

const LOADER_TIMEOUT_MS = 15000;
// While the hero is still loading the bar stops short of full; it fills when the scene is ready.
const LOADING_MAX = 95;
// Exit, as on the original (owner's answer 7A): the bar fills to the end, the logo fades out over the loader's still
// opaque background, and only then is the experience marked loaded, which starts the intro
// (src/components/gl/model/vision/intro.ts) in the same update that removes the loader.

/**
 * Reveals the fixed UI (nav, arrows, player) at once, as the hero's intro would: used when the intro cannot run (no
 * WebGL, a failed or lost scene, a stalled load). A no-op once the UI is visible.
 */
export function useRevealExperienceUI() {
  const setFadeInAnimCompleted = useSetAtom(fadeInAnimCompletedAtom);
  const setGlobalLoaded = useSetAtom(globalLoadedAtom);
  return useCallback(() => {
    if (jotaiStore.get(fadeInAnimCompletedAtom)) return;
    setGlobalLoaded(true);
    if (window.matchMedia(PHONE_TREE_QUERY).matches) ensureMobileUIVisible();
    else ensureDesktopUIVisible();
    setFadeInAnimCompleted(true);
  }, [setFadeInAnimCompleted, setGlobalLoaded]);
}

/**
 * The first-visit loader. It follows the hero alone: its bar shows heroLoadingManager's progress
 * (the dragon model and the wordmark textures) and it leaves once the hero's Suspense boundary has
 * committed (heroReadyAtom). Later-section 3D assets load on approach and never hold it.
 */
// memo: the loader takes no props, so the experience's own re-renders (section and atom changes in
// Home) do not re-render it; it renders on mount, when the hero is ready and on exit.
export const OuterLoader = memo(function OuterLoader() {
  const heroReady = useAtomValue(heroReadyAtom);
  const mode = useAtomValue(experienceModeAtom);
  const setIsLoadingUI = useSetAtom(isLoadingUIAtom);
  const setGlobalLoaded = useSetAtom(globalLoadedAtom);
  const revealUI = useRevealExperienceUI();
  const [show, setShow] = useState(true);
  const showRef = useRef(show);
  useEffect(() => {
    showRef.current = show;
  }, [show]);
  const mountedAtRef = useRef(0);
  const exitingRef = useRef(false);
  const loaderRef = useRef<ProgressLoaderHandle>(null);
  // Why the loader failed open: its timeout (reported as loader_timeout), an asset error (asset_failed) or a scene
  // that cannot show (no WebGL, a lost hero context, a boundary error: reported where they happen).
  const failReasonRef = useRef<'timeout' | 'asset' | 'scene'>('timeout');

  // Fail open: an asset that errors, a scene that cannot show, or a load that takes longer than LOADER_TIMEOUT_MS no
  // longer leaves the visitor on an endless loader with no navigation. The UI is revealed from here, never from a
  // model, so one failed model cannot hide it (ENG-02); this also runs after the loader has left, when the hero's
  // intro (which normally reveals the UI) can no longer run. The scene fills in when (if) its assets arrive.
  const [failOpen, setFailOpen] = useState(0);
  const requestFailOpen = useCallback((reason: 'timeout' | 'asset' | 'scene') => {
    failReasonRef.current = reason;
    setFailOpen((n) => n + 1);
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => requestFailOpen('timeout'), LOADER_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [requestFailOpen]);
  const sceneDown = mode !== 'full';
  useEffect(() => {
    if (!failOpen && !sceneDown) return;
    if (sceneDown) failReasonRef.current = 'scene';
    if (showRef.current) {
      if (failReasonRef.current === 'timeout') reportExperienceError('loader_timeout');
      reportExperienceReady({ failOpen: true, mountedAt: mountedAtRef.current });
      setIsLoadingUI(true);
      setGlobalLoaded(true);
      setShow(false);
    }
    revealUI();
  }, [failOpen, sceneDown, revealUI, setGlobalLoaded, setIsLoadingUI]);

  useEffect(() => {
    mountedAtRef.current = performance.now();
    markExperiencePage();
    advanceStage('assets');
  }, []);

  // Asset failures (hero and later sections), once per file, read from the loading managers without
  // re-rendering this component. Successful loads are not reported (DATA-06: noise).
  useEffect(() => {
    const unsubscribe = useProgress.subscribe((state, previous) => {
      const failed = state.errors.slice(previous.errors.length);
      failed.forEach(reportAssetFailed);
      // A later-section asset that fails after the loader has left must not leave the UI hidden either.
      if (failed.length && !showRef.current) requestFailOpen('asset');
    });
    heroLoadingManager.onProgress = (url, loaded, total) => {
      if (total > 0) loaderRef.current?.animateTo((LOADING_MAX * loaded) / total, 0.4);
    };
    heroLoadingManager.onError = (url) => {
      reportAssetFailed(url);
      // The hero cannot draw without its own files: the poster stands in for it.
      markHeroSceneFailed();
      requestFailOpen('asset');
    };
    return () => {
      unsubscribe();
      heroLoadingManager.onProgress = () => {};
      heroLoadingManager.onError = () => {};
    };
  }, [requestFailOpen]);

  // Exit once the hero is on screen: fill the bar, fade the logo, then remove the loader and start the intro together.
  // As on his site only the logo fades: the background stays opaque and leaves the screen in the frame the loader
  // leaves the DOM, the first frame of the intro. (Fading the whole overlay showed its last frames as nothing over an
  // empty scene, so the intro began about 70 ms after the loader had visibly gone.)
  useEffect(() => {
    if (!heroReady || !show || exitingRef.current) return;
    exitingRef.current = true;
    reportExperienceReady({ failOpen: false, mountedAt: mountedAtRef.current });
    loaderRef.current?.animateTo(100, INTRO.loaderFillSeconds, () => {
      // A direct landing on a section that holds its cover (the Digital Twin until its avatar is drawn, within a
      // limit: src/motion/coverHold.ts) keeps the full bar until then, so the loader never uncovers it empty.
      const hold = coverHoldForLanding();
      if (hold) void hold.then(leave);
      else leave();
    });
    function leave() {
      const finish = () => {
        setIsLoadingUI(true);
        setGlobalLoaded(true);
        setShow(false);
      };
      const logo = loaderRef.current?.logo;
      if (!logo) {
        finish();
        return;
      }
      gsap.to(logo, { opacity: 0, duration: INTRO.loaderFadeSeconds, ease: INTRO.defaultEase, onComplete: finish });
    }
  }, [heroReady, setGlobalLoaded, setIsLoadingUI, show]);

  useEffect(() => {
    // Only while the loader is on screen: models for later sections load after the reveal and must
    // not freeze scrolling.
    if (!show) return;
    const smoother = ScrollSmoother.get();
    if (!smoother) return;
    smoother.paused(!heroReady);
    if (!heroReady) setIsLoadingUI(true);
  }, [heroReady, setIsLoadingUI, show]);

  if (!show) return null;

  return <ProgressLoader ref={loaderRef} />;
});

type ProgressLoaderHandle = {
  /** The dragon logo (fades out on exit, over the opaque background). */
  logo: SVGSVGElement | null;
  /** Move the bar to `value` percent; never backwards. */
  animateTo: (value: number, duration: number, onComplete?: () => void) => void;
};

/**
 * The dragon logo filling up in red. The fill is two gradient stops moved by GSAP directly, so a
 * load renders this component once instead of once per animation frame.
 */
const ProgressLoader = forwardRef<ProgressLoaderHandle>((_, ref) => {
  const logoRef = useRef<SVGSVGElement>(null);
  const redStopRef = useRef<SVGStopElement>(null);
  const greyStopRef = useRef<SVGStopElement>(null);
  const shown = useRef({ value: 0 });
  const tween = useRef<gsap.core.Tween | null>(null);

  useImperativeHandle(ref, () => ({
    get logo() {
      return logoRef.current;
    },
    animateTo(value, duration, onComplete) {
      tween.current?.kill();
      tween.current = gsap.to(shown.current, {
        value: Math.max(shown.current.value, value),
        duration,
        ease: EASE.linear,
        onUpdate: () => {
          const offset = `${shown.current.value.toFixed(2)}%`;
          redStopRef.current?.setAttribute('offset', offset);
          greyStopRef.current?.setAttribute('offset', offset);
        },
        onComplete,
      });
    },
  }));

  useEffect(() => () => void tween.current?.kill(), []);
  // The server's copy of this loader (ServerLoader) stands until this one is in the document; it leaves in the same
  // commit, before the browser paints, so the screen never shows neither and the two are the same picture.
  const handOver = useSetAtom(serverLoaderHandedOverAtom);
  useLayoutEffect(() => {
    handOver(true);
  }, [handOver]);

  return (
    <FloatingPortal>
      <FloatingOverlay className="z-[500] grid place-items-center">
        <Background />
        <LoaderMark ref={logoRef} gradientId="paint_linear" redStopRef={redStopRef} greyStopRef={greyStopRef} />
      </FloatingOverlay>
    </FloatingPortal>
  );
});

ProgressLoader.displayName = 'ProgressLoader';

export default ProgressLoader;

/**
 * Stands in for the loader when the browser has no WebGL (ENG-02 'static' mode): nothing loads, so the UI is revealed
 * at once and the experience reports itself ready (fail_open 1; webgl_unavailable is reported by the probe).
 */
export function StaticReveal() {
  const revealUI = useRevealExperienceUI();
  const setIsLoadingUI = useSetAtom(isLoadingUIAtom);
  useEffect(() => {
    markExperiencePage();
    reportExperienceReady({ failOpen: true, mountedAt: performance.now() });
    setIsLoadingUI(true);
    revealUI();
  }, [revealUI, setIsLoadingUI]);
  return null;
}
