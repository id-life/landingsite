'use client';

import VisionDecorationCircleSVG from '@/../public/svgs/vision/vision-decoration-3.svg?component';
import VisionDecorationLogo_1 from '@/../public/svgs/vision/vision-decoration-logo-1.svg?component';
import VisionDecorationLogo_2 from '@/../public/svgs/vision/vision-decoration-logo-2.svg?component';
import VisionDecorationLogo_3 from '@/../public/svgs/vision/vision-decoration-logo-3.svg?component';
import FixedCard from '@/app/value/FixedCard';
import FixedValue from '@/app/value/FixedValue';
import ToggleSoundButton from '@/components/common/ToggleSoundButton';
import VerticalCarousel from './VerticalCarousel';

function CarouselItem({ text, icon }: { text: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1 text-base/4.5 font-bold uppercase text-foreground">
      {icon}
      {text}
    </div>
  );
}

export default function FixedUI() {
  return (
    <>
      <div className="fixed-top fixed left-10 top-[calc(50%_-_14rem)] h-2 w-6 bg-foreground transition duration-300" />
      <div className="fixed-bottom fixed left-10 top-[calc(50%_+_14rem)] h-2 w-9 bg-foreground transition duration-300" />
      <div className="fixed-bottom fixed right-10 top-[calc(50%_+_14rem)] h-4 w-4 bg-foreground transition duration-300" />
      <div className="fixed-top fixed right-[13.5rem] top-[calc(50%_-_14rem)] h-4 w-4 bg-foreground transition duration-300" />
      <VerticalCarousel slideDown itemHeight={48} duration={10} transition={0.6} className="fixed bottom-10 left-10 w-[25rem]">
        <CarouselItem
          text="Setting forth unlimited human healthy lifespan"
          icon={<VisionDecorationLogo_1 className="h-12 w-12 fill-foreground" />}
        />
        <CarouselItem
          text="Bringing global awareness of longevity"
          icon={<VisionDecorationLogo_2 className="h-12 w-12 fill-foreground" />}
        />
        <CarouselItem
          text="Harnessing collective recognition of the significance of Longevity"
          icon={<VisionDecorationLogo_3 className="h-12 w-12 fill-foreground" />}
        />
      </VerticalCarousel>
      <VisionDecorationCircleSVG className="fixed-top fixed right-10 top-[calc(50%_-_14rem)] h-4 w-4 fill-foreground stroke-foreground transition duration-300" />
      <ToggleSoundButton className="fixed bottom-10 right-10 z-10 mobile:hidden" />
      <FixedValue />
      <FixedCard />
    </>
  );
}
