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
    description: 'AI Powered Concierge Doctor',
    image: <img className="w-36 mobile:w-[6.75rem]" src="/imgs/investments/mito.webp" alt="mito" />,
    link: 'https://mitohealth.com/',
  },
  {
    title: 'R3 Bio',
    description: 'Wholebody replacement',
    image: <img className="w-[8.75rem] mobile:w-[6.5625rem]" src="/imgs/investments/r3.webp" alt="r3" />,
  },
  {
    title: 'Frontier Bio',
    description: 'The Future of Engineered Tissue',
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
        <img className="w-50 mobile:w-[9.875rem]" src="/imgs/investments/vita.webp" alt="vita" />
        <img className="w-[9.6875rem] mobile:w-[7.25rem]" src="/imgs/investments/bio.webp" alt="bio" />
      </div>
    ),
    link: 'https://www.vitadao.com/',
  },
  {
    title: 'Unlimited Bio',
    description: 'Accelerate clinical trials',
    image: <img className="w-19.5 mobile:w-[3.625rem]" src="/imgs/investments/unlimited.webp" alt="unlimited" />,
    link: 'https://unlimit.bio/',
  },
  {
    title: 'ALIS',
    description: 'Gold Standard Longevity Services Scaled Globally',
    image: <img className="w-19.5 mobile:w-[3.625rem]" src="/imgs/investments/alis.webp" alt="bio" />,
    link: 'https://www.linkedin.com/company/applied-longevity-intelligence-services/',
  },
];
