'use client';

import { useGSAP } from '@gsap/react';
import { Html, useProgress } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Loader() {
  const { progress } = useProgress();
  const [maxProgress, setMaxProgress] = useState(0);

  const fillRef = useRef(null);
  const inverseTextRef = useRef(null);

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
        <div className="loading-text absolute flex h-full w-full items-center justify-center text-[2rem]/[2.5rem] font-semibold text-white">
          Loading...
        </div>
        <div
          ref={inverseTextRef}
          className="absolute z-30 flex h-full w-full items-center justify-center text-[2rem]/[2.5rem] font-semibold text-black"
          style={{ clipPath: 'inset(0 100% 0 0)' }}
        >
          Loading...
        </div>
        <div ref={fillRef} className="absolute z-20 h-full w-0 bg-white"></div>
      </div>
    </Html>
  );
}
