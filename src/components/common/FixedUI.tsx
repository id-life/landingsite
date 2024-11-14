'use client';

import VisionDecorationCircleSVG from '@/../public/svgs/vision/vision-decoration-3.svg?component';
import VisionDecorationLogo_1 from '@/../public/svgs/vision/vision-decoration-logo-1.svg?component';
import VisionDecorationLogo_2 from '@/../public/svgs/vision/vision-decoration-logo-2.svg?component';
import VisionDecorationLogo_3 from '@/../public/svgs/vision/vision-decoration-logo-3.svg?component';
import VisionDecorationLogo_4 from '@/../public/svgs/vision/vision-decoration-logo-4.svg?component';
import VisionDecorationLogo_5 from '@/../public/svgs/vision/vision-decoration-logo-5.svg?component';
import VisionDecorationLogo_6 from '@/../public/svgs/vision/vision-decoration-logo-6.svg?component';
import FixedCard from '@/app/value/FixedCard';
import FixedValue from '@/app/value/FixedValue';
import ToggleSoundButton from '@/components/common/ToggleSoundButton';
import { useIsMobile } from '@/hooks/useIsMobile';
import { ReactNode } from 'react';
import VerticalCarousel from './VerticalCarousel';

const CAROUSEL_ITEMS = [
  {
    text: 'Setting forth unlimited human healthy lifespan',
    icon: <VisionDecorationLogo_1 className="h-12 w-12 fill-foreground mobile:h-6 mobile:w-6" />,
  },
  {
    text: 'Igniting longevity revolution',
    icon: <VisionDecorationLogo_2 className="h-12 w-12 fill-foreground mobile:h-6 mobile:w-6" />,
  },
  {
    text: 'Catalysing longevity revolution',
    icon: <VisionDecorationLogo_3 className="h-12 w-12 fill-foreground mobile:h-6 mobile:w-6" />,
  },
  {
    text: 'Setting forth unlimited human healthy lifespan',
    icon: <VisionDecorationLogo_4 className="h-12 w-12 fill-foreground mobile:h-6 mobile:w-6" />,
  },
  {
    text: 'Bringing global awareness of longevity',
    icon: <VisionDecorationLogo_5 className="h-12 w-12 fill-foreground mobile:h-6 mobile:w-6" />,
  },
  {
    text: 'Harnessing collective recognition of the significance of Longevity',
    icon: <VisionDecorationLogo_6 className="h-12 w-12 fill-foreground mobile:h-6 mobile:w-6" />,
  },
];

export default function FixedUI() {
  const isMobile = useIsMobile();
  return (
    <>
      <div className="fixed-top fixed left-10 top-[calc(50%_-_14rem)] h-2 w-6 bg-foreground transition duration-300 mobile:hidden" />
      <div className="fixed-bottom fixed left-10 top-[calc(50%_+_14rem)] h-2 w-9 bg-foreground transition duration-300 mobile:hidden" />
      <div className="fixed-bottom fixed right-10 top-[calc(50%_+_14rem)] h-4 w-4 bg-foreground transition duration-300 mobile:hidden" />
      <div className="fixed-top fixed right-[13.5rem] top-[calc(50%_-_14rem)] h-4 w-4 bg-foreground transition duration-300 mobile:hidden" />
      <VerticalCarousel
        slideDown
        itemHeight={isMobile ? 24 : 48}
        duration={10}
        transition={0.6}
        className="fixed bottom-10 left-10 w-[25rem] mobile:bottom-[3.2vw] mobile:left-[3.2vw] mobile:w-auto"
      >
        {CAROUSEL_ITEMS.map((item) => (
          <CarouselItem key={item.text} {...item} />
        ))}
      </VerticalCarousel>
      <VisionDecorationCircleSVG className="fixed-top fixed right-10 top-[calc(50%_-_14rem)] h-4 w-4 fill-foreground stroke-foreground transition duration-300 mobile:right-[3.2vw] mobile:h-[1.28vw] mobile:w-[1.28vw]" />
      <ToggleSoundButton className="fixed bottom-10 right-10 z-10 mobile:hidden" />
      <FixedValue />
      <FixedCard />
    </>
  );
}

function CarouselItem({ text, icon }: { text: string; icon: ReactNode }) {
  return (
    <div className="flex items-center gap-1 text-base/4.5 font-bold uppercase text-foreground mobile:w-[20rem] mobile:gap-[0.32vw] mobile:text-xs/3">
      {icon}
      <p className="line-clamp-2">{text}</p>
    </div>
  );
}
