'use client';

import Footer from '@/components/layout/footer/Footer';
import Portfolio from '@/app/portfolio/_components/Portfolio';
import Value from '@/app/value/Value';
import Vision from '@/app/vision/Vision';
import { currentPageAtom } from '@/atoms';
import ThreeWrapper from '@/components/gl/ThreeWrapper';
import { NAV_LIST } from '@/components/nav/nav';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useSetAtom } from 'jotai/index';
import Engagement from '@/app/engagement/Engagement';
import TwinThreeWrapper from '@/components/twin/TwinThreeWrapper';
import Twin from '@/app/twin/Twin';

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
    const engagementTL = gsap.timeline({
      scrollTrigger: {
        trigger: `#${NAV_LIST[2].id}`,
        start: 'top bottom',
        end: 'top center',
        scrub: true,
        onEnter: () => {
          setCurrentPage(NAV_LIST[1]);
        },
        onEnterBack: () => {
          setCurrentPage(NAV_LIST[1]);
        },
      },
    });
    engagementTL.to(root, {
      '--gradient-from': '#000000',
      '--gradient-to': '#000000',
      '--background': '#000000',
      '--foreground': '#FFFFFF',
    });
    const twinTL = gsap.timeline({
      scrollTrigger: {
        trigger: `#${NAV_LIST[3].id}`,
        start: 'top bottom+=400',
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
    twinTL.to(root, {
      '--gradient-from': '#FFFFFF',
      '--gradient-to': '#CBD6EA',
      '--background': '#F0F0F0',
      '--foreground': '#000000',
    });
    twinTL.to('.base-background2', { opacity: 1 });
  });

  return (
    <>
      <ThreeWrapper />
      <TwinThreeWrapper />
      <div id="wrapper">
        <div id="content">
          <Vision />
          <Portfolio />
          <Engagement />
          <Twin />
          <Value />
          <Footer />
        </div>
      </div>
    </>
  );
}
