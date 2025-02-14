'use client';

import Portfolio from '@/app/portfolio/_components/Portfolio';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import MobilePortfolio from './_components/MobilePortfolio';

export default function PortfolioPage() {
  const isMobile = useIsMobile();

  useGSAP(() => {
    const smoother = ScrollSmoother.create({
      wrapper: '#wrapper',
      content: '#content',
      smooth: 1,
      effects: true,
      smoothTouch: 0.1,
    });
    const root = document.documentElement;
    root.style.setProperty('--gradient-from', '#000000');
    root.style.setProperty('--gradient-to', '#C111114C');
    root.style.setProperty('--background', '#000000');
    root.style.setProperty('--foreground', '#F0F0F0');
    gsap.set('.base-background2', { opacity: 0 });
    setTimeout(() => {
      smoother.scrollTo(`#portfolio_page`, false, 'top 10px');
      requestAnimationFrame(() => smoother.scrollTo('.page2-contact', true, `${window.innerHeight}px`));
    }, 1600);
  }, []);
  return (
    <>
      <div id="wrapper">
        <div id="content">{isMobile ? <MobilePortfolio /> : <Portfolio />}</div>
      </div>
    </>
  );
}
