import { PopupItem } from '@/components/engagement/EngagementPopup';
import { AmericaSVG, ChineseSVG, HondurasSVG, SingaporeSVG, ThailandSVG } from '@/components/svg';
import { ReactNode } from 'react';

export type MapRegionDotData = {
  lat: number;
  lng: number;
  icon?: ReactNode;
};

export const WORLD_MAP_REGION_DOTS: MapRegionDotData[] = [
  {
    lat: 34,
    lng: -92,
    icon: <AmericaSVG className="size-2.5" />,
  },
  {
    lat: -16,
    lng: 102,
    icon: <SingaporeSVG className="size-2.5" />,
  },
  {
    lat: 30,
    lng: 105,
    icon: <ChineseSVG className="size-2.5" />,
  },
  {
    lat: -4,
    lng: -89,
    icon: <HondurasSVG className="size-2.5" />,
  },
  {
    lat: 5 - 6,
    lng: 98.9853 + 4,
    icon: <ThailandSVG className="size-2.5" />,
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
  contentTransformStyle?: string;
  index?: number; // 动画标识符
};
export const WORLD_MAP_DOTS: MapDotData[] = [
  {
    index: 0,
    lat: 31.23 - 12,
    lng: 121,
    country: 'China', // 新加的一个
    label: 'Shanghai',
    period: '2024/11',
    key: 'sh_timepie_2024', // Unique identifier for the dot
    title: 'The 5th TIMEPIE LONGEVITY FORUM', //上海timepie
    contentTransformStyle: 'translate(-85%, 0)',
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
    lat: -10,
    lng: -85,
    label: 'Roatan',
    country: 'Hondurus',
    period: '2024/01',
    key: 'roatan_vitalia_2024', // Unique identifier for the dot
    title: 'Vitalia @ Roatan, Honduras',
    contentTransformStyle: 'translate(-85%, 0)',
    imgs: [
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
    index: 2,
    lat: 18.796143 - 15,
    lng: 98.979263 + 6,
    country: 'Thailand',
    label: 'Chiang Mai',
    period: '2024/11',
    key: 'cm_lanna_2024', // Unique identifier for the dot
    title: 'Edge City Lanna',
    contentTransformStyle: 'translate(-85%, 0)',
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
    index: 3,
    lat: -13,
    lng: 106,
    // label: 'Singapore',
    country: 'Singapore', //如果为空就不显示
    period: '2025',
    key: 'sg_flf_2025', // Unique identifier for the dot
    title: 'Founders Longevity Forum',
    contentTransformStyle: 'translate(-85%, 0)',
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
];

export type MapBookDotData = {
  lat: number;
  lng: number;
  title?: string;
  desc?: string; // 灰字描述
  key?: string;
  coverUrl?: string;
  contentTransformStyle?: string;
  link?: string; // 跳转链接
};
export const MAP_BOOK_DOTS: MapBookDotData[] = [
  {
    lat: 20,
    lng: -114,
    key: 'publications-01',
    // contentTransformStyle: 'translate(-85%, 0)',
    title: 'The Network State',
    desc: 'Read Chinese Ver. by Boyang', // 描述
    coverUrl: '/imgs/engagement/book-01.webp',
    link: 'https://www.thenetworkstate-zh.com/foreword/', // 跳转链接
  },
  {
    lat: -24,
    lng: 140,
    key: 'publications-02',
    // contentTransformStyle: 'translate(-85%, 0)',
    title: 'bio/acc manifesto',
    desc: 'Read Chinese Ver. by Boyang', // 描述
    coverUrl: '/imgs/engagement/book-02.webp',
    link: 'https://bioacc.life/zh/', // 跳转链接
  },
];

export const engagementBottomButtons: Record<'publications' | 'sponsorship', { title: string; items: PopupItem[] }> = {
  publications: {
    title: 'Translation',
    items: [
      {
        name: 'The Network State', // 书名
        logo: '/imgs/engagement/book-01.webp', // 书封面
        desc: 'Guidelines for biotech ethics', // 描述
        linkDesc: 'Read Chinese Ver. by Boyang', // 描述
        link: 'https://.......', // 跳转链接
      },
      {
        name: 'bio/acc manifesto', // 书名
        logo: '/imgs/engagement/book-02.webp', // 书封面
        desc: 'Guidelines for biotech ethics', // 描述
        linkDesc: 'Read Chinese Ver. by Boyang', // 描述
        link: 'https://.......', // 跳转链接
      },
    ],
  },
  sponsorship: {
    title: 'Sponsorship',
    items: [
      {
        name: 'VITALIST BAY',
        logo: '/imgs/engagement/sponsor-01.webp',
        className: 'h-7.5',
      },
      {
        name: 'ETHPanda',
        logo: '/imgs/engagement/sponsor-02.webp',
        className: 'h-7',
      },
      {
        name: 'OXFORD LONGEVITY',
        logo: '/imgs/engagement/sponsor-03.webp',
        className: 'h-7.5',
      },
      {
        name: 'ARRD',
        logo: '/imgs/engagement/sponsor-04.webp',
        className: 'h-9',
      },
    ],
  },
};
