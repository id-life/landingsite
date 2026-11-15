import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import { PAGE_IDS } from '@/constants/pages';

const PAGE_ID = 'vision_page';

/** Mission. Section changes are the section controller's (src/motion/sectionController.ts); it rests at the top. */
export default function Vision() {
  const wrapperRef = useRef(null);
  const visionBottomRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: `#${PAGE_ID}`,
        start: 'top bottom',
        endTrigger: `#${PAGE_IDS.PORTFOLIO}`,
        end: 'top top',
        id: 'vision-trigger',
      });
    },

    { scope: wrapperRef },
  );

  return (
    <div ref={wrapperRef} id={PAGE_ID} className="page-container">
      <div ref={visionBottomRef} className="group pointer-events-none absolute inset-0 -z-10 select-none"></div>
    </div>
  );
}
