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
    description: 'The most active longevity fund in space.',
    image: <img className="w-19.5 mobile:w-15" src="/imgs/investments/healthspan.webp" alt="healthspan" />,
    link: 'https://www.healthspancapital.vc/',
  },
  {
    title: 'Longevity.Technology',
    description: 'The #1 destination for daily news and insights on the fast-growing longevity market',
    image: <img className="w-19.5 mobile:w-[3.625rem]" src="/imgs/investments/longevity.webp" alt="longevity" />,
    link: 'https://longevity.technology/',
  },
  {
    title: 'Mito Health',
    description: 'AI powered concierge doctor',
    image: <img className="w-36 mobile:w-[6.75rem]" src="/imgs/investments/mito.webp" alt="mito" />,
    link: 'https://mitohealth.com/',
  },
  {
    title: 'R3 Bio',
    description: 'Stealth mode biotech',
    image: <img className="w-[8.75rem] mobile:w-[6.5625rem]" src="/imgs/investments/r3.webp" alt="r3" />,
  },
  {
    title: 'Frontier Bio',
    description: 'The future of engineered tissue',
    image: <img className="w-68 mobile:w-[13rem]" src="/imgs/investments/frontier-bio.webp" alt="frontier-bio" />,
    link: 'https://www.frontierbio.com/',
  },
  {
    title: 'Vitalia',
    description: 'Accelerated longevity startups Special economic zone',
    image: <img className="w-19.5 mobile:w-[3.625rem]" src="/imgs/investments/vitalia.webp" alt="vitalia" />,
    // link: 'https://vitalia.city/',
  },
  {
    title: 'VitaDAO & Bio.Xyz',
    subTitle: 'via secondary market & convert',
    description: 'New funding paradigm for unlikely bio projects',
    image: (
      <div className="flex-center gap-4">
        <img className="w-[9.25rem] mobile:w-[7.875rem]" src="/imgs/investments/vita.webp" alt="vita" />
        <img className="w-[7.25rem] mobile:w-[5.25rem]" src="/imgs/investments/bio.webp" alt="bio" />
      </div>
    ),
    link: 'https://www.vitadao.com/',
  },
  {
    title: 'Unlimited Bio',
    description: 'Accelerate clinical trials',
    image: <img className="w-19.5 mobile:w-[3.625rem]" src="/imgs/investments/unlimited.webp" alt="unlimited" />,
    link: 'https://www.unlimited.bio/',
  },
  {
    title: 'ALIS',
    description: 'Gold standard longevity services scaled globally',
    image: <img className="w-19.5 mobile:w-[3.625rem]" src="/imgs/investments/alis.webp" alt="bio" />,
    link: 'https://www.linkedin.com/company/applied-longevity-intelligence-services/',
  },
  {
    title: 'VIBE SCIENCE',
    description: 'Builds consumer brain wellness technology',
    image: <img className="w-24 mobile:w-[3.625rem]" src="/imgs/investments/vibe.webp" alt="vitalia" />,
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
      url: '/imgs/particle/2.png',
      resize: [600, 536],
      scaleNum: isMobile ? 0.35 : 0.7,
      loadPercentage: 0.0012,
    },
    {
      url: '/imgs/particle/3.png',
      resize: [600, 576],
      scaleNum: isMobile ? 0.5 : 1,
    },
    {
      url: '/imgs/particle/4.png',
      resize: [300, 300],
      scaleNum: isMobile ? 0.7 : 1.4,
      loadPercentage: 0.002,
    },
    {
      url: '/imgs/particle/5.png',
      resize: [950, 140],
      loadPercentage: 0.004,
      scaleNum: isMobile ? 0.5 : 1.2,
    },
    {
      url: '/imgs/particle/6.png',
      resize: [860, 82],
      loadPercentage: 0.004,
      scaleNum: isMobile ? 0.5 : 1.2,
    },
    {
      url: '/imgs/particle/7.png',
      resize: [594, 264],
      scaleNum: isMobile ? 0.7 : 1.4,
      loadPercentage: 0.002,
    },
    {
      url: '/imgs/particle/8.png',
      resize: [600, 600],
      loadPercentage: 0.0012,
      scaleNum: isMobile ? 0.5 : 1,
    },
    {
      url: '/imgs/particle/9.png',
      resize: [512, 272],
      scaleNum: isMobile ? 0.5 : 1.2,
      loadPercentage: 0.0012,
    },
    {
      url: '/imgs/particle/10.png',
      resize: [512, 262],
      scaleNum: isMobile ? 0.5 : 1.2,
      loadPercentage: 0.0012,
    },
  ];
};
