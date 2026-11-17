'use client';

import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Html, useProgress } from '@react-three/drei';
import { useAtom, useAtomValue } from 'jotai';
import { isLoadingUIAtom } from '@/atoms/geo';
import { modelLoadingItemAtom } from '@/atoms/twin';
import { track } from '@/lib/analytics/track';
import { DURATION, EASE } from '@/motion/tokens';

export default function Loader() {
  const { progress, item, active } = useProgress();
  const isLoadingUI = useAtomValue(isLoadingUIAtom);
  const [loadingItem, setLoadingItem] = useAtom(modelLoadingItemAtom);
  // The bar never moves back: the furthest progress seen, kept in a ref. This loader is the twin canvas's Suspense
  // fallback, so it mounts again every time the Views suspend; it used to copy progress into state from an effect,
  // and every remount then set state during the canvas's commit. When the Views suspended and resumed in quick
  // succession after an avatar switch, those updates passed React's limit of 50 nested updates and the page crashed
  // (React error #185, found by the press-every-control sweep after pressing the C01 to C03 avatars).
  const maxProgressRef = useRef(0);
  const isLoaded = useMemo(() => progress === 100 && !active, [active, progress]);

  const fillRef = useRef(null);
  const inverseTextRef = useRef(null);

  useEffect(() => {
    if (!isLoadingUI) return;
    if (!isLoaded) return;
    if (!loadingItem) return;
    const { view, model, at } = loadingItem;
    track('twin_model_ready', { model, view, load_ms: Math.round(performance.now() - at) });
    setLoadingItem(null);
  }, [isLoaded, isLoadingUI, loadingItem, setLoadingItem]);

  useGSAP(() => {
    if (!fillRef.current || !inverseTextRef.current) return;
    // drei's progress is 0/0 (NaN) or out of range at the start of a batch; only a real advance moves the bar.
    if (Number.isFinite(progress)) maxProgressRef.current = Math.min(100, Math.max(maxProgressRef.current, progress));
    const maxProgress = maxProgressRef.current;
    gsap.to(fillRef.current, {
      width: `${maxProgress}%`,
      duration: DURATION.camera,
      ease: EASE.linear,
    });
    gsap.to(inverseTextRef.current, {
      clipPath: `inset(0 ${100 - maxProgress}% 0 0)`,
      duration: DURATION.camera,
      ease: EASE.linear,
    });
  }, [progress]);

  return (
    <Html center>
      <div className="relative h-[calc(var(--t)*3)] w-[calc(var(--t)*11)]">
        <div className="loading-text absolute flex h-full w-full items-center justify-center text-[2rem]/[2.5rem] font-semibold text-accent">
          Loading...
        </div>
        <div
          ref={inverseTextRef}
          className="absolute z-30 flex h-full w-full items-center justify-center text-[2rem]/[2.5rem] font-semibold text-white"
          style={{ clipPath: 'inset(0 100% 0 0)' }}
        >
          Loading...
        </div>
        <div ref={fillRef} className="absolute z-20 h-full w-0 bg-accent"></div>
      </div>
    </Html>
  );
}
