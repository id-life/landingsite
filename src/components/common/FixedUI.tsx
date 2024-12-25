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
import { cn } from '@/utils';
import ScrollButton from './ScrollButton';
import { currentPageAtom } from '@/atoms';
import { useAtomValue } from 'jotai';
import { NAV_LIST } from '../nav/nav';
import PageArrows from './PageArrows';

export const CAROUSEL_ITEMS: { text?: string; cnText?: string; icon: ReactNode; textClass?: string }[] = [
  {
    text: 'Immortal Dragons is a purpose-driven longevity fund',
    icon: <VisionDecorationLogo_1 className="h-12 w-12 fill-foreground mobile:h-10 mobile:w-10" />,
    textClass: 'mobile:w-[16.25rem] w-[18.125rem]',
  },
  {
    cnText: '破解永生密码',
    icon: <VisionDecorationLogo_1 className="h-12 w-12 fill-foreground mobile:h-10 mobile:w-10" />,
  },
  {
    text: 'Igniting longevity revolution',
    icon: <VisionDecorationLogo_2 className="h-12 w-12 fill-foreground mobile:h-10 mobile:w-10" />,
  },
  {
    cnText: '解码生命永恒密码',
    icon: <VisionDecorationLogo_2 className="h-12 w-12 fill-foreground mobile:h-10 mobile:w-10" />,
  },
  {
    text: 'Catalysing longevity revolution',
    icon: <VisionDecorationLogo_3 className="h-12 w-12 fill-foreground mobile:h-10 mobile:w-10" />,
  },
  {
    cnText: '突破衰老科学边界',
    icon: <VisionDecorationLogo_3 className="h-12 w-12 fill-foreground mobile:h-10 mobile:w-10" />,
  },
  {
    text: 'Setting forth unlimited human healthy lifespan',
    icon: <VisionDecorationLogo_4 className="h-12 w-12 fill-foreground mobile:h-10 mobile:w-10" />,
    textClass: 'mobile:w-[15.125rem] w-[17.25rem]',
  },
  {
    cnText: '重塑人类寿命极限',
    icon: <VisionDecorationLogo_4 className="h-12 w-12 fill-foreground mobile:h-10 mobile:w-10" />,
  },
  {
    text: 'Bringing global awareness of longevity',
    icon: <VisionDecorationLogo_5 className="h-12 w-12 fill-foreground mobile:h-10 mobile:w-10" />,
    textClass: 'mobile:w-[13.625rem] w-[17.125rem]',
  },
  {
    cnText: '连接全球创新网络',
    icon: <VisionDecorationLogo_5 className="h-12 w-12 fill-foreground mobile:h-10 mobile:w-10" />,
  },
  {
    text: 'Harnessing collective recognition of the significance of Longevity',
    icon: <VisionDecorationLogo_6 className="h-12 w-12 fill-foreground mobile:h-10 mobile:w-10" />,
    textClass: 'mobile:w-[17.375rem w-[19.875rem]',
  },
  {
    cnText: '加速长寿技术革命',
    icon: <VisionDecorationLogo_6 className="h-12 w-12 fill-foreground mobile:h-10 mobile:w-10" />,
  },
];

export default function FixedUI() {
  const isMobile = useIsMobile();
  const currentPage = useAtomValue(currentPageAtom);
  return (
    <>
      {currentPage.id === NAV_LIST[0].id ? (
        <ScrollButton className="fixed bottom-11 left-1/2 -translate-x-1/2 mobile:bottom-7" />
      ) : (
        <PageArrows className="fixed bottom-11 left-1/2 -translate-x-1/2 mobile:bottom-7" />
      )}
      <div className="fixed-top fixed left-10 top-[calc(50%_-_14rem)] h-2 w-6 bg-foreground transition duration-300 mobile:left-5 mobile:top-[7.5rem] mobile:h-1 mobile:w-3" />
      <div className="fixed-bottom fixed left-10 top-[calc(50%_+_16rem)] h-2 w-9 bg-foreground transition duration-300 mobile:bottom-[7.5rem] mobile:left-5 mobile:top-auto mobile:h-1 mobile:w-4.5" />
      <div className="fixed-bottom fixed right-10 top-[calc(50%_+_14rem)] aspect-square h-4 bg-foreground transition duration-300 mobile:bottom-[7.5rem] mobile:right-5 mobile:top-auto mobile:h-2" />
      <div className="fixed-top fixed right-[13.5rem] top-[calc(50%_-_14rem)] aspect-square h-4 bg-foreground transition duration-300 mobile:right-[6.75rem] mobile:top-[7.5rem] mobile:h-2" />
      <VisionDecorationCircleSVG className="fixed-top fixed right-10 top-[calc(50%_-_14rem)] h-4 w-4 fill-foreground stroke-foreground transition duration-300 mobile:right-5 mobile:top-[7.5rem] mobile:h-2 mobile:w-2" />
      {!isMobile && (
        <VerticalCarousel
          isShuffle
          slideDown
          itemHeight={48}
          duration={5}
          transition={0.6}
          className="fixed bottom-10 left-10 w-[25rem] mobile:pointer-events-none mobile:inset-x-0 mobile:mobile:top-[calc(100svh_-_12.625rem)] mobile:w-auto"
        >
          {CAROUSEL_ITEMS.map((item) => (
            <CarouselItem key={item.cnText ?? item.text} {...item} />
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

export function CarouselItem({
  text,
  cnText,
  icon,
  textClass,
}: {
  text?: string;
  cnText?: string;
  icon: ReactNode;
  textClass?: string;
}) {
  const content = useMemo(() => {
    if (text)
      return (
        <p className={cn('line-clamp-2 text-center text-base/4.5 mobile:text-sm/4.5 mobile:font-bold', textClass)}>{text}</p>
      );
    if (cnText)
      return (
        <p className={cn('bilingual-font line-clamp-2 text-center text-xl/6 mobile:text-base/5 mobile:font-bold', textClass)}>
          {cnText}
        </p>
      );

    return '';
  }, [cnText, text, textClass]);

  return (
    <div className="flex items-center gap-1 text-base/4.5 font-bold uppercase text-foreground mobile:justify-center">
      {icon}
      {content}
    </div>
  );
}
