'use client';

import { useRef } from 'react';
import { useSetAtom } from 'jotai';
import { useGSAP } from '@gsap/react';
import Vision from '@/app/vision/Vision';
import { smootherAtom } from '@/atoms/scroll';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

export default function Home() {
  const setSmoother = useSetAtom(smootherAtom);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const smoother = ScrollSmoother.create({
      wrapper: wrapperRef.current,
      content: contentRef.current,
      smooth: 1,
      effects: true,
      smoothTouch: 0.1,
    });
    setSmoother(smoother);
  });

  return (
    <div ref={wrapperRef}>
      <div id="content" ref={contentRef}>
        <Vision />
      </div>
    </div>
  );
}
