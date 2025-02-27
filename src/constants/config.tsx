import VisionDecorationLogo_1 from '@/../public/svgs/vision/vision-decoration-logo-1.svg?component';
import VisionDecorationLogo_2 from '@/../public/svgs/vision/vision-decoration-logo-2.svg?component';
import VisionDecorationLogo_3 from '@/../public/svgs/vision/vision-decoration-logo-3.svg?component';
import VisionDecorationLogo_4 from '@/../public/svgs/vision/vision-decoration-logo-4.svg?component';
import VisionDecorationLogo_5 from '@/../public/svgs/vision/vision-decoration-logo-5.svg?component';
import VisionDecorationLogo_6 from '@/../public/svgs/vision/vision-decoration-logo-6.svg?component';
import { ReactNode } from 'react';

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
