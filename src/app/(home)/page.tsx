'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import Fund from '@/app/fund/Fund';
import { useGSAP } from '@gsap/react';
import Value from '@/app/value/Value';
import Vision from '@/app/vision/Vision';
import { useSetAtom } from 'jotai/index';
import { currentPageAtom } from '@/atoms';
import VisionGL from '@/components/gl/VisionGL';
import { NAV_LIST } from '@/components/nav/nav';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import ThreeWrapper from '@/components/gl/ThreeWrapper';

export default function Home() {
  const setCurrentPage = useSetAtom(currentPageAtom);

  useGSAP(() => {
    ScrollSmoother.create({ wrapper: '#wrapper', content: '#content', smooth: 1, effects: true, smoothTouch: 0.1 });
    const root = document.documentElement;
    const visionTL = gsap.timeline({
      scrollTrigger: {
        trigger: `#${NAV_LIST[0].id}`,
        start: 'center top',
        end: 'bottom top',
        scrub: true,
        onEnter: () => {
          setCurrentPage(NAV_LIST[0]);
        },
        onEnterBack: () => {
          setCurrentPage(NAV_LIST[0]);
        },
      },
    });
    visionTL.to('.base-background2', { opacity: 0 });
    visionTL.to(root, {
      '--gradient-from': '#000000',
      '--gradient-to': '#C111114C',
      '--background': '#000000',
      '--foreground': '#F0F0F0',
    });
    const valueTL = gsap.timeline({
      scrollTrigger: {
        trigger: `#${NAV_LIST[2].id}`,
        start: 'top bottom+=400',
        end: '+=500',
        scrub: true,
        onEnter: () => {
          setCurrentPage(NAV_LIST[2]);
        },
        onEnterBack: () => {
          setCurrentPage(NAV_LIST[2]);
        },
      },
    });
    valueTL.to(root, {
      '--gradient-from': '#FFFFFF',
      '--gradient-to': '#CBD6EA',
      '--background': '#F0F0F0',
      '--foreground': '#000000',
    });
    valueTL.to('.base-background2', { opacity: 1 });
    valueTL.to('#vision-canvas', { zIndex: 1, opacity: 1, duration: 1, delay: 0.5 });
    valueTL.to('#page-value-1', { opacity: 1 });
  });

  return (
    <>
      <ThreeWrapper />
      <div id="wrapper">
        <div id="content">
          <Vision />
          <Fund />
          <Value />
        </div>
      </div>
    </>
  );
}
