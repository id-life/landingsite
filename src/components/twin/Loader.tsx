'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useSetAtom } from 'jotai';
import { useGSAP } from '@gsap/react';
import { twinGlLoadedAtom } from '@/atoms/geo';
import { Html, useProgress } from '@react-three/drei';

export default function Loader() {
  const { progress, active } = useProgress();
  const [maxProgress, setMaxProgress] = useState(0);
  const setTwinLoaded = useSetAtom(twinGlLoadedAtom);

  const fillRef = useRef(null);
  const inverseTextRef = useRef(null);

  useEffect(() => {
    if (!active) {
      setTwinLoaded(true);
    }
    return () => {
      setTwinLoaded(true);
    };
  }, [active, setTwinLoaded]);

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
        <div className="loading-text absolute flex h-full w-full items-center justify-center text-[2rem]/[2.5rem] font-semibold text-red-600">
          Loading...
        </div>
        <div
          ref={inverseTextRef}
          className="absolute z-30 flex h-full w-full items-center justify-center text-[2rem]/[2.5rem] font-semibold text-white"
          style={{ clipPath: 'inset(0 100% 0 0)' }}
        >
          Loading...
        </div>
        <div ref={fillRef} className="absolute z-20 h-full w-0 bg-red-600"></div>
      </div>
    </Html>
  );
}
