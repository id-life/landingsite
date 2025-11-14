import { ReactNode } from 'react';
import { AmericaSVG, ChineseSVG, HondurasSVG, SingaporeSVG, ThailandSVG, DenmarkSVG, FranceSVG } from '@/components/svg';

// pulse animate config
export type PulseConfig = {
  svgSize: number; // SVG view size
  centerRadius: number; // center point radius
  pulse1: {
    fromRadius: number; // first pulse initial radius
    toRadius: number; // first pulse final radius
    duration: number; // animation duration (seconds)
  };
  pulse2: {
    fromRadius: number; // second pulse initial radius
    toRadius: number; // second pulse final radius
    duration: number; // animation duration (seconds)
  };
  color: string; // color (hexadecimal)
};

export const DEFAULT_PULSE_CONFIG: PulseConfig = {
  svgSize: 60,
  centerRadius: 4,
  pulse1: {
    fromRadius: 4,
    toRadius: 12,
    duration: 1.5,
  },
  pulse2: {
    fromRadius: 12,
    toRadius: 24,
    duration: 1.5,
  },
  color: '#C11111',
};

export type MapRegionDotData = {
  lat: number;
  lng: number;
  icon?: ReactNode;
};

export const WORLD_MAP_REGION_DOTS: MapRegionDotData[] = [
  {
    lat: 40,
    lng: -106,
    icon: <AmericaSVG className="size-7 mobile:size-5.5" />,
  },
  {
    lat: 33,
    lng: 21,
    icon: <img src="/imgs/engagement/montenegro.webp" alt="" className="size-7 mobile:size-5.5" />,
  },
  {
    lat: -14,
    lng: 97,
    icon: <SingaporeSVG className="size-7 mobile:size-5.5" />,
  },
  {
    lat: 30,
    lng: 99,
    icon: <ChineseSVG className="size-7 mobile:size-5.5" />,
  },
  {
    lat: -1,
    lng: -98,
    icon: <HondurasSVG className="size-7 mobile:size-5.5" />,
  },
  {
    lat: 5,
    lng: 100,
    icon: <ThailandSVG className="size-7 mobile:size-5.5" />,
  },
  {
    lat: 55,
    lng: -10,
    icon: <img src="/imgs/engagement/uk.webp" alt="" className="size-7 mobile:size-5.5" />,
  },
  {
    lat: 64,
    lng: 8,
    icon: <DenmarkSVG className="size-7 mobile:size-5.5" />,
  },
  {
    lat: 42,
    lng: 0,
    icon: <FranceSVG className="size-7 mobile:size-5.5" />,
  },
  {
    lat: 13,
    lng: 51,
    icon: <img src="/imgs/engagement/uae.webp" alt="" className="size-7 mobile:size-5.5" />,
  },
];

