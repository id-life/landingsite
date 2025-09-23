export type PortfolioItemInfo = {
  title: string;
  subTitle?: string;
  description: string;
  image: JSX.Element;
  link?: string;
};

export const portfolio: PortfolioItemInfo[] = [
  {
    title: 'Healthspan Capital',
    description: 'Active early stage LongBio fund',
    image: <img className="w-19.5 mobile:w-15" src="/imgs/investments/healthspan.webp" alt="healthspan" />,
    link: 'https://www.healthspancapital.vc/',
  },
  {
    title: 'Frontier Bio',
    description: 'The future of engineered tissue',
    image: <img className="w-68 mobile:w-[13rem]" src="/imgs/investments/frontier-bio.webp" alt="frontier-bio" />,
    link: 'https://www.frontierbio.com/',
  },
  {
    title: 'Unlimited Bio',
    description: 'Accelerate clinical trials',
    image: <img className="w-19.5 mobile:w-[3.625rem]" src="/imgs/investments/unlimited.webp" alt="unlimited" />,
    link: 'https://www.unlimited.bio/',
  },
  {
    title: 'R3 Bio',
    description: 'Stealth mode biotech',
    image: <img className="w-[8.75rem] mobile:w-[6.5625rem]" src="/imgs/investments/r3.webp" alt="r3" />,
  },
  {
    title: 'Immune Bridge',
    description: 'A new generation of allogeneic cell therapies to make cancer cures accessible to everyone',
    image: <img className="w-[12.5rem] mobile:w-[6.5625rem]" src="/imgs/investments/immune-bridge.webp" alt="immune-bridge" />,
    link: 'https://www.immunebridge.com/',
  },
  {
    title: 'Mito Health',
    description: 'AI powered concierge doctor',
    image: <img className="w-36 mobile:w-[6.75rem]" src="/imgs/investments/mito.webp" alt="mito" />,
    link: 'https://mitohealth.com/',
  },
  {
    title: 'Kangaroo Biomedical',
    description: 'Artificial Womb (AW) technology',
    image: <img className="h-12" src="/imgs/investments/kangaroo-biomedical.webp" alt="kangaroo-biomedical" />,
  },
  {
    title: 'VIBE SCIENCE',
    description: 'Builds consumer brain wellness technology',
    image: <img className="w-24 mobile:w-[3.625rem]" src="/imgs/investments/vibe.webp" alt="vitalia" />,
  },
  {
    title: 'Oisin Biotechnologies',
    description: 'Genetic Medicines for Health and Longevity',
    image: <img className="w-[11.25rem] mobile:w-[6.5625rem]" src="/imgs/investments/oisin.webp" alt="oisin" />,
    link: 'https://www.oisinbio.com/',
  },
  {
    title: 'Etheros Pharmaceuticals',
    description: 'Small molecule enzyme mimetics for neuroprotection and healthspan',
    image: <img className="w-[8.375rem] mobile:w-[6.5625rem]" src="/imgs/investments/etheros.webp" alt="etheros" />,
    link: 'https://etherospharma.com/',
  },
  {
    title: 'Longevity.Technology',
    description: 'The #1 destination for daily news and insights on the fast-growing longevity market',
    image: <img className="w-19.5 mobile:w-[3.625rem]" src="/imgs/investments/longevity.webp" alt="longevity" />,
    link: 'https://longevity.technology/',
  },
  {
    title: 'Vitalia',
    description: 'Accelerated longevity startups Special economic zone',
    image: <img className="w-19.5 mobile:w-[3.625rem]" src="/imgs/investments/vitalia.webp" alt="vitalia" />,
    // link: 'https://vitalia.city/',
  },
];

export const portfolioGetSourceImgInfos = (isMobile: boolean) => {
  return [
    {
      url: '/imgs/particle/0.png',
      scaleNum: isMobile ? 0.8 : 2.2,
      resize: [512, 300],
    },
    {
      url: '/imgs/particle/1.png',
      resize: [600, 600],
      scaleNum: isMobile ? 0.4 : 0.8,
      loadPercentage: 0.005,
    },
    {
      url: '/imgs/particle/5.png',
      resize: [950, 140],
      loadPercentage: 0.004,
      scaleNum: isMobile ? 0.5 : 1.2,
    },
    {
      url: '/imgs/particle/9.png',
      resize: [600, 600],
      loadPercentage: 0.0012,
      scaleNum: isMobile ? 0.5 : 1,
    },
    {
      url: '/imgs/particle/4.png',
      resize: [300, 300],
      scaleNum: isMobile ? 0.7 : 1.4,
      loadPercentage: 0.002,
    },
    {
      url: '/imgs/particle/immune-bridge.png',
      resize: [584, 680],
      scaleNum: isMobile ? 0.5 : 1,
      loadPercentage: 0.002,
    },
    {
      url: '/imgs/particle/3.png',
      resize: [600, 576],
      scaleNum: isMobile ? 0.5 : 1,
    },
    {
      url: '/imgs/particle/6.png',
      resize: [338, 340],
      loadPercentage: 0.004,
      scaleNum: isMobile ? 0.7 : 1.4,
    },
    {
      url: '/imgs/particle/11.png',
      resize: [512, 262],
      scaleNum: isMobile ? 0.5 : 1.2,
      loadPercentage: 0.0012,
    },
    {
      url: '/imgs/particle/oisin.png',
      resize: [600, 163],
      scaleNum: isMobile ? 0.5 : 1.2,
      loadPercentage: 0.004,
    },
    {
      url: '/imgs/particle/etheros.png',
      resize: [600, 146],
      scaleNum: isMobile ? 0.5 : 1.2,
      loadPercentage: 0.003,
    },
    {
      url: '/imgs/particle/2.png',
      resize: [600, 536],
      scaleNum: isMobile ? 0.35 : 0.7,
      loadPercentage: 0.0012,
    },
    {
      url: '/imgs/particle/7.png',
      resize: [860, 82],
      loadPercentage: 0.004,
      scaleNum: isMobile ? 0.5 : 1.2,
    },
  ];
};
