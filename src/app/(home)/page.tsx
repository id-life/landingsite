'use client';

import Processes from '@/app/processes/Processes';
import Vision from '@/app/vision/Vision';
import { smootherAtom } from '@/atoms/scroll';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useSetAtom } from 'jotai';
import { useEffect, useRef } from 'react';
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
      smoothTouch: 0.05,
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

  useEffect(() => {
    const pages = gsap.utils.toArray<HTMLDivElement>('.page-container');
    const pagesY = pages.map((page) => page.getBoundingClientRect().y);
    const navHeight = document.querySelector('#nav')?.clientHeight ?? 0;
    let currentPageIndex = 0;
    let timer: NodeJS.Timeout;
    let isScrolling = false;
    let startY = window.scrollY;
    window.addEventListener('scroll', () => {
      clearTimeout(timer);
      timer = setTimeout(() => handleScrollEnd(), 80);
    });

    const handleScrollEnd = () => {
      const deltaY = window.scrollY - startY;
      if (isScrolling) return;
      let direction = deltaY > 0 ? 1 : -1;
      if (Math.abs(deltaY) < 100) direction = 0;
      if (currentPageIndex + direction < 0 || currentPageIndex + direction >= pages.length) return;
      currentPageIndex += direction;
      isScrolling = true;

      gsap.to(window, {
        scrollTo: { y: pagesY[currentPageIndex] - navHeight, autoKill: false },
        duration: 0.3,
        ease: 'power3.out',
        onComplete: () => {
          isScrolling = false;
          startY = window.scrollY;
        },
      });
    };
  }, []);

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
