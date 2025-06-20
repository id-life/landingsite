import VisionDecorationLogo_1 from '@/../public/svgs/vision/vision-decoration-logo-1.svg?component';
import VisionDecorationLogo_2 from '@/../public/svgs/vision/vision-decoration-logo-2.svg?component';
import VisionDecorationLogo_3 from '@/../public/svgs/vision/vision-decoration-logo-3.svg?component';
import VisionDecorationLogo_4 from '@/../public/svgs/vision/vision-decoration-logo-4.svg?component';
import VisionDecorationLogo_5 from '@/../public/svgs/vision/vision-decoration-logo-5.svg?component';
import VisionDecorationLogo_6 from '@/../public/svgs/vision/vision-decoration-logo-6.svg?component';
import { NAV_LIST } from '@/components/nav/nav';
import { ReactNode } from 'react';

export const CAROUSEL_ITEMS: { text?: string; cnText?: string; icon: ReactNode; textClass?: string }[] = [
  {
    text: 'Immortal Dragons is a purpose-driven longevity fund',
    icon: <VisionDecorationLogo_1 className="size-[48px] fill-foreground mobile:h-10 mobile:w-[40px]" />,
    textClass: 'mobile:w-[16.25rem] w-[18.125rem]',
  },
  {
    cnText: '破解永生密码',
    icon: <VisionDecorationLogo_1 className="size-[48px] fill-foreground mobile:h-10 mobile:w-[40px]" />,
  },
  {
    text: 'Igniting longevity revolution',
    icon: <VisionDecorationLogo_2 className="size-[48px] fill-foreground mobile:h-10 mobile:w-[40px]" />,
  },
  {
    cnText: '解码生命永恒密码',
    icon: <VisionDecorationLogo_2 className="size-[48px] fill-foreground mobile:h-10 mobile:w-[40px]" />,
  },
  {
    text: 'Catalysing longevity revolution',
    icon: <VisionDecorationLogo_3 className="size-[48px] fill-foreground mobile:h-10 mobile:w-[40px]" />,
  },
  {
    cnText: '突破衰老科学边界',
    icon: <VisionDecorationLogo_3 className="size-[48px] fill-foreground mobile:h-10 mobile:w-[40px]" />,
  },
  {
    text: 'Setting forth unlimited human healthy lifespan',
    icon: <VisionDecorationLogo_4 className="size-[48px] fill-foreground mobile:h-10 mobile:w-[40px]" />,
    textClass: 'mobile:w-[15.125rem] w-[17.25rem]',
  },
  {
    cnText: '重塑人类寿命极限',
    icon: <VisionDecorationLogo_4 className="size-[48px] fill-foreground mobile:h-10 mobile:w-[40px]" />,
  },
  {
    text: 'Bringing global awareness of longevity',
    icon: <VisionDecorationLogo_5 className="size-[48px] fill-foreground stroke-foreground mobile:h-10 mobile:w-[40px]" />,
    textClass: 'mobile:w-[13.625rem] w-[17.125rem]',
  },
  {
    cnText: '连接全球创新网络',
    icon: <VisionDecorationLogo_5 className="size-[48px] fill-foreground stroke-foreground mobile:h-10 mobile:w-[40px]" />,
  },
  {
    text: 'Harnessing collective recognition of the significance of Longevity',
    icon: <VisionDecorationLogo_6 className="size-[48px] fill-foreground mobile:h-10 mobile:w-[40px]" />,
    textClass: 'mobile:w-[17.375rem w-[19.875rem]',
  },
  {
    cnText: '加速长寿技术革命',
    icon: <VisionDecorationLogo_6 className="size-[48px] fill-foreground mobile:h-10 mobile:w-[40px]" />,
  },
];

export const VALUE_PAGE_INDEX = NAV_LIST.findIndex((item) => item.id === 'value_page');
export const SPECTRUM_PAGE_INDEX = NAV_LIST.findIndex((item) => item.id === 'spectrum_page');

export const BACKGROUND_THEME = {
  LIGHT: 'light',
  BLACK: 'black',
  BLACK_RED: 'black-red',
  BLACK_RED_2: 'black-red-2', // Spectrum page
} as const;

export type ValueOf<T> = T[keyof T];

export type BackgroundTheme = ValueOf<typeof BACKGROUND_THEME>;

export const BACKGROUND_COLORS = {
  [BACKGROUND_THEME.LIGHT]: {
    '--gradient-from': '#FFFFFF',
    '--gradient-to': '#CBD6EA',
    '--background': '#F0F0F0',
    '--foreground': '#000000',
    '--gradient-via': '#e5ebf5',
    '--gradient-via-percent': '50%',
    '--audio-player': '#2E2F31',
    '--audio-content': '#E2E8F4',
    '--audio-border': '#EEF4FF',
    '--audio-order': '#ffffff',
  },
  [BACKGROUND_THEME.BLACK]: {
    '--gradient-from': '#000000',
    '--gradient-to': '#000000',
    '--background': '#000000',
    '--foreground': '#FFFFFF',
    '--gradient-via': '#000000',
    '--gradient-via-percent': '50%',
    '--audio-player': '#F0F0F0',
    '--audio-content': '#101010',
    '--audio-border': '#1C1C1C',
    '--audio-order': '#222222',
  },
  [BACKGROUND_THEME.BLACK_RED]: {
    '--gradient-from': '#000000',
    '--gradient-to': '#C111114C',
    '--background': '#000000',
    '--foreground': '#F0F0F0',
    '--gradient-via': '#1E0000',
    '--gradient-via-percent': '50%',
    '--audio-player': '#F0F0F0',
    '--audio-content': '#101010',
    '--audio-border': '#1C1C1C',
    '--audio-order': '#222222',
  },
  [BACKGROUND_THEME.BLACK_RED_2]: {
    '--gradient-from': '#000000',
    '--gradient-to': '#C111114C',
    '--background': '#000000',
    '--foreground': '#F0F0F0',
    '--gradient-via': '#C1111111',
    '--gradient-via-percent': '80%',
    '--gradient-rotate': '300deg',
    '--audio-player': '#F0F0F0',
    '--audio-content': '#101010',
    '--audio-border': '#1C1C1C',
    '--audio-order': '#222222',
  },
} as const;
