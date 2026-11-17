import { cn } from '@/utils';
import { absoluteUrl } from '@/constants/site';
import { COMPANIES } from '@/content/companies';
import { ItemList, WithContext } from 'schema-dts';

import type { JSX } from 'react';

// The portfolio tiles. Companies are records in the content layer (src/content/companies.ts); this file adds their
// presentation, keyed by slug: the logo's size on a tile and the particle image shown when a tile is active.

export type PortfolioItemInfo = {
  slug: string;
  title: string;
  subTitle?: string;
  description: string;
  image: JSX.Element;
  link?: string;
  logoUrl: string;
};

const mobileImageClassName = 'mobile:h-full mobile:w-auto mobile:object-contain';

/** Logo classes per company (presentation only). */
const LOGO_CLASS: Record<string, string> = {
  'healthspan-capital': cn('w-19.5', mobileImageClassName),
  'frontier-bio': cn('w-68', mobileImageClassName, 'ipad:max-w-[230px]'),
  'unlimited-bio': cn('w-19.5', mobileImageClassName),
  'r3-bio': cn(mobileImageClassName, 'w-[8.75rem] mobile:w-[6.25rem]'),
  'immune-bridge': cn('w-[12.5rem]', mobileImageClassName),
  'cyclarity-therapeutics': cn('w-[12.5rem]', mobileImageClassName),
  kindbio: cn(mobileImageClassName, 'w-[11.25rem] mobile:w-[7.5rem]'),
  'mito-health': cn(mobileImageClassName, 'w-36 mobile:w-[6rem]'),
  'kangaroo-biomedical': cn(mobileImageClassName, 'h-12 mobile:-mt-3 mobile:h-10'),
  'renewal-bio': cn(mobileImageClassName, 'w-[10.625rem] mobile:h-auto mobile:w-[7.5rem]'),
  domayn: cn(mobileImageClassName, 'w-[11.25rem] mobile:w-[7.5rem]'),
  'oisin-biotechnologies': cn(mobileImageClassName, 'w-[11.25rem] mobile:h-11'),
  'etheros-pharmaceuticals': cn(mobileImageClassName, 'w-[8.375rem] mobile:h-11'),
  'longevity-technology': cn('w-19.5', mobileImageClassName),
  vitalia: cn('w-19.5', mobileImageClassName),
  eonark: cn(mobileImageClassName, 'w-[11.25rem] mobile:w-[7.5rem]'),
};

export const portfolio: PortfolioItemInfo[] = COMPANIES.map((company) => ({
  slug: company.slug,
  title: company.name,
  description: company.tagline.en,
  image: <img className={LOGO_CLASS[company.slug]} src={company.logo} alt={company.logoAlt} />,
  ...(company.url && { link: company.url }),
  logoUrl: company.logo,
}));

/** Markdown list lines ("- [Name](link): description") for text renderings such as llms.txt and the homepage profile. */
export const portfolioMarkdownLines = () =>
  portfolio.map(({ title, description, link }) => `- ${link ? `[${title}](${link})` : title}: ${description}`);

export const getPortfolioJsonLd = (): WithContext<ItemList> => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  // The section's own heading; no count (the page states none: owner, 2026-11-18, question 12f).
  name: 'Portfolio',
  url: absoluteUrl('/portfolio'),
  itemListElement: portfolio.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Organization',
      name: item.title,
      description: item.description,
      logo: absoluteUrl(item.logoUrl),
      ...(item.link && { url: item.link }),
    },
  })),
});

// Mobile particle scale multiplier - adjust this to uniformly control mobile particle size
// Higher = larger particles, Lower = smaller particles
const MOBILE_PARTICLE_SCALE = 0.3;

type ParticleConfig = {
  url: string;
  resize: number[];
  baseScale: number;
  loadPercentage?: number;
  forceColor?: [number, number, number];
  instantColor?: boolean;
  mobileScaleMultiplier?: number;
  mobileUrl?: string;
  mobileResize?: [number, number];
  mobileOpacity?: number;
  mobileLoadPercentage?: number;
};