export type MapDotData = {
  lat: number;
  lng: number;
  label?: string;
  country: string;
  period?: string;
  key?: string;
  title?: string;
  imgs?: {
    src: string;
    alt: string;
  }[];
  secondTitle?: string;
  secondImgs?: {
    src: string;
    alt: string;
  }[];
  contentTransformClass?: string;
  mobileContentTransformClass?: string;
  pcDotHotAreaClass?: string;
  index?: number; // animation identifier
  pulseConfig?: PulseConfig; // custom pulse config
  activeOtherDarkerDotIDs?: string[]; // when active, the other dots will be more transparent
  link?: string; // jump link
  isSponsor?: boolean; // is also a sponsor dot
  videoUrl?: string;
};
export const WORLD_MAP_DOTS: MapDotData[] = [
  {
    index: 0,
    lat: 22,
    lng: 120,
    country: 'China',
    label: 'Shanghai',
    key: 'sh_timepie_2024', // Unique identifier for the dot
    secondTitle: 'The 5th Timepie Longevity Forum 2024 / 11',
    title: 'The 6th TIMEPIE LONGEVITY FORUM 2025 / 09',
    link: 'https://www.timepielongevityforum.com/',
    contentTransformClass: '-translate-x-[calc(100%_+_1rem)] -translate-y-[40%]',
    mobileContentTransformClass: '-translate-x-full -translate-y-[35%]',
    pcDotHotAreaClass: 'top-[25vh]',
    activeOtherDarkerDotIDs: ['world-map-dot-sponsor-0', 'world-map-dot-1', 'world-map-dot-2'],
    secondImgs: [
      {
        src: 'https://cdn.id.life/engagement/Shanghai-01.webp',
        alt: 'Shanghai-01.webp',
      },
      {
        src: 'https://cdn.id.life/engagement/Shanghai-02.webp',
        alt: 'Shanghai-02.webp',
      },
      {
        src: 'https://cdn.id.life/engagement/Shanghai-03.webp',
        alt: 'Shanghai-03.webp',
      },
      {
        src: 'https://cdn.id.life/engagement/Shanghai-04.webp',
        alt: 'Shanghai-04.webp',
      },
    ],
    imgs: [
      {
        src: 'https://cdn.id.life/engagement/timepie-2025-01.webp',
        alt: 'timepie-2025-01.webp',
      },
      {
        src: 'https://cdn.id.life/engagement/timepie-2025-02.webp',
        alt: 'timepie-2025-02.webp',
      },
      {
        src: 'https://cdn.id.life/engagement/timepie-2025-03.webp',
        alt: 'timepie-2025-03.webp',
      },
    ],
  },
  {
    index: 1,
    lat: 1,
    lng: 104,
    country: 'Thailand',
    label: 'Chiang Mai',
    period: '2024/11',
    key: 'cm_lanna_2024', // Unique identifier for the dot
    title: 'Edge City Lanna',
    link: 'https://www.edgecity.live/lanna',
    contentTransformClass: '-translate-x-[calc(100%_+_1rem)] -translate-y-[40%]',
    mobileContentTransformClass: '-translate-x-full -translate-y-[50%]',
    pcDotHotAreaClass: 'top-[25.5vh]',
    activeOtherDarkerDotIDs: ['world-map-dot-sponsor-0', 'world-map-dot-0', 'world-map-dot-2'],
    imgs: [
      {
        src: 'https://cdn.id.life/engagement/Chiangmai-1.webp',
        alt: 'Chiangmai-1.webp',
      },
      {
        src: 'https://cdn.id.life/engagement/Chiangmai-2.webp',
        alt: 'Chiangmai-2.webp',
      },
      {
        src: 'https://cdn.id.life/engagement/Chiangmai-3.webp',
        alt: 'Chiangmai-3.webp',
      },
    ],
  },
  {
    index: 2,
    lat: -19,
    lng: 101,
    label: 'Singapore',
    country: 'Singapore',
    period: '2025/02',
    key: 'sg_flf_2025', // Unique identifier for the dot
    title: 'Founders Longevity Forum Singapore',
    link: 'https://founderslongevity.co/#speakers',
    contentTransformClass: '-translate-x-[calc(100%_+_1rem)] -translate-y-[60%]',
    mobileContentTransformClass: '-translate-x-full -translate-y-[70%]',
    pcDotHotAreaClass: 'top-[39.5vh]',
    activeOtherDarkerDotIDs: [
      'world-map-dot-sponsor-0',
      'world-map-dot-0',
      'world-map-dot-1',
      'world-map-dot-book-0',
      'world-map-dot-book-1',
    ],
    imgs: [
      {
        src: 'https://cdn.id.life/engagement/Singapore-1.webp',
        alt: 'Singapore-1.webp',
      },
      {
        src: 'https://cdn.id.life/engagement/Singapore-2.webp',
        alt: 'Singapore-2.webp',
      },
      {
        src: 'https://cdn.id.life/engagement/Singapore-3.webp',
        alt: 'Singapore-3.webp',
      },
      {
        src: 'https://cdn.id.life/engagement/Singapore-4.webp',
        alt: 'Singapore-4.webp',
      },
      {
        src: 'https://cdn.id.life/engagement/Singapore-5.webp',
        alt: 'Singapore-5.webp',
      },
    ],
  },
  {
    index: 3,
    lat: -5,
    lng: -94,
    label: 'Roatan',
    country: 'Honduras',
    period: '2024/01',
    key: 'roatan_vitalia_2024', // Unique identifier for the dot
    title: 'Vitalia @ Roatan, Honduras',
    link: 'https://community.prospera.co/c/events/vitalia',
    contentTransformClass: 'translate-x-[85%] -translate-y-[55%]',
    mobileContentTransformClass: 'translate-x-1/2 -translate-y-[60%]',
    pcDotHotAreaClass: 'right-full -left-full top-[36vh]',
    activeOtherDarkerDotIDs: ['world-map-dot-sponsor-2', 'world-map-dot-sponsor-1', 'world-map-dot-5', 'world-map-dot-7'],
    imgs: [
      {
        src: 'https://cdn.id.life/engagement/Honduras-5.webp',
        alt: 'Honduras-5.webp',
      },
      {
        src: 'https://cdn.id.life/engagement/Honduras-1.webp',
        alt: 'Honduras-1.webp',
      },
      {
        src: 'https://cdn.id.life/engagement/Honduras-2.webp',
        alt: 'Honduras-2.webp',
      },
      {
        src: 'https://cdn.id.life/engagement/Honduras-3.webp',
        alt: 'Honduras-3.webp',
      },
      {
        src: 'https://cdn.id.life/engagement/Honduras-4.webp',
        alt: 'Honduras-4.webp',
      },
    ],
  },
  {
    index: 4,
    lat: 30,
    lng: -118,
    label: 'Berkeley',
    country: 'USA',
    period: '2025/05',
    key: 'vitalistbay_berkeley_2025', // Unique identifier for the dot
    title: 'Vitalist Bay Summit',
    link: 'https://www.vitalistbay.com/summit',
    isSponsor: true,
    contentTransformClass: 'translate-x-[85%] -translate-y-[35%]',
    mobileContentTransformClass: 'translate-x-[60%] -translate-y-[32%]',
    pcDotHotAreaClass: 'right-full -left-full top-[23vh]',
    activeOtherDarkerDotIDs: ['world-map-dot-book-2', 'world-map-dot-3', 'world-map-dot-sponsor-3'],
    videoUrl: 'https://www.youtube.com/watch?v=2FJi1k7xNuo&t=1382s',
    imgs: [
      {
        src: 'https://cdn.id.life/engagement/Berkeley-1.webp',
        alt: 'vitalistbay-1.webp',
      },
      {
        src: 'https://cdn.id.life/engagement/Berkeley-2.webp',
        alt: 'vitalistbay-2.webp',
      },
      {
        src: 'https://cdn.id.life/engagement/Berkeley-3.webp',
        alt: 'vitalistbay-3.webp',
      },
      {
        src: 'https://cdn.id.life/engagement/Berkeley-4.webp',
        alt: 'vitalistbay-4.webp',
      },
      {
        src: 'https://cdn.id.life/engagement/Berkeley-5.webp',
        alt: 'vitalistbay-5.webp',
      },
      {
        src: 'https://cdn.id.life/engagement/Berkeley-6.webp',
        alt: 'vitalistbay-6.webp',
      },
    ],
  },
  {
    index: 5,
    lat: 49,
    lng: -4,
    label: 'London',
    country: 'UK',
    link: 'https://founderslongevity.co/',
    key: 'flf_global_2025', // Unique identifier for the dot
    title: 'Founders Longevity Forum\nLondon 2025 / 05',
    secondTitle: 'Founders Forum Global\n2025 / 05',
    contentTransformClass: '-translate-x-[calc(100%_+_1rem)] -translate-y-[20%]',
    mobileContentTransformClass: '-translate-x-full -translate-y-[20%]',
    pcDotHotAreaClass: 'top-[12vh]',
    activeOtherDarkerDotIDs: [
      'world-map-dot-sponsor-1',
      'world-map-dot-book-0',
      'world-map-dot-4',
      'world-map-dot-sponsor-3',
      'world-map-dot-book-2',
      'world-map-dot-3',
      'world-map-dot-6',
      'world-map-dot-7',
    ],
    secondImgs: [
      {
        src: 'https://cdn.id.life/engagement/London-1.webp',
        alt: 'London-1.webp',
      },
      {
        src: 'https://cdn.id.life/engagement/London-2.webp',
        alt: 'London-21.webp',
      },
      {
        src: 'https://cdn.id.life/engagement/London-3.webp',
        alt: 'London-3.webp',
      },
    ],
    imgs: [
      {
        src: 'https://cdn.id.life/engagement/London-Global-1.webp',
        alt: 'London-Global-1.webp',
      },
      {
        src: 'https://cdn.id.life/engagement/London-Global-2.webp',
        alt: 'London-Global-2.webp',
      },
      {
        src: 'https://cdn.id.life/engagement/London-Global-3.webp',
        alt: 'London-Global-3.webp',
      },
    ],
  },
  {
    index: 6,
    lat: 60,
    lng: 12,
    label: 'Copenhagen',
    country: 'Denmark',
    link: 'https://agingpharma.org/',
    key: 'ardd_2025', // Unique identifier for the dot
    title: 'ARDD 2025/08',
    contentTransformClass: '-translate-x-[calc(100%_+_1rem)] -translate-y-[20%]',
    mobileContentTransformClass: '-translate-x-full -translate-y-[20%]',
    pcDotHotAreaClass: 'top-[12vh]',
    activeOtherDarkerDotIDs: [
      'world-map-dot-sponsor-1',
      'world-map-dot-book-0',
      'world-map-dot-4',
      'world-map-dot-sponsor-3',
      'world-map-dot-book-2',
      'world-map-dot-3',
      'world-map-dot-5',
      'world-map-dot-7',
    ],
    imgs: [
      {
        src: 'https://cdn.id.life/engagement/ardd-2025-1.webp',
        alt: 'ardd-2025-1.webp',
      },
      {
        src: 'https://cdn.id.life/engagement/ardd-2025-2.webp',
        alt: 'ardd-2025-2.webp',
      },
      {
        src: 'https://cdn.id.life/engagement/ardd-2025-3.webp',
        alt: 'ardd-2025-3.webp',
      },
      {
        src: 'https://cdn.id.life/engagement/ardd-2025-4.webp',
        alt: 'ardd-2025-4.webp',
      },
    ],
  },
  {
    lat: 38,
    lng: 5,
    label: 'Aix-En-Provence',
    country: 'France',
    link: 'https://forum.2060.life',
    key: '2060_longevity_forum_2025', // Unique identifier for the dot
    title: '2060 Longevity Forum 2025/08',
    contentTransformClass: '-translate-x-[calc(100%_+_1rem)] -translate-y-[20%]',
    mobileContentTransformClass: '-translate-x-full -translate-y-[20%]',
    pcDotHotAreaClass: 'top-[12vh]',
    activeOtherDarkerDotIDs: [
      'world-map-dot-sponsor-1',
      'world-map-dot-book-0',
      'world-map-dot-4',
      'world-map-dot-sponsor-3',
      'world-map-dot-book-2',
      'world-map-dot-3',
      'world-map-dot-5',
      'world-map-dot-6',
    ],
    imgs: [
      {
        src: 'https://cdn.id.life/engagement/2060lf-2025-1.webp',
        alt: '2060lf-2025-1.webp',
      },
      {
        src: 'https://cdn.id.life/engagement/2060lf-2025-2.webp',
        alt: '2060lf-2025-2.webp',
      },
      {
        src: 'https://cdn.id.life/engagement/2060lf-2025-3.webp',
        alt: '2060lf-2025-3.webp',
      },
      {
        src: 'https://cdn.id.life/engagement/2060lf-2025-4.webp',
        alt: '2060lf-2025-4.webp',
      },
    ],
  },
];

