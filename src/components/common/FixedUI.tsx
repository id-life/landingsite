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
import { ReactNode, useMemo } from 'react';
import { ClientOnly } from './ClientOnly';
import VerticalCarousel from './VerticalCarousel';

export const CAROUSEL_ITEMS: { text?: string; cnText?: string; icon: ReactNode }[] = [
  {
    text: 'Immortal Dragons is a purpose-driven longevity fund',
    icon: <VisionDecorationLogo_1 className="h-12 w-12 fill-foreground mobile:h-9 mobile:w-9" />,
  },
  {
    cnText: '破解永生密码',
    icon: <VisionDecorationLogo_1 className="h-12 w-12 fill-foreground mobile:h-9 mobile:w-9" />,
  },
  {
    text: 'Igniting longevity revolution',
    icon: <VisionDecorationLogo_2 className="h-12 w-12 fill-foreground mobile:h-9 mobile:w-9" />,
  },
  {
    cnText: '解码生命永恒密码',
    icon: <VisionDecorationLogo_2 className="h-12 w-12 fill-foreground mobile:h-9 mobile:w-9" />,
  },
  {
    text: 'Catalysing longevity revolution',
    icon: <VisionDecorationLogo_3 className="h-12 w-12 fill-foreground mobile:h-9 mobile:w-9" />,
  },
  {
    cnText: '突破衰老科学边界',
    icon: <VisionDecorationLogo_3 className="h-12 w-12 fill-foreground mobile:h-9 mobile:w-9" />,
  },
  {
    text: 'Setting forth unlimited human healthy lifespan',
    icon: <VisionDecorationLogo_4 className="h-12 w-12 fill-foreground mobile:h-9 mobile:w-9" />,
  },
  {
    cnText: '重塑人类寿命极限',
    icon: <VisionDecorationLogo_4 className="h-12 w-12 fill-foreground mobile:h-9 mobile:w-9" />,
  },
  {
    text: 'Bringing global awareness of longevity',
    icon: <VisionDecorationLogo_5 className="h-12 w-12 fill-foreground mobile:h-9 mobile:w-9" />,
  },
  {
    cnText: '连接全球创新网络',
    icon: <VisionDecorationLogo_5 className="h-12 w-12 fill-foreground mobile:h-9 mobile:w-9" />,
  },
  {
    text: 'Harnessing collective recognition of the significance of Longevity',
    icon: <VisionDecorationLogo_6 className="h-12 w-12 fill-foreground mobile:h-9 mobile:w-9" />,
  },
  {
    cnText: '加速长寿技术革命',
    icon: <VisionDecorationLogo_6 className="h-12 w-12 fill-foreground mobile:h-9 mobile:w-9" />,
  },
];

export default function FixedUI() {
  const isMobile = useIsMobile();
  return (
    <>
      <div className="fixed-top fixed left-10 top-[calc(50%_-_14rem)] h-2 w-6 bg-foreground transition duration-300 mobile:left-5 mobile:top-[7.5rem] mobile:h-1 mobile:w-3" />
      <div className="fixed-bottom fixed left-10 top-[calc(50%_+_16rem)] h-2 w-9 bg-foreground transition duration-300 mobile:bottom-[7.5rem] mobile:left-5 mobile:top-auto mobile:h-1 mobile:w-4.5" />
      <div className="fixed-bottom fixed right-10 top-[calc(50%_+_14rem)] aspect-square h-4 bg-foreground transition duration-300 mobile:bottom-[7.5rem] mobile:right-5 mobile:top-auto mobile:h-2" />
      <div className="fixed-top fixed right-[13.5rem] top-[calc(50%_-_14rem)] aspect-square h-4 bg-foreground transition duration-300 mobile:right-[6.75rem] mobile:top-[7.5rem] mobile:h-2" />
      <VisionDecorationCircleSVG className="fixed-top fixed right-10 top-[calc(50%_-_14rem)] h-4 w-4 fill-foreground stroke-foreground transition duration-300 mobile:right-5 mobile:top-[7.5rem] mobile:h-2 mobile:w-2" />
      {!isMobile && (
        <VerticalCarousel
          slideDown
          itemHeight={isMobile ? 36 : 48}
          duration={10}
          transition={0.6}
          className="fixed bottom-10 left-10 w-[25rem] mobile:pointer-events-none mobile:inset-x-0 mobile:mobile:top-[calc(100svh_-_12.625rem)] mobile:w-auto"
        >
          {CAROUSEL_ITEMS.map((item) => (
            <CarouselItem key={item.text} {...item} />
          ))}
        </VerticalCarousel>
      )}
      {!isMobile && (
        <ClientOnly>
          <ToggleSoundButton className="fixed bottom-10 right-10 z-10" />
        </ClientOnly>
      )}
      <FixedValue />
      <FixedCard />
    </>
  );
}

export function CarouselItem({ text, cnText, icon }: { text?: string; cnText?: string; icon: ReactNode }) {
  const isMobile = useIsMobile();
  const content = useMemo(() => {
    if (text) return <p className="line-clamp-2 mobile:text-center mobile:text-sm/4.5 mobile:font-semibold">{text}</p>;
    if (cnText)
      return (
        <p className="bilingual-font line-clamp-2 mobile:text-center mobile:text-base/5 mobile:font-bold">
          {isMobile ? `- ${cnText} -` : cnText}
        </p>
      );

    return '';
  }, [cnText, isMobile, text]);

  return (
    <div className="flex items-center gap-1 text-base/4.5 font-bold uppercase text-foreground mobile:w-[17.1875rem] mobile:items-center mobile:justify-center">
      {!isMobile && icon}
      {content}
    </div>
  );
}
