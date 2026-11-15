import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import { PAGE_IDS } from '@/constants/pages';

const PAGE_ID = 'vision_page';

/** Mission. Section changes are the section controller's (src/motion/sectionController.ts); it rests at the top. */
export default function Vision() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const visionBottomRef = useRef<HTMLDivElement>(null);

  // Elements, not selectors: inside a scope, '#vision_page' (the scope itself) and '#portfolio_page' (outside it)
  // matched nothing, and GSAP warned on every refresh (MOT-14).
  useGSAP(() => {
    const portfolio = document.getElementById(PAGE_IDS.PORTFOLIO);
    if (!wrapperRef.current || !portfolio) return;
    ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: 'top bottom',
      endTrigger: portfolio,
      end: 'top top',
      id: 'vision-trigger',
    });
  });

  return (
    <div ref={wrapperRef} id={PAGE_ID} className="page-container">
      <div ref={visionBottomRef} className="group pointer-events-none absolute inset-0 -z-10 select-none"></div>
    </div>
  );
}