export type MapBookDotData = {
  lat: number;
  lng: number;
  title?: string;
  bookTitle?: string;
  desc?: string;
  key?: string;
  coverUrl?: string;
  videoUrl?: string;
  link?: string;
  pulseConfig?: PulseConfig; // custom pulse config
  activeOtherDarkerDotIDs?: string[]; // when active, the other dots will be more transparent
  containerClass?: string;
};
export const MAP_BOOK_DOTS: MapBookDotData[] = [
  {
    lat: 33,
    lng: 26,
    key: 'publications-01',
    title: 'Lustica Bay, Montenegro',
    bookTitle: 'The Network State',
    desc: 'Chinese Version by Boyang',
    coverUrl: 'https://cdn.id.life/engagement/book-01.webp',
    videoUrl: 'https://cdn.id.life/engagement/book-01.webm',
    link: 'https://www.thenetworkstate-zh.com/foreword/',
    activeOtherDarkerDotIDs: ['world-map-dot-book-1', 'world-map-dot-sponsor-0', 'world-map-dot-5'],
    containerClass: 'scale-[0.9]',
  },
  {
    lat: -6,
    lng: 27,
    key: 'publications-02',
    title: 'Earth',
    bookTitle: 'bio/acc manifesto',
    desc: 'Chinese Version by Boyang',
    coverUrl: 'https://cdn.id.life/engagement/book-02.webp',
    videoUrl: 'https://cdn.id.life/engagement/book-02.webm',
    link: 'https://bioacc.life/zh/',
    containerClass: 'scale-[1.2]',
  },
  {
    lat: 15,
    lng: -112,
    key: 'publications-03',
    title: 'Los Angeles, USA',
    bookTitle: 'Better With Age 乐龄',
    desc: 'Coming Soon',
    coverUrl: 'https://cdn.id.life/engagement/book-03.webp',
    videoUrl: 'https://cdn.id.life/engagement/book-03.webm',
    containerClass: 'scale-[0.9]',
    activeOtherDarkerDotIDs: ['world-map-dot-3', 'world-map-dot-4', 'world-map-dot-sponsor-3'],
  },
];

