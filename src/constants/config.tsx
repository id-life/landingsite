import VisionDecorationLogo_1 from '@/../public/svgs/vision/vision-decoration-logo-1.svg?component';
import VisionDecorationLogo_2 from '@/../public/svgs/vision/vision-decoration-logo-2.svg?component';
import VisionDecorationLogo_3 from '@/../public/svgs/vision/vision-decoration-logo-3.svg?component';
import VisionDecorationLogo_4 from '@/../public/svgs/vision/vision-decoration-logo-4.svg?component';
import VisionDecorationLogo_5 from '@/../public/svgs/vision/vision-decoration-logo-5.svg?component';
import VisionDecorationLogo_6 from '@/../public/svgs/vision/vision-decoration-logo-6.svg?component';
import { NAV_LIST } from '@/components/nav/nav';
import { SLOGANS } from '@/content/slogans';
import { ReactNode } from 'react';

type CarouselItemData = { text?: string; cnText?: string; icon: ReactNode; textClass?: string };

/** Slogan presentation (icon, width), keyed by the slogan id in src/content/slogans.ts. */
const SLOGAN_VIEW: Record<string, Omit<CarouselItemData, 'text' | 'cnText'>> = {
  'purpose-driven-fund': {
    icon: <VisionDecorationLogo_1 className="size-[48px] fill-foreground mobile:h-10 mobile:w-[40px]" />,
    textClass: 'mobile:w-[16.25rem] w-[18.125rem]',
  },
  'crack-immortality-code': {
    icon: <VisionDecorationLogo_1 className="size-[48px] fill-foreground mobile:h-10 mobile:w-[40px]" />,
  },
  'igniting-revolution': {
    icon: <VisionDecorationLogo_2 className="size-[48px] fill-foreground mobile:h-10 mobile:w-[40px]" />,
  },
  'decode-eternal-life': {
    icon: <VisionDecorationLogo_2 className="size-[48px] fill-foreground mobile:h-10 mobile:w-[40px]" />,
  },
  'catalysing-revolution': {
    icon: <VisionDecorationLogo_3 className="size-[48px] fill-foreground mobile:h-10 mobile:w-[40px]" />,
  },
  'break-aging-frontiers': {
    icon: <VisionDecorationLogo_3 className="size-[48px] fill-foreground mobile:h-10 mobile:w-[40px]" />,
  },
  'setting-forth-lifespan': {
    icon: <VisionDecorationLogo_4 className="size-[48px] fill-foreground mobile:h-10 mobile:w-[40px]" />,
    textClass: 'mobile:w-[15.125rem] w-[17.25rem]',
  },
  'reshape-lifespan-limit': {
    icon: <VisionDecorationLogo_4 className="size-[48px] fill-foreground mobile:h-10 mobile:w-[40px]" />,
  },
  'global-awareness': {
    icon: <VisionDecorationLogo_5 className="size-[48px] fill-foreground stroke-foreground mobile:h-10 mobile:w-[40px]" />,
    textClass: 'mobile:w-[13.625rem] w-[17.125rem]',
  },
  'connect-innovation-network': {
    icon: <VisionDecorationLogo_5 className="size-[48px] fill-foreground stroke-foreground mobile:h-10 mobile:w-[40px]" />,
  },
  'collective-recognition': {
    icon: <VisionDecorationLogo_6 className="size-[48px] fill-foreground mobile:h-10 mobile:w-[40px]" />,
    textClass: 'mobile:w-[17.375rem] w-[19.875rem]',
  },
  'accelerate-longevity-tech': {
    icon: <VisionDecorationLogo_6 className="size-[48px] fill-foreground mobile:h-10 mobile:w-[40px]" />,
  },
};

/** Every hero slogan, English and Chinese. The Chinese lines are kept for the /zh locale. */
export const ALL_CAROUSEL_ITEMS: CarouselItemData[] = SLOGANS.map(({ id, locale, text }) => ({
  ...(locale === 'en' ? { text } : { cnText: text }),
  ...SLOGAN_VIEW[id],
}));

/**
 * The hero carousel shows the English slogans only, in this fixed order. It used to alternate English
 * and Chinese lines in a shuffled order, so the slogan changed language while it was read (CON-12).
 */
export const CAROUSEL_ITEMS: CarouselItemData[] = ALL_CAROUSEL_ITEMS.filter((item) => item.text);

export const CONNECT_PAGE_INDEX = NAV_LIST.findIndex((item) => item.id === 'connect_page');
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
    '--audio-desc': '#222222',
    '--subscribe-border': '#ffffff',
    '--subscribe-bg': '#ffffff33',
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
    '--audio-desc': '#999999',
    '--subscribe-border': '#57595C80',
    '--subscribe-bg': '#00000033',
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
    '--audio-desc': '#999999',
    '--subscribe-border': '#57595C80',
    '--subscribe-bg': '#00000033',
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
    '--audio-desc': '#999999',
    '--subscribe-border': '#57595C80',
    '--subscribe-bg': '#00000033',
  },
} as const;