export const portfolioGetSourceImgInfos = (isMobile: boolean) => {
  // The idle shape (index 0) and one image per company: tile i shows particle i + 1 (the phone Portfolio, usePortfolioItemAnimation).
  const idle: ParticleConfig = { url: '/imgs/particle/0.png', resize: [512, 300], baseScale: 2.2 };
  const bySlug: Record<string, ParticleConfig> = {
    'healthspan-capital': {
      url: '/imgs/particle/1.png',
      resize: [600, 600],
      baseScale: 0.8,
      loadPercentage: 0.005,
      mobileOpacity: 0.3,
    },
    'frontier-bio': {
      url: '/imgs/particle/5.png',
      resize: [300, 307],
      baseScale: 1,
      mobileScaleMultiplier: 1.8,
      loadPercentage: 0.008,
      mobileLoadPercentage: 0.004,
    },
    'unlimited-bio': {
      url: '/imgs/particle/9.png',
      resize: [600, 600],
      baseScale: 1,
      loadPercentage: 0.0012,
      mobileLoadPercentage: 0.002,
    },
    'r3-bio': {
      url: '/imgs/particle/4.png',
      resize: [300, 300],
      baseScale: 1.4,
      mobileScaleMultiplier: 1.4,
      loadPercentage: 0.002,
    },
    'immune-bridge': {
      url: '/imgs/particle/immune-bridge.png',
      resize: [584, 680],
      baseScale: 1,
      mobileScaleMultiplier: 0.8,
      loadPercentage: 0.002,
      mobileOpacity: 0.3,
    },
    'cyclarity-therapeutics': {
      url: '/imgs/particle/cyclarity.png',
      resize: [800, 115],
      baseScale: 1.2,
      mobileScaleMultiplier: 1.5,
      loadPercentage: 0.002,
      mobileUrl: '/imgs/particle/cyclarity-mobile.png',
      mobileResize: [328, 328],
      mobileOpacity: 0.3,
    },
    kindbio: {
      url: '/imgs/particle/kindbio.png',
      resize: [450, 352],
      baseScale: 1.8,
      mobileScaleMultiplier: 1.8,
      loadPercentage: 0.002,
      forceColor: [18, 49, 87],
      instantColor: true,
      mobileOpacity: 0.3,
    },
    'mito-health': {
      url: '/imgs/particle/3.png',
      resize: [600, 576],
      baseScale: 1,
      loadPercentage: 0.002,
      mobileScaleMultiplier: 0.95,
      mobileOpacity: 0.3,
    },
    'kangaroo-biomedical': {
      url: '/imgs/particle/6.png',
      resize: [338, 340],
      baseScale: 1.4,
      loadPercentage: 0.004,
      mobileOpacity: 0.3,
    },
    'renewal-bio': {
      url: '/imgs/particle/renewal-bio.png',
      resize: [860, 129],
      baseScale: 1.2,
      mobileScaleMultiplier: 1.1,
      loadPercentage: 0.004,
      mobileLoadPercentage: 0.008,
      mobileOpacity: 0.35,
    },
    domayn: {
      url: '/imgs/particle/domayn.png',
      resize: [760, 115],
      baseScale: 1,
      loadPercentage: 0.005,
      mobileScaleMultiplier: 0.8,
      mobileLoadPercentage: 0.012,
      mobileOpacity: 0.35,
    },
    'oisin-biotechnologies': {
      url: '/imgs/particle/oisin.png',
      resize: [600, 163],
      baseScale: 1.2,
      mobileScaleMultiplier: 2.8,
      loadPercentage: 0.005,
      mobileLoadPercentage: 0.003,
      mobileUrl: '/imgs/particle/oisin-mobile.png',
      mobileResize: [164, 164],
      mobileOpacity: 0.3,
    },
    'etheros-pharmaceuticals': {
      url: '/imgs/particle/etheros.png',
      resize: [600, 146],
      baseScale: 1.2,
      mobileScaleMultiplier: 1.5,
      loadPercentage: 0.002,
      mobileLoadPercentage: 0.0012,
      mobileUrl: '/imgs/particle/etheros-mobile.png',
      mobileOpacity: 0.3,
      mobileResize: [328, 328],
    },
    'longevity-technology': { url: '/imgs/particle/2.png', resize: [600, 536], baseScale: 0.7, loadPercentage: 0.0012 },
    vitalia: {
      url: '/imgs/particle/7.png',
      resize: [860, 82],
      baseScale: 1.2,
      mobileScaleMultiplier: 1.5,
      loadPercentage: 0.002,
      mobileUrl: '/imgs/particle/vitalia-mobile.png',
      mobileResize: [328, 328],
      mobileOpacity: 0.3,
    },
    eonark: {
      url: '/imgs/investments/eonark.svg',
      resize: [830, 180],
      baseScale: 1,
      mobileScaleMultiplier: 1.1,
      loadPercentage: 0.005,
      mobileLoadPercentage: 0.008,
      mobileOpacity: 0.35,
    },
  };
  const configs: ParticleConfig[] = [idle, ...COMPANIES.map(({ slug }) => bySlug[slug])];

  return configs.map(
    ({
      baseScale,
      mobileScaleMultiplier = 1,
      mobileUrl,
      mobileResize,
      mobileOpacity,
      loadPercentage,
      mobileLoadPercentage,
      url,
      resize,
      ...rest
    }) => ({
      ...rest,
      url: isMobile && mobileUrl ? mobileUrl : url,
      resize: isMobile && mobileResize ? mobileResize : resize,
      scaleNum: isMobile ? baseScale * MOBILE_PARTICLE_SCALE * mobileScaleMultiplier : baseScale,
      opacity: isMobile ? (mobileOpacity ?? 0.5) : 0.8,
      loadPercentage: isMobile && mobileLoadPercentage !== undefined ? mobileLoadPercentage : loadPercentage,
    }),
  );
};
