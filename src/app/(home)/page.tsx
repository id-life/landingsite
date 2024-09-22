'use client';

import Processes from '@/app/processes/Processes';
import Vision from '@/app/vision/Vision';
import { smootherAtom } from '@/atoms/scroll';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useSetAtom } from 'jotai';
import { useRef } from 'react';
import Fund from '../fund/Fund';

const ease = 'power3.out';

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
      setSmoother(smoother);

      const root = document.documentElement;
      const background = getComputedStyle(root).getPropertyValue('--background');
      const foreground = getComputedStyle(root).getPropertyValue('--foreground');

      gsap.utils.toArray<HTMLDivElement>('.page-container').forEach((page, index) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: page,
            start: () => `bottom ${window.innerHeight}`,
            pin: true,
            pinSpacing: false,
            scrub: true,
          },
        });
        tl.to(page, { opacity: 0, ease });
        if (index === 0) {
          tl.to(root, { '--background': foreground, '--foreground': background, ease }, 0);
        } else {
          tl.to(root, { '--background': background, '--foreground': foreground, ease }, 0);
        }
      });
    },
    { scope: document.body },
  );

  return (
    <div ref={wrapperRef}>
      <div className="px-12 pt-34 mobile:p-0 mobile:pt-20" ref={contentRef}>
        <Vision />
        <Fund />
        <Processes />
      </div>
    </div>
  );
}
