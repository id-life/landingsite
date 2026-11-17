import VisionDecorationLogo_1 from '@/../public/svgs/vision/vision-decoration-logo-1.svg?component';
import VisionDecorationLogo_2 from '@/../public/svgs/vision/vision-decoration-logo-2.svg?component';
import VisionDecorationLogo_3 from '@/../public/svgs/vision/vision-decoration-logo-3.svg?component';
import VisionDecorationLogo_4 from '@/../public/svgs/vision/vision-decoration-logo-4.svg?component';
import VisionDecorationLogo_5 from '@/../public/svgs/vision/vision-decoration-logo-5.svg?component';
import VisionDecorationLogo_6 from '@/../public/svgs/vision/vision-decoration-logo-6.svg?component';
import { NAV_LIST } from '@/components/nav/nav';
import { SLOGANS } from '@/content/slogans';
import { themes } from '@/styles/tokens';
import { ReactNode } from 'react';

type CarouselItemData = { text?: string; cnText?: string; icon: ReactNode; textClass?: string };

/**
 * Slogan presentation (icon, width), keyed by the slogan id in src/content/slogans.ts. The desktop widths are in em:
 * they were drawn for the slogan's own size, so each line breaks where the original design broke it whatever size the
 * type role gives (in layout units the lines stayed narrow while the text grew, and the last words were cut off).
 */
const SLOGAN_VIEW: Record<string, Omit<CarouselItemData, 'text' | 'cnText'>> = {
  'purpose-driven-fund': {
    icon: <VisionDecorationLogo_1 className="size-[48px] fill-foreground mobile:h-10 mobile:w-[40px]" />,
    textClass: 'mobile:w-[16.25rem] w-[18.125em]',
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
    textClass: 'mobile:w-[15.125rem] w-[17.25em]',
  },
  'reshape-lifespan-limit': {
    icon: <VisionDecorationLogo_4 className="size-[48px] fill-foreground mobile:h-10 mobile:w-[40px]" />,
  },
  'global-awareness': {
    icon: <VisionDecorationLogo_5 className="size-[48px] fill-foreground stroke-foreground mobile:h-10 mobile:w-[40px]" />,
    textClass: 'mobile:w-[13.625rem] w-[17.125em]',
  },
  'connect-innovation-network': {
    icon: <VisionDecorationLogo_5 className="size-[48px] fill-foreground stroke-foreground mobile:h-10 mobile:w-[40px]" />,
  },
  'collective-recognition': {
    icon: <VisionDecorationLogo_6 className="size-[48px] fill-foreground mobile:h-10 mobile:w-[40px]" />,
    textClass: 'mobile:w-[17.375rem] w-[19.875em]',
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

// Every theme sets every property any of them sets: the phone deck tweens from whatever the last theme left on <html>,
// so a property one theme omits keeps the previous section's value (Spectrum's 300deg stayed on Insights, Portfolio
// and the rest after leaving it, where a fresh load draws the gradient at the stylesheet's 90deg).
export const BACKGROUND_COLORS = {
  [BACKGROUND_THEME.LIGHT]: { ...themes.light, '--gradient-via-percent': '50%', '--gradient-rotate': '90deg' },
  [BACKGROUND_THEME.BLACK]: { ...themes.black, '--gradient-via-percent': '50%', '--gradient-rotate': '90deg' },
  [BACKGROUND_THEME.BLACK_RED]: { ...themes.blackRed, '--gradient-via-percent': '50%', '--gradient-rotate': '90deg' },
  [BACKGROUND_THEME.BLACK_RED_2]: { ...themes.blackRed2, '--gradient-via-percent': '80%', '--gradient-rotate': '300deg' },
} as const;
