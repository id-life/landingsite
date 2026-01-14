import { cn } from '@/utils';
import { ItemList, WithContext } from 'schema-dts';

export type PortfolioItemInfo = {
  title: string;
  subTitle?: string;
  description: string;
  image: JSX.Element;
  link?: string;
  logoUrl: string;
};

const mobileImageClassName = 'mobile:h-full mobile:w-auto mobile:object-contain';
export const portfolio: PortfolioItemInfo[] = [
  {
    title: 'Healthspan Capital',
    description: 'Active early stage LongBio fund',
    image: (
      <img
        className={cn('w-19.5', mobileImageClassName)}
        src="/imgs/investments/healthspan.webp"
        alt="Healthspan Capital logo - Active early stage LongBio fund"
      />
    ),
    link: 'https://www.healthspancapital.vc/',
    logoUrl: '/imgs/investments/healthspan.webp',
  },
  {
    title: 'Frontier Bio',
    description: 'The future of engineered tissue',
    image: (
      <img
        className={cn('w-68', mobileImageClassName, 'ipad:max-w-[230px]')}
        src="/imgs/investments/frontier-bio.webp"
        alt="Frontier Bio logo - The future of engineered tissue"
      />
    ),
    link: 'https://www.frontierbio.com/',
    logoUrl: '/imgs/investments/frontier-bio.webp',
  },
  {
    title: 'Unlimited Bio',
    description: 'Accelerate clinical trials',
    image: (
      <img
        className={cn('w-19.5', mobileImageClassName)}
        src="/imgs/investments/unlimited.webp"
        alt="Unlimited Bio logo - Accelerate clinical trials"
      />
    ),
    link: 'https://www.unlimited.bio/',
    logoUrl: '/imgs/investments/unlimited.webp',
  },
  {
    title: 'R3 Bio',
    description: 'Stealth mode biotech',
    image: (
      <img
        className={cn(mobileImageClassName, 'w-[8.75rem] mobile:w-[6.25rem]')}
        src="/imgs/investments/r3.webp"
        alt="R3 Bio logo - Stealth mode biotech"
      />
    ),
    logoUrl: '/imgs/investments/r3.webp',
  },
  {
    title: 'Immune Bridge',
    description: 'A new generation of allogeneic cell therapies to make cancer cures accessible to everyone',
    image: (
      <img
        className={cn('w-[12.5rem]', mobileImageClassName)}
        src="/imgs/investments/immune-bridge.webp"
        alt="Immune Bridge logo - Allogeneic cell therapies for accessible cancer cures"
      />
    ),
    link: 'https://www.immunebridge.com/',
    logoUrl: '/imgs/investments/immune-bridge.webp',
  },
  {
    title: 'Mito Health',
    description: 'AI powered concierge doctor',
    image: (
      <img
        className={cn(mobileImageClassName, 'w-36 mobile:w-[6rem]')}
        src="/imgs/investments/mito.webp"
        alt="Mito Health logo - AI powered concierge doctor"
      />
    ),
    link: 'https://mitohealth.com/',
    logoUrl: '/imgs/investments/mito.webp',
  },
  {
    title: 'Kangaroo Biomedical',
    description: 'Artificial Womb (AW) technology',
    image: (
      <img
        className={cn(mobileImageClassName, 'h-12 mobile:-mt-3 mobile:h-10')}
        src="/imgs/investments/kangaroo-biomedical.webp"
        alt="Kangaroo Biomedical logo - Artificial Womb technology"
      />
    ),
    logoUrl: '/imgs/investments/kangaroo-biomedical.webp',
  },
  {
    title: 'VIBE SCIENCE',
    description: 'Builds consumer brain wellness technology',
    image: (
      <img
        className={cn(mobileImageClassName, 'w-24 mobile:h-12')}
        src="/imgs/investments/vibe.webp"
        alt="VIBE SCIENCE logo - Consumer brain wellness technology"
      />
    ),
    logoUrl: '/imgs/investments/vibe.webp',
  },
  {
    title: 'Oisin Biotechnologies',
    description: 'Genetic Medicines for Health and Longevity',
    image: (
      <img
        className={cn(mobileImageClassName, 'w-[11.25rem] mobile:h-11')}
        src="/imgs/investments/oisin.webp"
        alt="Oisin Biotechnologies logo - Genetic medicines for health and longevity"
      />
    ),
    link: 'https://www.oisinbio.com/',
    logoUrl: '/imgs/investments/oisin.webp',
  },
  {
    title: 'Etheros Pharmaceuticals',
    description: 'Small molecule enzyme mimetics for neuroprotection and healthspan',
    image: (
      <img
        className={cn(mobileImageClassName, 'w-[8.375rem] mobile:h-11')}
        src="/imgs/investments/etheros.webp"
        alt="Etheros Pharmaceuticals logo - Small molecule enzyme mimetics for neuroprotection"
      />
    ),
    link: 'https://etherospharma.com/',
    logoUrl: '/imgs/investments/etheros.webp',
  },
  {
    title: 'Longevity.Technology',
    description: 'The #1 destination for daily news and insights on the fast-growing longevity market',
    image: (
      <img
        className={cn('w-19.5', mobileImageClassName)}
        src="/imgs/investments/longevity.webp"
        alt="Longevity.Technology logo - Daily news and insights on longevity market"
      />
    ),
    link: 'https://longevity.technology/',
    logoUrl: '/imgs/investments/longevity.webp',
  },
  {
    title: 'Vitalia',
    description: 'Accelerated longevity startups Special economic zone',
    image: (
      <img
        className={cn('w-19.5', mobileImageClassName)}
        src="/imgs/investments/vitalia.webp"
        alt="Vitalia logo - Accelerated longevity startups special economic zone"
      />
    ),
    // link: 'https://vitalia.city/',
    logoUrl: '/imgs/investments/vitalia.webp',
  },
];