export type MapSponsorDotData = {
  lat: number;
  lng: number;
  mobileLat?: number;
  mobileLng?: number;
  alt?: string;
  icon?: string;
  link?: string;
  coverUrl?: string;
  videoUrl?: string;
  title: string;
  pulseConfig?: PulseConfig; // custom pulse config
  activeOtherDarkerDotIDs?: string[]; // when active, the other dots will be more transparent
  sponsorText?: string;
  extraText?: string;
  extraSponsor?: {
    alt: string;
    coverUrl: string;
    videoUrl: string;
    link: string;
  };
};
export const MAP_SPONSOR_DOTS: MapSponsorDotData[] = [
  {
    lat: 19,
    lng: 85,
    mobileLat: 20,
    mobileLng: 80,
    title: 'Chengdu, China',
    alt: 'EthPanda\n青年黑客远航计划',
    coverUrl: 'https://cdn.id.life/engagement/sponsor/sponsor-02.png',
    videoUrl: 'https://cdn.id.life/engagement/sponsor/sponsor-02.webm',
    link: 'https://x.com/ETHPanda_Org/status/1863865657454162277',
    activeOtherDarkerDotIDs: ['world-map-dot-0', 'world-map-dot-1', 'world-map-dot-2'],
  },
  {
    lat: 54,
    lng: -5,
    title: 'Oxford, UK',
    alt: 'Oxford Future Innovation Forum 2024',
    coverUrl: 'https://cdn.id.life/engagement/sponsor/sponsor-03.png',
    videoUrl: 'https://cdn.id.life/engagement/sponsor/sponsor-03.webm',
    activeOtherDarkerDotIDs: [
      'world-map-dot-book-0',
      'world-map-dot-book-1',
      'world-map-dot-5',
      'world-map-dot-6',
      'world-map-dot-7',
    ],
    link: 'https://mp.weixin.qq.com/s?__biz=MzI0MzUyODQ1MA==&mid=2247538673&idx=1&sn=8d3e1d197bb192808d1b0bf3b139b72d&chksm=e969b19cde1e388ab6a92c8a94aed3542aff8975b2ef9f95fb2275aa8735e66c7a0f916f1312&scene=178&cur_album_id=3764396479562301443#rd',
    sponsorText: 'Conference',
  },
  {
    lat: -20,
    lng: -18,
    title: 'Desci',
    alt: 'BiohackerDAO',
    coverUrl: 'https://cdn.id.life/engagement/sponsor/sponsor-04.png',
    videoUrl: 'https://cdn.id.life/engagement/sponsor/sponsor-04.webm',
    link: 'https://biohackerdao.org/',
    sponsorText: 'Sponsorship',
  },
  {
    lat: 24,
    lng: -123.5,
    title: 'San Francisco, USA',
    alt: 'Public Longevity\nGroup',
    coverUrl: 'https://cdn.id.life/engagement/sponsor/sponsor-05.png',
    videoUrl: 'https://cdn.id.life/engagement/sponsor/sponsor-05.webm',
    link: 'https://publiclongevitygroup.framer.website/',
    extraSponsor: {
      alt: 'Lifespan Research\nInstitute',
      coverUrl: 'https://cdn.id.life/engagement/sponsor/sponsor-05-2.png',
      videoUrl: 'https://cdn.id.life/engagement/sponsor/sponsor-05-2.webm',
      link: 'https://www.lifespan.io/',
    },
    sponsorText: 'Grant',
    activeOtherDarkerDotIDs: ['world-map-dot-3', 'world-map-dot-4', 'world-map-dot-book-2'],
  },
  {
    lat: 10,
    lng: 54,
    title: 'Abu Dhabi, UAE',
    alt: 'REVIVE ME 2025',
    coverUrl: 'https://cdn.id.life/engagement/sponsor/sponsor-08.webp',
    videoUrl: 'https://cdn.id.life/engagement/sponsor/sponsor-08.webm',
    link: 'https://revivemeexpo.com/',
    sponsorText: 'Conference',
    extraText: 'Sponsorship',
  },
];

