import { AmericaSVG, ChineseSVG, EUnionSVG, HondurasSVG, SingaporeSVG, ThailandSVG, UKSVG } from '@/components/svg';
import { ReactNode } from 'react';

// 波纹动画配置
export type PulseConfig = {
  svgSize: number; // SVG视图大小
  centerRadius: number; // 中心点半径
  pulse1: {
    fromRadius: number; // 第一个波纹初始半径
    toRadius: number; // 第一个波纹最终半径
    duration: number; // 动画持续时间(秒)
  };
  pulse2: {
    fromRadius: number; // 第二个波纹初始半径
    toRadius: number; // 第二个波纹最终半径
    duration: number; // 动画持续时间(秒)
  };
  color: string; // 颜色 (十六进制)
};

// 默认波纹配置
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
    lat: 42.5,
    lng: 7,
    icon: <EUnionSVG className="size-7 mobile:size-5.5" />,
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
    lng: -4,
    icon: <UKSVG className="size-7 mobile:size-5.5" />,
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
  contentTransformClass?: string;
  mobileContentTransformClass?: string;
  pcDotHotAreaClass?: string;
  index?: number; // 动画标识符
  pulseConfig?: PulseConfig; // 自定义波纹配置
  activeOtherDarkerDotIDs?: string[]; // 该点 active 时透明度更浅的其他点
};
export const WORLD_MAP_DOTS: MapDotData[] = [
  {
    index: 0,
    lat: 22,
    lng: 120,
    country: 'China', // 新加的一个
    label: 'Shanghai',
    period: '2024/11',
    key: 'sh_timepie_2024', // Unique identifier for the dot
    title: 'The 5th Timepie Longevity Forum', //上海timepie
    contentTransformClass: '-translate-x-[calc(100%_+_1rem)] -translate-y-[40%]',
    mobileContentTransformClass: '-translate-x-[calc(100%_+_1rem)] -translate-y-[40%]',
    pcDotHotAreaClass: 'top-[22vh]',
    activeOtherDarkerDotIDs: [
      'world-map-dot-sponsor-1',
      'world-map-dot-1',
      'world-map-dot-2',
      'world-map-dot-book-0',
      'world-map-dot-book-1',
    ],
    imgs: [
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
    contentTransformClass: '-translate-x-[calc(100%_+_1rem)] -translate-y-[40%]',
    mobileContentTransformClass: '-translate-x-[calc(100%_+_1rem)] -translate-y-[50%]',
    pcDotHotAreaClass: 'top-[23vh]',
    activeOtherDarkerDotIDs: [
      'world-map-dot-sponsor-1',
      'world-map-dot-0',
      'world-map-dot-2',
      'world-map-dot-book-0',
      'world-map-dot-book-1',
    ],
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
    country: 'Singapore', //如果为空就不显示
    period: '2025/02',
    key: 'sg_flf_2025', // Unique identifier for the dot
    title: 'Founders Longevity Forum',
    contentTransformClass: '-translate-x-[calc(100%_+_1rem)] -translate-y-[60%]',
    mobileContentTransformClass: '-translate-x-[calc(100%_+_1rem)] -translate-y-[70%]',
    pcDotHotAreaClass: 'top-[37vh]',
    activeOtherDarkerDotIDs: [
      'world-map-dot-sponsor-1',
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
    contentTransformClass: 'translate-x-[85%] -translate-y-[55%]',
    mobileContentTransformClass: 'translate-x-[65%] -translate-y-[60%]',
    pcDotHotAreaClass: 'right-full -left-full top-[34vh]',
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
];

export type MapBookDotData = {
  lat: number;
  lng: number;
  title?: string;
  bookTitle?: string;
  desc?: string; // 灰字描述
  key?: string;
  coverUrl?: string;
  videoUrl?: string;
  link?: string; // 跳转链接
  pulseConfig?: PulseConfig; // 自定义波纹配置
  activeOtherDarkerDotIDs?: string[]; // 该点 active 时透明度更浅的其他点
  containerClass?: string;
};
export const MAP_BOOK_DOTS: MapBookDotData[] = [
  {
    lat: 36,
    lng: 22,
    key: 'publications-01',
    title: 'Lustica Bay, Montenegro',
    bookTitle: 'The Network State',
    desc: 'Chinese ver Outlined by Boyang', // 描述
    coverUrl: 'https://cdn.id.life/engagement/book-01.webp',
    videoUrl: 'https://cdn.id.life/engagement/book-01.webm',
    link: 'https://www.thenetworkstate-zh.com/foreword/', // 跳转链接
    activeOtherDarkerDotIDs: ['world-map-dot-book-1', 'world-map-dot-sponsor-1'],
    containerClass: 'scale-[0.9]',
  },
  {
    lat: -6,
    lng: 27,
    key: 'publications-02',
    title: 'Earth',
    bookTitle: 'bio/acc manifesto',
    desc: 'Chinese ver Translated by Boyang', // 描述
    coverUrl: 'https://cdn.id.life/engagement/book-02.webp',
    videoUrl: 'https://cdn.id.life/engagement/book-02.webm',
    link: 'https://bioacc.life/zh/', // 跳转链接
    containerClass: 'scale-[1.2]',
  },
];

export type MapSponsorDotData = {
  lat: number;
  lng: number;
  mobileLat?: number;
  mobileLng?: number;
  alt?: string; // 灰字描述
  key?: string;
  icon?: string;
  link?: string; // 跳转链接
  coverUrl?: string;
  videoUrl?: string;
  title: string;
  pulseConfig?: PulseConfig; // 自定义波纹配置
  activeOtherDarkerDotIDs?: string[]; // 该点 active 时透明度更浅的其他点
};
export const MAP_SPONSOR_DOTS: MapSponsorDotData[] = [
  {
    lat: 30,
    lng: -123.5,
    title: 'Berkeley, USA',
    key: 'sponsor-01',
    alt: 'VITALISTBAY',
    coverUrl: 'https://cdn.id.life/engagement/sponsor/sponsor-01.png',
    videoUrl: 'https://cdn.id.life/engagement/sponsor/sponsor-01.webm',
    link: '',
  },
  {
    lat: 19,
    lng: 85,
    mobileLat: 20,
    mobileLng: 80,
    title: 'Chengdu, China',
    key: 'sponsor-02',
    alt: 'ethPanda',
    coverUrl: 'https://cdn.id.life/engagement/sponsor/sponsor-02.png',
    videoUrl: 'https://cdn.id.life/engagement/sponsor/sponsor-02.webm',
    link: '',
    activeOtherDarkerDotIDs: ['world-map-dot-0', 'world-map-dot-1', 'world-map-dot-2'],
  },
  {
    lat: 51,
    lng: -1,
    title: 'Oxford, UK',
    key: 'sponsor-03',
    alt: 'OXFORD\nLONGEVITY',
    coverUrl: 'https://cdn.id.life/engagement/sponsor/sponsor-03.png',
    videoUrl: 'https://cdn.id.life/engagement/sponsor/sponsor-03.webm',
    activeOtherDarkerDotIDs: ['world-map-dot-book-0', 'world-map-dot-book-1'],
    link: '',
  },
];

export const MOBILE_DOT_SHOW_ORDER: { type: 'sponsor' | 'book' | 'meeting'; index: number; duration?: number }[] = [
  { type: 'sponsor', index: 0 },
  { type: 'meeting', index: 3 },
  { type: 'sponsor', index: 2 },
  { type: 'book', index: 0 },
  { type: 'book', index: 1 },
  { type: 'sponsor', index: 1 },
  { type: 'meeting', index: 2 },
  { type: 'meeting', index: 1 },
  { type: 'meeting', index: 0 },
];
