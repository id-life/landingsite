import { CAROUSEL_ITEMS, CarouselItem } from '@/components/common/FixedUI';
import VerticalCarousel from '@/components/common/VerticalCarousel';
import { NAV_LIST } from '@/components/nav/nav';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';

export default function Vision() {
  const wrapperRef = useRef(null);
  const visionBottomRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  useGSAP(
    () => {
      gsap.to(visionBottomRef.current, {
        opacity: 0,
        scrollTrigger: { toggleActions: 'play none none reverse' },
      });
    },

    { scope: wrapperRef },
  );
  return (
    <div ref={wrapperRef} id={NAV_LIST[0].id} className="page-container">
      <div ref={visionBottomRef} className="group pointer-events-none absolute inset-0 -z-10 select-none">
        {/* <div className="absolute left-1/2 top-[calc(100svh_-_6rem)] -translate-x-1/2 items-center gap-2 mobile:top-[calc(100svh_-5.625rem)] mobile:rounded-lg mobile:px-1.5 mobile:py-2">
          <VisionDecorationBottomScrollSVG className="mx-auto h-12 w-10 mobile:h-9 mobile:w-7.5" />
          <p className="font-migrena text-xl/6 font-bold uppercase mobile:text-xs/5">SCROLL</p>
        </div> */}
        {isMobile && (
          <VerticalCarousel
            isShuffle
            slideDown
            itemHeight={40}
            duration={5}
            transition={0.6}
            className="fixed-logo pointer-events-none absolute inset-x-0 top-[calc(50svh_+_8.5rem)] w-auto -translate-y-1/2"
          >
            {CAROUSEL_ITEMS.map((item) => (
              <CarouselItem key={item.cnText ?? item.text} {...item} />
            ))}
          </VerticalCarousel>
        )}
      </div>
    </div>
  );
}
