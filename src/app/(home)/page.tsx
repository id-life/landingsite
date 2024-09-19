'use client';

import Processes from '@/app/processes/Processes';
import Vision from '@/app/vision/Vision';
import { smootherAtom } from '@/atoms/scroll';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSetAtom } from 'jotai';
import { useRef } from 'react';
import Fund from '../fund/Fund';

export default function Home() {
  const setSmoother = useSetAtom(smootherAtom);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const smoother = ScrollSmoother.create({
        wrapper: wrapperRef.current,
        content: contentRef.current,
        smooth: 1,
        effects: true,
        smoothTouch: 0.1,
      });
      gsap.utils.toArray<HTMLDivElement>('.page-container').forEach((page) => {
        ScrollTrigger.create({
          trigger: page,
          start: () => `bottom ${window.innerHeight}`,
          pin: true,
          pinSpacing: false,
        });
      });
      setSmoother(smoother);
    },
    { scope: wrapperRef },
  );

  return (
    <div ref={wrapperRef}>
      <div className="mobile:p-0 px-12 pt-34" ref={contentRef}>
        <Vision />
        <Fund />
        <Processes />
      </div>
    </div>
  );
}
