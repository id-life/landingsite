'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Html, useProgress } from '@react-three/drei';
import { useAtom, useAtomValue } from 'jotai';
import { isLoadingUIAtom } from '@/atoms/geo';
import { modelLoadingItemAtom } from '@/atoms/twin';
import { track } from '@/lib/analytics/track';

export default function Loader() {
  const { progress, item, active } = useProgress();
  const isLoadingUI = useAtomValue(isLoadingUIAtom);
  const [loadingItem, setLoadingItem] = useAtom(modelLoadingItemAtom);
  const [maxProgress, setMaxProgress] = useState(0);
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

  useEffect(() => {
    setMaxProgress((state) => (state > progress ? state : progress));
  }, [progress]);

  useGSAP(() => {
    if (!fillRef.current || !inverseTextRef.current) return;
    gsap.to(fillRef.current, {
      width: `${maxProgress}%`,
      duration: 1,
      ease: 'none',
    });
    gsap.to(inverseTextRef.current, {
      clipPath: `inset(0 ${100 - maxProgress}% 0 0)`,
      duration: 1,
      ease: 'none',
    });
  }, [progress]);

  return (
    <Html center>
      <div className="relative h-12 w-44">
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
