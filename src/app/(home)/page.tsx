'use client';

import React from 'react';
import gsap from 'gsap';
import Portfolio from '@/app/portfolio/Portfolio';
import { useGSAP } from '@gsap/react';
import Value from '@/app/value/Value';
import Vision from '@/app/vision/Vision';
import { useSetAtom } from 'jotai/index';
import { currentPageAtom } from '@/atoms';
import { NAV_LIST } from '@/components/nav/nav';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import ThreeWrapper from '@/components/gl/ThreeWrapper';
import Footer from '@/app/footer/Footer';
import { useIsMobile } from '@/hooks/useIsMobile';

export default function Home() {
  const setCurrentPage = useSetAtom(currentPageAtom);
  const isMobile = useIsMobile();

  useGSAP(
    () => {
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
      if (isMobile) visionTL.to(['.fixed-top', '.fixed-bottom'], { opacity: 0 });
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
          start: 'top bottom+=500',
          end: 'top center',
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
    },
    { dependencies: [isMobile] },
  );

  return (
    <>
      <ThreeWrapper />
      <div id="wrapper">
        <div id="content">
          <Vision />
          <Portfolio />
          <Value />
          <Footer />
        </div>
      </div>
    </>
  );
}
