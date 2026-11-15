import { fadeInAnimCompletedAtom, globalLoadedAtom, isLoadingUIAtom } from '@/atoms/geo';
import { heroReadyAtom } from '@/atoms/loading';
import { jotaiStore } from '@/atoms/store';
import { ensureDesktopUIVisible, ensureMobileUIVisible } from '@/utils/ui';
import Background from '@/components/common/Background';
import { heroLoadingManager } from '@/components/gl/heroAssets';
import { reportAssetFailed, reportExperienceError, reportExperienceReady } from '@/lib/analytics/experience';
import { advanceStage, markExperiencePage } from '@/lib/analytics/stage';
import { FloatingOverlay, FloatingPortal } from '@floating-ui/react';
import { useProgress } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useAtomValue, useSetAtom } from 'jotai';
import { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { experienceModeAtom, markHeroSceneFailed } from '@/hooks/useExperienceMode';
import { EASE } from '@/motion/tokens';

const LOADER_TIMEOUT_MS = 15000;
// While the hero is still loading the bar stops short of full; it fills when the scene is ready.
const LOADING_MAX = 95;
// Exit: the bar fills, then the overlay fades while the dragon starts to fly in underneath it
// (MOT-04: the intro overlaps the loader exit instead of following it).
const FILL_SECONDS = 0.2;
const FADE_SECONDS = 0.3;

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
    if (window.matchMedia('(max-width: 768px)').matches) ensureMobileUIVisible();
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
// Home / MobileHome) do not re-render it; it renders on mount, when the hero is ready and on exit.
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

  // Exit once the hero is on screen: fill the bar, then start the scene's intro and fade the
  // overlay over it; the overlay lets input through while it fades.
  useEffect(() => {
    if (!heroReady || !show || exitingRef.current) return;
    exitingRef.current = true;
    reportExperienceReady({ failOpen: false, mountedAt: mountedAtRef.current });
    loaderRef.current?.animateTo(100, FILL_SECONDS, () => {
      setIsLoadingUI(true);
      setGlobalLoaded(true);
      const overlay = loaderRef.current?.overlay;
      if (!overlay) {
        setShow(false);
        return;
      }
      overlay.style.pointerEvents = 'none';
      gsap.to(overlay, { opacity: 0, duration: FADE_SECONDS, onComplete: () => setShow(false) });
    });
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
  /** The full-screen overlay (fades out on exit). */
  overlay: HTMLDivElement | null;
  /** Move the bar to `value` percent; never backwards. */
  animateTo: (value: number, duration: number, onComplete?: () => void) => void;
};

/**
 * The dragon logo filling up in red. The fill is two gradient stops moved by GSAP directly, so a
 * load renders this component once instead of once per animation frame.
 */
const ProgressLoader = forwardRef<ProgressLoaderHandle>((_, ref) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const redStopRef = useRef<SVGStopElement>(null);
  const greyStopRef = useRef<SVGStopElement>(null);
  const shown = useRef({ value: 0 });
  const tween = useRef<gsap.core.Tween | null>(null);

  useImperativeHandle(ref, () => ({
    get overlay() {
      return overlayRef.current;
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

  return (
    <FloatingPortal>
      <FloatingOverlay ref={overlayRef} className="z-[500] grid place-items-center">
        <Background />
        <svg width={200} viewBox="0 0 106 62" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M98.6035 18.943C94.7777 15.1032 90.0847 12.7993 85.1367 11.929C77.5361 10.6491 64.3754 10.8026 64.3754 10.8026C71.0577 8.49876 78.9134 9.57391 78.9134 9.57391C72.384 6.65566 59.3763 8.70355 59.3763 8.70355C65.3956 7.06523 69.1703 6.86045 74.7815 7.52601C74.7815 7.52601 68.3032 4.60776 56.0606 6.55326C54.8874 6.70686 53.8672 8.03798 53.204 8.49876C51.5717 9.5739 50.2964 10.0347 48.409 9.31792C47.4909 8.95954 46.5216 8.65235 45.3994 8.24277C46.3686 7.32122 47.4398 7.16763 48.6131 7.32122C49.4803 7.42362 50.4495 7.32122 51.2656 7.16763C52.6939 6.86045 53.4081 5.8877 55.2445 5.7853C55.2445 5.7853 58.6622 5.7853 61.8248 5.58051C64.9875 5.42692 67.589 3.7886 68.6602 3.07184C64.0183 3.02064 59.7844 4.60776 54.9384 4.55657C59.8354 4.24938 62.59 2.76466 66.0587 0C62.641 1.27993 60.6006 2.91825 56.7748 2.96945C54.6323 3.02065 52.4389 3.53262 50.3985 3.9422C48.7151 4.24938 47.3888 6.09249 45.8075 6.80925C44.1241 7.52601 42.4408 7.11643 41.3186 5.93889C39.8393 7.47482 39.7883 9.26672 41.0125 10.9562C41.4716 10.3419 42.0327 9.6763 42.7469 8.85714C43.206 9.6251 43.512 9.98348 43.7161 10.2907C45.1444 9.52271 47.1338 10.0347 48.103 11.3146C48.7661 12.1338 48.103 12.4922 47.6439 12.8505C45.7565 14.2329 44.7873 13.8745 43.9201 13.0041L43.257 14.54L41.2165 14.4889L44.9403 18.2775L45.0934 16.7927L46.8277 16.7415C47.4908 15.2056 49.1742 15.052 50.3474 15.564C51.5717 16.1272 52.3879 17.5607 53.3061 18.5334C53.3571 18.4311 53.4081 18.1239 53.4591 17.7655C54.0202 15.9736 55.3465 15.6152 56.7238 16.8439L58.8152 18.8918C60.0395 20.0694 60.0905 22.0661 58.9172 23.2948L45.4504 36.8109L45.3484 36.9133L35.2483 46.948C29.6371 52.5797 20.5063 52.5797 14.9461 46.948C9.33493 41.3163 9.33493 32.1519 14.9461 26.5714C17.7517 23.7556 21.4244 22.3732 25.0972 22.3732C28.77 22.3732 32.4427 23.7556 35.2483 26.5714L43.0529 34.4046L50.6025 26.8274L42.7979 18.9942C33.0038 9.16433 17.0885 9.16433 7.34552 18.9942C2.60154 23.7556 0 30.0528 0 36.8109C0 43.5178 2.60154 49.8662 7.34552 54.6276C12.2425 59.5425 18.6699 62 25.0972 62C31.5245 62 37.9519 59.5425 42.8489 54.6276L60.6006 36.8109L60.7026 36.7085L70.7517 26.6226C76.3628 20.9909 85.4937 20.9909 91.0539 26.6226C96.6651 32.2543 96.6651 41.4187 91.0539 46.9992C88.2483 49.815 84.5756 51.1974 80.9028 51.1974C77.23 51.1974 73.5573 49.815 70.7517 46.9992L62.9471 39.166L55.3975 46.7432L63.2021 54.5764C72.9961 64.4063 88.9114 64.4063 98.6545 54.5764C103.398 49.815 106 43.5178 106 36.7597C105.949 30.0529 103.347 23.7044 98.6035 18.943Z"
            fill="url(#paint_linear)"
          />
          <defs>
            <linearGradient id="paint_linear" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-accent)" />
              <stop ref={redStopRef} offset="0%" stopColor="var(--color-accent)" />
              <stop ref={greyStopRef} offset="0%" stopColor="var(--color-tone-300)" />
              <stop offset="100%" stopColor="var(--color-tone-300)" />
            </linearGradient>
          </defs>
        </svg>
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
