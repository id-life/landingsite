import { AmericaSVG, ChineseSVG, EuropeanUnionSVG, HongKongSVG, JapanSVG, KoreanSVG, SingaporeSVG } from '@/components/svg';
import { MapRegionDotData } from '@/components/engagement/WorldMap';
import { PopupItem } from '@/components/engagement/EngagementPopup';

export const WORLD_MAP_REGION_DOTS: MapRegionDotData[] = [
  {
    lat: 34,
    lng: -92,
    icon: <AmericaSVG className="size-2.5" />,
  },
  {
    lat: 23,
    lng: 128,
    icon: <KoreanSVG className="size-2.5" />,
  },
  {
    lat: 28,
    lng: 141,
    icon: <JapanSVG className="size-2.5" />,
  },
  {
    lat: -14,
    lng: 103.85,
    icon: <SingaporeSVG className="size-2.5" />,
  },
  {
    lat: 7,
    lng: 116,
    icon: <HongKongSVG className="size-2.5" />,
  },

  {
    lat: 39,
    lng: 116,
    icon: <ChineseSVG className="size-2.5" />,
  },

  {
    lat: 38.7223,
    lng: 10,
    icon: <EuropeanUnionSVG className="size-2.5" />,
  },
];

export type MapDotData = {
  lat: number;
  lng: number;
  label?: string;
  period?: string;
  key?: string;
  title?: string;
  imgs?: {
    src: string;
    alt: string;
  }[];
  className?: string;
};
export const WORLD_MAP_DOTS: MapDotData[] = [
  {
    lat: 16,
    lng: 120,
    label: 'Shanghai',
    period: '2024',
    key: 'shanghai', // Unique identifier for the dot
    title: '2024 Oxford Future Innovation Forum\nHealthy Ageing sub-forum',
    className: 'top-0 right-0',
    imgs: [
      {
        src: '/imgs/engagement/talk-01.webp',
        alt: 'talk-01.webp',
      },
      {
        src: '/imgs/engagement/talk-02.webp',
        alt: 'talk-02.webp',
      },
      {
        src: '/imgs/engagement/talk-03.webp',
        alt: 'talk-03.webp',
      },
      {
        src: '/imgs/engagement/talk-04.webp',
        alt: 'talk-04.webp',
      },
    ],
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