export const MOBILE_DOT_SHOW_ORDER: { type: 'sponsor' | 'book' | 'meeting'; index: number; offset?: number }[] = [
  { type: 'sponsor', index: 3, offset: 40 },
  { type: 'meeting', index: 4, offset: 20 },
  { type: 'book', index: 2, offset: 80 },
  { type: 'meeting', index: 3 },
  { type: 'sponsor', index: 2, offset: 80 },
  { type: 'sponsor', index: 1, offset: 80 },
  { type: 'meeting', index: 5, offset: 80 },
  { type: 'meeting', index: 7, offset: 80 },
  { type: 'meeting', index: 6, offset: 80 },
  { type: 'book', index: 0, offset: 40 },
  { type: 'book', index: 1, offset: 40 },
  { type: 'sponsor', index: 4, offset: 80 },
  { type: 'sponsor', index: 0, offset: 50 },
  { type: 'meeting', index: 2, offset: 300 },
  { type: 'meeting', index: 1, offset: 280 },
  { type: 'meeting', index: 0, offset: 310 },
];

export const getMobileDotShowInfo = (type: 'sponsor' | 'book' | 'meeting', index: number) => {
  const info = MOBILE_DOT_SHOW_ORDER.find((item) => item.type === type && item.index === index);
  return info;
};
