'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import Fund from '../fund/Fund';
import { useSetAtom } from 'jotai';
import { useGSAP } from '@gsap/react';
import Vision from '@/app/vision/Vision';
import { smootherAtom } from '@/atoms/scroll';
import Processes from '@/app/processes/Processes';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

const ease = 'power2.out';

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

    const root = document.documentElement;
    const IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const background = getComputedStyle(root).getPropertyValue('--background');
    const foreground = getComputedStyle(root).getPropertyValue('--foreground');
    const pages = gsap.utils.toArray<HTMLDivElement>('.page-container');
    pages.forEach((page, index) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: page,
          start: () => `bottom ${window.innerHeight}`,
          pin: !IS_MOBILE,
          pinSpacing: false,
          scrub: true,
        },
      });
      tl.to(page, { opacity: 0, ease }, 0);
      if (index === 0) {
        tl.to(
          root,
          {
            ease,
            '--background': foreground,
            '--foreground': background,
            '--nav': '#00000000',
            '--gradient': '#c111114c',
          },
          0,
        );
      } else {
        tl.to(root, {
          ease,
          '--background': background,
          '--foreground': foreground,
          '--nav': background,
          '--gradient': '#c1111100',
        });
      }
    });
  });

  return (
    <div ref={wrapperRef}>
      <div id="content" className="px-12 pt-34 mobile:p-0 mobile:pt-20" ref={contentRef}>
        <Vision />
        <Fund />
        <Processes />
      </div>
    </div>
  );
}
