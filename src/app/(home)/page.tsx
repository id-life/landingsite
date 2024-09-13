'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useSetAtom } from 'jotai';
import { useGSAP } from '@gsap/react';
import Vision from '@/app/vision/Vision';
import { smootherAtom } from '@/atoms/scroll';
import Partners from '@/app/partners/Partners';
import Processes from '@/app/processes/Processes';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Intervention from '@/app/intervention/Intervention';

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
      <div className="px-12 pt-36" ref={contentRef}>
        <Vision />
        <Processes />
        <Partners />
      </div>
    </div>
  );
}
