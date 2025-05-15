import { globalLoadedAtom } from '@/atoms/geo';
import { CarouselItem } from '@/components/common/PCFixedUI';
import VerticalCarousel from '@/components/common/VerticalCarousel';
import { NAV_LIST } from '@/components/nav/nav';
import { CAROUSEL_ITEMS } from '@/constants/config';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useAtomValue } from 'jotai';
import { useRef } from 'react';

export default function Vision() {
  const wrapperRef = useRef(null);
  const visionBottomRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const globalLoaded = useAtomValue(globalLoadedAtom);

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
        {globalLoaded && (
          <div className="absolute left-1/2 top-[calc(100svh_-_12rem)] -translate-x-1/2 items-center gap-2 font-oxanium text-3xl font-bold uppercase mobile:top-[calc(100svh_-5.625rem)] mobile:rounded-lg mobile:px-1.5 mobile:py-2">
            a purpose-driven longevity fund backing 10+ pioneers
          </div>
        )}
        {isMobile && globalLoaded && (
          <VerticalCarousel
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
