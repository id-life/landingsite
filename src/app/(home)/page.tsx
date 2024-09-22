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
    const background = getComputedStyle(root).getPropertyValue('--background');
    const foreground = getComputedStyle(root).getPropertyValue('--foreground');
    const pages = gsap.utils.toArray<HTMLDivElement>('.page-container');
    pages.forEach((page, index) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: page,
          start: () => `bottom ${window.innerHeight}`,
          pin: true,
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
        tl.to(
          root,
          {
            ease,
            '--background': background,
            '--foreground': foreground,
            '--nav': background,
            '--gradient': '#c1111100',
          },
          0,
        );
      }
    });

    const pagesY = pages.map((page) => page.getBoundingClientRect().y);
    const navHeight = document.querySelector('#nav')?.clientHeight ?? 0;

    let timer: NodeJS.Timeout;
    let isScrolling = false;
    window.addEventListener('wheel', () => {
      clearTimeout(timer);
      timer = setTimeout(() => handleScrollEnd(), 120);
    });

    const handleScrollEnd = () => {
      if (isScrolling) return;
      const reversePageY = pagesY.find((pageY) => Math.abs(window.scrollY + navHeight - pageY) < 200);
      if (reversePageY) {
        isScrolling = true;
        gsap.to(window, {
          scrollTo: { y: reversePageY - navHeight, autoKill: false },
          ease,
          duration: 0.6,
          onComplete: () => {
            isScrolling = false;
          },
        });
      }
    };
  });

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