export const getPortfolioJsonLd = (): WithContext<ItemList> => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'IMMORTAL DRAGONS Portfolio',
  url: 'https://id.life/portfolio',
  numberOfItems: portfolio.length,
  itemListElement: portfolio.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Organization',
      name: item.title,
      description: item.description,
      logo: `https://id.life${item.logoUrl}`,
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
  mobileScaleMultiplier?: number;
  mobileUrl?: string;
  mobileResize?: [number, number];
  mobileOpacity?: number;
  mobileLoadPercentage?: number;
};

export const portfolioGetSourceImgInfos = (isMobile: boolean) => {
  // Base scale values for each particle (desktop values)
  const configs: ParticleConfig[] = [
    { url: '/imgs/particle/0.png', resize: [512, 300], baseScale: 2.2 },
    { url: '/imgs/particle/1.png', resize: [600, 600], baseScale: 0.8, loadPercentage: 0.005, mobileOpacity: 0.3 },
    {
      url: '/imgs/particle/5.png',
      resize: [300, 307],
      baseScale: 1,
      mobileScaleMultiplier: 1.8,
      loadPercentage: 0.008,
      mobileLoadPercentage: 0.004,
    },
    { url: '/imgs/particle/9.png', resize: [600, 600], baseScale: 1, loadPercentage: 0.0012, mobileLoadPercentage: 0.002 },
    { url: '/imgs/particle/4.png', resize: [300, 300], baseScale: 1.4, mobileScaleMultiplier: 1.4, loadPercentage: 0.002 },
    {
      url: '/imgs/particle/immune-bridge.png',
      resize: [584, 680],
      baseScale: 1,
      mobileScaleMultiplier: 0.8,
      loadPercentage: 0.002,
      mobileOpacity: 0.3,
    },
    {
      url: '/imgs/particle/3.png',
      resize: [600, 576],
      baseScale: 1,
      loadPercentage: 0.002,
      mobileScaleMultiplier: 0.95,
      mobileOpacity: 0.3,
    },
    { url: '/imgs/particle/6.png', resize: [338, 340], baseScale: 1.4, loadPercentage: 0.004, mobileOpacity: 0.3 },
    { url: '/imgs/particle/11.png', resize: [512, 262], baseScale: 1.2, loadPercentage: 0.002 },
    {
      url: '/imgs/particle/oisin.png',
      resize: [600, 163],
      baseScale: 1.2,
      mobileScaleMultiplier: 2.8,
      loadPercentage: 0.005,
      mobileLoadPercentage: 0.003,
      mobileUrl: '/imgs/particle/oisin-mobile.png',
      mobileResize: [164, 164] as [number, number],
      mobileOpacity: 0.3,
    },
    {
      url: '/imgs/particle/etheros.png',
      resize: [600, 146],
      baseScale: 1.2,
      mobileScaleMultiplier: 1.5,
      loadPercentage: 0.002,
      mobileLoadPercentage: 0.0012,
      mobileUrl: '/imgs/particle/etheros-mobile.png',
      mobileOpacity: 0.3,
      mobileResize: [328, 328] as [number, number],
    },
    { url: '/imgs/particle/2.png', resize: [600, 536], baseScale: 0.7, loadPercentage: 0.0012 },
    {
      url: '/imgs/particle/7.png',
      resize: [860, 82],
      baseScale: 1.2,
      mobileScaleMultiplier: 1.5,
      loadPercentage: 0.002,
      mobileUrl: '/imgs/particle/vitalia-mobile.png',
      mobileResize: [328, 328] as [number, number],
      mobileOpacity: 0.3,
    },
  ];

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
