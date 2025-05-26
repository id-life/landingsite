'use client';

import Engagement from '@/app/engagement/Engagement';
import Portfolio from '@/app/portfolio/_components/Portfolio';
import Twin from '@/app/twin/Twin';
import Value from '@/app/value/Value';
import Vision from '@/app/vision/Vision';
import { currentPageAtom } from '@/atoms';
import ThreeWrapper from '@/components/gl/ThreeWrapper';
import Footer from '@/components/layout/footer/Footer';
import { NAV_LIST } from '@/components/nav/nav';
import TwinThreeWrapper from '@/components/twin/TwinThreeWrapper';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useIsMounted } from '@/hooks/useIsMounted';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useAtom } from 'jotai';
import { throttle } from 'lodash-es';
import { useCallback, useEffect } from 'react';
import { useEvent } from 'react-use';
import FooterContact from '@/components/layout/footer/FooterContact';
import { useGA } from '@/hooks/useGA';
import { GA_EVENT_NAMES } from '@/constants/ga';

export default function Home() {
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom);
  const isMobile = useIsMobile();
  const isMounted = useIsMounted();

  const { trackEvent } = useGA();

  useEffect(() => {
    if (isMounted && !isMobile) {
      trackEvent({
        name: GA_EVENT_NAMES.ID_PAGE_VIEW,
        label: currentPage.id,
      });
    }
  }, [currentPage, isMobile, isMounted]);

  const initFontSize = useCallback(() => {
    if (!isMounted || isMobile) {
      document.documentElement.style.fontSize = '16px';
      return;
    }
    const width = window.innerWidth;
    const fontSize = 16 * (width / 1920);
    document.documentElement.style.fontSize = fontSize + 'px';
  }, [isMobile, isMounted]);

  useEffect(() => initFontSize(), [initFontSize]);
  useEvent('resize', throttle(initFontSize, 1000));

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
        start: 'top bottom',
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
          <FooterContact />
        </div>
      </div>
    </>
  );
}
