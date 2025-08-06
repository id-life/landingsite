'use client';

import Portfolio from '@/app/portfolio/_components/Portfolio';
import Twin from '@/app/twin/Twin';
import Value from '@/app/value/Value';
import Vision from '@/app/vision/Vision';
import { currentPageAtom } from '@/atoms';
import CharacterRelation from '@/components/character-relation/CharacterRelation';
import PCFixedUI from '@/components/common/PCFixedUI';
import Engagement from '@/components/engagement/Engagement';
import { OuterLoader } from '@/components/gl/ProgressLoader';
import ThreeWrapper from '@/components/gl/ThreeWrapper';
import Footer from '@/components/layout/footer/Footer';
import FooterContact from '@/components/layout/footer/FooterContact';
import { NAV_LIST } from '@/components/nav/nav';
import Spectrum from '@/components/spectrum/Spectrum';
import TwinThreeWrapper from '@/components/twin/TwinThreeWrapper';
import { GA_EVENT_NAMES } from '@/constants/ga';
import { useGA } from '@/hooks/useGA';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useIsMounted } from '@/hooks/useIsMounted';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useAtom } from 'jotai';
import { useEffect } from 'react';

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
  }, [currentPage, isMobile, isMounted, trackEvent]);

  useGSAP(() => {
    ScrollSmoother.create({ wrapper: '#wrapper', content: '#content', smooth: 1, effects: false, smoothTouch: 0.1 });
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
      '--gradient-via': '#1E0000',
      '--gradient-via-percent': '50%',
      '--gradient-to': '#C111114C',
      '--background': '#000000',
      '--foreground': '#F0F0F0',
      '--audio-player': '#F0F0F0',
      '--audio-content': '#101010',
      '--audio-border': '#1C1C1C',
      '--audio-order': '#222222',
      '--audio-desc': '#999999',
    });

    const spectrumTL = gsap.timeline({
      scrollTrigger: {
        trigger: `#${NAV_LIST[2].id}`,
        start: 'top bottom',
        end: 'top center',
        scrub: true,
      },
    });
    spectrumTL.to(root, {
      '--gradient-via': '#C1111111',
      '--gradient-to': '#C111114C',
      '--gradient-via-percent': '80%',
      '--gradient-rotate': '300deg',
      duration: 3,
    });

    const engagementTL = gsap.timeline({
      scrollTrigger: {
        trigger: `#${NAV_LIST[3].id}`,
        start: 'top bottom',
        end: 'top center',
        scrub: true,
      },
    });
    engagementTL.to(root, {
      '--gradient-from': '#000000',
      '--gradient-via': '#000000',
      '--gradient-via-percent': '50%',
      '--gradient-to': '#000000',
      '--background': '#000000',
      '--foreground': '#FFFFFF',
      duration: 0.01, // set the duration to 0.01 to avoid the flash
    });
    engagementTL.to(root, {
      '--gradient-from': '#000000',
      '--gradient-via': '#000000',
      '--gradient-via-percent': '50%',
      '--gradient-to': '#000000',
      '--background': '#000000',
      '--foreground': '#FFFFFF',
    });
    const twinTL = gsap.timeline({
      scrollTrigger: {
        trigger: `#${NAV_LIST[4].id}`,
        start: 'top bottom',
        end: 'top center',
        scrub: true,
      },
    });
    twinTL.to(root, {
      '--gradient-from': '#FFFFFF',
      '--gradient-via': '#e5ebf5',
      '--gradient-via-percent': '50%',
      '--gradient-to': '#CBD6EA',
      '--background': '#F0F0F0',
      '--foreground': '#000000',
      '--audio-player': '#2E2F31',
      '--audio-content': '#E2E8F4',
      '--audio-border': '#EEF4FF',
      '--audio-order': '#ffffff',
      '--audio-desc': '#222222',
    });
    twinTL.to('.base-background2', { opacity: 1 });
  });

  return (
    <>
      <OuterLoader />
      <ThreeWrapper />
      <TwinThreeWrapper />
      <div id="wrapper">
        <div id="content">
          <Vision />
          <Portfolio />
          <Spectrum />
          <Engagement />
          <Twin />
          <Value />
          <Footer />
          <FooterContact />
          <CharacterRelation />
        </div>
      </div>
      <PCFixedUI />
    </>
  );
}
