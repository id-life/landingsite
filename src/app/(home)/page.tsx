'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import Fund from '@/app/fund/Fund';
import { useGSAP } from '@gsap/react';
import Vision from '@/app/vision/Vision';
import VisionGL from '@/components/gl/VisionGL';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

export default function Home() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    ScrollSmoother.create({
      wrapper: wrapperRef.current,
      content: contentRef.current,
      smooth: 1,
      effects: true,
      smoothTouch: 0.1,
    });

    const root = document.documentElement;
    const background = getComputedStyle(root).getPropertyValue('--background');
    const foreground = getComputedStyle(root).getPropertyValue('--foreground');
    const pages = gsap.utils.toArray<HTMLDivElement>('.page-container');
    pages.forEach((page) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: page,
          start: () => `bottom ${window.innerHeight}`,
          scrub: true,
        },
      });
      tl.to('.base-background2', { opacity: 0 }, 0);
      tl.to(root, {
        '--gradient-from': '#000000',
        '--gradient-to': '#c111114c',
        '--background': foreground,
        '--foreground': background,
      });
    });
  });

  return (
    <>
      <VisionGL />
      <div ref={wrapperRef}>
        <div id="content" ref={contentRef}>
          <Vision />
          <Fund />
        </div>
      </div>
    </>
  );
}
