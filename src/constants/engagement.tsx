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

// ============================================================================
// Mobile Map Scaling Constants - Adjust these to change overall mobile map scaling
// ============================================================================
export const MOBILE_MAP_SCALE = {
  // Base scale multiplier (1.0 = current, 1.2 = 20% larger, etc.)
  baseScale: 0.8,

  // Dot container size (Tailwind class: size-X)
  dotContainerSize: 'size-5', // 20px

  // Dot SVG positioning and size for mobile (used in PulseDot component)
  dotSvgSize: 'size-14', // 56px - SVG element size for mobile dots
  dotSvgPosition: 'absolute left-[-16px] top-[-18px]', // SVG positioning to center the pulse effect

  // Location label text size (Tailwind class: text-X/Y)
  labelTextClass: 'text-[8px]/[12px]', // 12px

  // Region icon size (Tailwind class: size-X)
  regionIconSize: 'size-4', // 16px

  // Badge text size (Tailwind class: text-X/Y)
  badgeTextClass: 'text-[8px]/[10px]', // 8px

  // Badge icon size (Tailwind class: size-X)
  badgeIconSize: 'size-2.5', // 10px

  // Badge padding (Tailwind class: px-X py-Y)
  badgePaddingClass: 'px-0.5 py-0.5',

  // Badge gap between items (Tailwind class: gap-X)
  badgeGapClass: 'gap-1',

  // Badge container top offset
  badgeContainerTopClass: 'top-[calc(100%_+_0.125rem)]',

  // Content image dimensions
  contentImageClass: 'h-[4rem] w-[7.5rem]', // 64px × 120px

  // Content max width
  contentMaxWidth: 'max-w-[12rem]', // 192px

  // Content title text size
  contentTitleClass: 'text-xs/4', // 14px

  // Extra sponsor section dimensions
  extraSponsorWidth: 'w-[12rem]', // 192px
  extraSponsorTitleClass: 'text-xs/4', // 16px
  extraSponsorLogoSize: 'size-[10rem]', // 160px
  extraSponsorMarginTop: '-mt-3',
};

export type MapRegionDotData = {
  lat: number;
  lng: number;
  icon?: ReactNode;
};

// Region icon size: mobile uses MOBILE_MAP_SCALE.regionIconSize (default: size-6)
// To change: update MOBILE_MAP_SCALE.regionIconSize AND the mobile:size-X classes below
export const WORLD_MAP_REGION_DOTS: MapRegionDotData[] = [
  {
    lat: 40,
    lng: -106,
    icon: <AmericaSVG className="size-7 mobile:size-3.5" />,
  },
  {
    lat: 33,
    lng: 21,
    icon: <img src="/imgs/engagement/montenegro.webp" alt="" className="size-7 mobile:size-3.5" />,
  },
  {
    lat: -14,
    lng: 97,
    icon: <SingaporeSVG className="size-7 mobile:size-3.5" />,
  },
  {
    lat: 30,
    lng: 99,
    icon: <ChineseSVG className="size-7 mobile:size-3.5" />,
  },
  {
    lat: -1,
    lng: -98,
    icon: <HondurasSVG className="size-7 mobile:size-3.5" />,
  },
  {
    lat: 5,
    lng: 100,
    icon: <ThailandSVG className="size-7 mobile:size-3.5" />,
  },
  {
    lat: 55,
    lng: -10,
    icon: <img src="/imgs/engagement/uk.webp" alt="" className="size-7 mobile:size-3.5" />,
  },
  {
    lat: 64,
    lng: 8,
    icon: <DenmarkSVG className="size-7 mobile:size-3.5" />,
  },
  {
    lat: 42,
    lng: 0,
    icon: <FranceSVG className="size-7 mobile:size-3.5" />,
  },
  {
    lat: 13,
    lng: 51,
    icon: <img src="/imgs/engagement/uae.webp" alt="" className="size-7 mobile:size-3.5" />,
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
  isResearch?: boolean; // is also a research dot
  videoUrl?: string;
  // if has sponsor
  extraSponsorContainerClassPc?: string; // class for the extraSponsor container (pc)
  extraSponsorContainerClassMobile?: string; // class for the extraSponsor container (mobile)
  extraSponsor?: {
    alt: string;
    coverUrl: string;
    videoUrl: string;
    link: string;
    classNamePc?: string; // class for individual item positioning (pc)
    classNameMobile?: string; // class for individual item positioning (mobile)
  }[];
};
export const WORLD_MAP_DOTS: MapDotData[] = [
  {
    index: 0,
    lat: 22,
    lng: 120,
    country: 'China',
    label: 'Shanghai',
    key: 'sh_timepie_2024', // Unique identifier for the dot
    secondTitle: 'The 5th TIMEPIE LONGEVITY\nFORUM',
    title: 'The 6th TIMEPIE LONGEVITY\nFORUM',
    link: 'https://www.timepielongevityforum.com/',
    contentTransformClass: '-translate-x-[calc(100%_+_1rem)] -translate-y-[40%]',
    mobileContentTransformClass: '-translate-x-full -translate-y-[35%]',
    pcDotHotAreaClass: 'top-[25vh]',
    activeOtherDarkerDotIDs: ['world-map-dot-sponsor-0', 'world-map-dot-1', 'world-map-dot-2'],
    secondImgs: [
      {
        src: 'https://resources.id.life/engagement/Shanghai-01.webp',
        alt: 'Shanghai-01.webp',
      },
      {
        src: 'https://resources.id.life/engagement/Shanghai-02.webp',
        alt: 'Shanghai-02.webp',
      },
      {
        src: 'https://resources.id.life/engagement/Shanghai-03.webp',
        alt: 'Shanghai-03.webp',
      },
      {
        src: 'https://resources.id.life/engagement/Shanghai-04.webp',
        alt: 'Shanghai-04.webp',
      },
    ],
    imgs: [
      {
        src: 'https://resources.id.life/engagement/timepie-2025-01.webp',
        alt: 'timepie-2025-01.webp',
      },
      {
        src: 'https://resources.id.life/engagement/timepie-2025-02.webp',
        alt: 'timepie-2025-02.webp',
      },
      {
        src: 'https://resources.id.life/engagement/timepie-2025-03.webp',
        alt: 'timepie-2025-03.webp',
      },
      {
        src: 'https://resources.id.life/engagement/timepie-2025-04.webp',
        alt: 'timepie-2025-04.webp',
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
    mobileContentTransformClass: '-translate-x-full -translate-y-[30%]',
    pcDotHotAreaClass: 'top-[25.5vh]',
    activeOtherDarkerDotIDs: ['world-map-dot-sponsor-0', 'world-map-dot-0', 'world-map-dot-2'],
    imgs: [
      {
        src: 'https://resources.id.life/engagement/Chiangmai-1.webp',
        alt: 'Chiangmai-1.webp',
      },
      {
        src: 'https://resources.id.life/engagement/Chiangmai-2.webp',
        alt: 'Chiangmai-2.webp',
      },
      {
        src: 'https://resources.id.life/engagement/Chiangmai-3.webp',
        alt: 'Chiangmai-3.webp',
      },
    ],
  },
  {
    index: 2,
    lat: -19,
    lng: 101,
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
        src: 'https://resources.id.life/engagement/Singapore-1.webp',
        alt: 'Singapore-1.webp',
      },
      {
        src: 'https://resources.id.life/engagement/Singapore-2.webp',
        alt: 'Singapore-2.webp',
      },
      {
        src: 'https://resources.id.life/engagement/Singapore-3.webp',
        alt: 'Singapore-3.webp',
      },
      {
        src: 'https://resources.id.life/engagement/Singapore-4.webp',
        alt: 'Singapore-4.webp',
      },
      {
        src: 'https://resources.id.life/engagement/Singapore-5.webp',
        alt: 'Singapore-5.webp',
      },
    ],
    extraSponsor: [
      {
        alt: 'Healthy Longevity Medicine\nConference',
        coverUrl: 'https://resources.id.life/engagement/sponsor/sponsor-09.png',
        videoUrl: 'https://resources.id.life/engagement/sponsor/sponsor-09.webm',
        link: 'https://www.hlmconference.com/',
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
    mobileContentTransformClass: 'translate-x-[70%] -translate-y-[60%]',
    pcDotHotAreaClass: 'right-full -left-full top-[36vh]',
    activeOtherDarkerDotIDs: ['world-map-dot-sponsor-2', 'world-map-dot-sponsor-1', 'world-map-dot-5', 'world-map-dot-7'],
    imgs: [
      {
        src: 'https://resources.id.life/engagement/Honduras-5.webp',
        alt: 'Honduras-5.webp',
      },
      {
        src: 'https://resources.id.life/engagement/Honduras-1.webp',
        alt: 'Honduras-1.webp',
      },
      {
        src: 'https://resources.id.life/engagement/Honduras-2.webp',
        alt: 'Honduras-2.webp',
      },
      {
        src: 'https://resources.id.life/engagement/Honduras-3.webp',
        alt: 'Honduras-3.webp',
      },
      {
        src: 'https://resources.id.life/engagement/Honduras-4.webp',
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
    contentTransformClass: 'translate-x-[125%] -translate-y-[35%]',
    mobileContentTransformClass: 'translate-x-full -translate-y-[32%]',
    pcDotHotAreaClass: 'right-full -left-full top-[23vh]',
    activeOtherDarkerDotIDs: ['world-map-dot-book-2', 'world-map-dot-3', 'world-map-dot-sponsor-3'],
    videoUrl: 'https://www.youtube.com/watch?v=2FJi1k7xNuo&t=1382s',
    imgs: [
      {
        src: 'https://resources.id.life/engagement/Berkeley-1.webp',
        alt: 'vitalistbay-1.webp',
      },
      {
        src: 'https://resources.id.life/engagement/Berkeley-2.webp',
        alt: 'vitalistbay-2.webp',
      },
      {
        src: 'https://resources.id.life/engagement/Berkeley-3.webp',
        alt: 'vitalistbay-3.webp',
      },
      {
        src: 'https://resources.id.life/engagement/Berkeley-4.webp',
        alt: 'vitalistbay-4.webp',
      },
      {
        src: 'https://resources.id.life/engagement/Berkeley-5.webp',
        alt: 'vitalistbay-5.webp',
      },
      {
        src: 'https://resources.id.life/engagement/Berkeley-6.webp',
        alt: 'vitalistbay-6.webp',
      },
    ],
    extraSponsor: [
      {
        alt: 'Research Project:\nBrain Resilience Mechanism',
        coverUrl: 'https://resources.id.life/engagement/sponsor/sponsor-brain-resilience-1.webp',
        videoUrl: 'https://resources.id.life/engagement/sponsorsponsor-brain-resilience-1.webm',
        link: '',
        classNameMobile: '-right-[135%]',
      },
      {
        alt: '',
        coverUrl: 'https://resources.id.life/engagement/sponsor/sponsor-brain-resilience-2.webp',
        videoUrl: 'https://resources.id.life/engagement/sponsorsponsor-brain-resilience-2.webm',
        link: '',
        classNamePc: 'top-60',
        classNameMobile: 'top-40 -right-[135%]',
      },
    ],
    isResearch: true,
  },
  {
    index: 5,
    lat: 49,
    lng: -4,
    label: 'London',
    country: 'UK',
    link: 'https://founderslongevity.co/',
    key: 'flf_global_2025', // Unique identifier for the dot
    title: 'Founders Longevity Forum\nLondon',
    secondTitle: 'Founders Forum Global',
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
        src: 'https://resources.id.life/engagement/London-1.webp',
        alt: 'London-1.webp',
      },
      {
        src: 'https://resources.id.life/engagement/London-2.webp',
        alt: 'London-21.webp',
      },
      {
        src: 'https://resources.id.life/engagement/London-3.webp',
        alt: 'London-3.webp',
      },
    ],
    imgs: [
      {
        src: 'https://resources.id.life/engagement/London-Global-1.webp',
        alt: 'London-Global-1.webp',
      },
      {
        src: 'https://resources.id.life/engagement/London-Global-2.webp',
        alt: 'London-Global-2.webp',
      },
      {
        src: 'https://resources.id.life/engagement/London-Global-3.webp',
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
    title: 'ARDD',
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
        src: 'https://resources.id.life/engagement/ardd-2025-1.webp',
        alt: 'ardd-2025-1.webp',
      },
      {
        src: 'https://resources.id.life/engagement/ardd-2025-2.webp',
        alt: 'ardd-2025-2.webp',
      },
      {
        src: 'https://resources.id.life/engagement/ardd-2025-3.webp',
        alt: 'ardd-2025-3.webp',
      },
      {
        src: 'https://resources.id.life/engagement/ardd-2025-4.webp',
        alt: 'ardd-2025-4.webp',
      },
    ],
    extraSponsor: [
      {
        alt: 'Research Project:\nAging Brain Rejuvenation',
        coverUrl: 'https://resources.id.life/engagement/sponsor/sponsor-aging-brain.webp',
        videoUrl: 'https://resources.id.life/engagement/sponsor/sponsor-aging-brain.webm',
        link: '',
        classNamePc: 'top-60',
        classNameMobile: 'top-50 -right-[125%]',
      },
    ],
    isResearch: true,
    isSponsor: true,
  },
  {
    lat: 38,
    lng: 5,
    label: 'Aix-En-Provence',
    country: 'France',
    link: 'https://forum.2060.life',
    key: '2060_longevity_forum_2025', // Unique identifier for the dot
    title: '2060 Longevity Forum',
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
        src: 'https://resources.id.life/engagement/2060lf-2025-1.webp',
        alt: '2060lf-2025-1.webp',
      },
      {
        src: 'https://resources.id.life/engagement/2060lf-2025-2.webp',
        alt: '2060lf-2025-2.webp',
      },
      {
        src: 'https://resources.id.life/engagement/2060lf-2025-3.webp',
        alt: '2060lf-2025-3.webp',
      },
      {
        src: 'https://resources.id.life/engagement/2060lf-2025-4.webp',
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
  mobileContentTransformClass?: string; // mobile popup content transform class
};
export const MAP_BOOK_DOTS: MapBookDotData[] = [
  {
    lat: 33,
    lng: 26,
    key: 'publications-01',
    title: 'Lustica Bay, Montenegro',
    bookTitle: 'The Network State',
    desc: 'Chinese Version by Boyang',
    coverUrl: 'https://resources.id.life/engagement/book-01.webp',
    videoUrl: 'https://resources.id.life/engagement/book-01.webm',
    link: 'https://www.thenetworkstate-zh.com/foreword/',
    activeOtherDarkerDotIDs: ['world-map-dot-book-1', 'world-map-dot-sponsor-0', 'world-map-dot-5'],
    containerClass: 'scale-[0.9]',
    mobileContentTransformClass: 'translate-x-[10%] translate-y-2',
  },
  {
    lat: 15,
    lng: -112,
    key: 'publications-03',
    title: 'Los Angeles, USA',
    bookTitle: 'Better With Age 乐龄',
    desc: 'Chinese Version',
    coverUrl: 'https://resources.id.life/engagement/book-03.webp',
    videoUrl: 'https://resources.id.life/engagement/book-03.webm',
    link: 'https://book.douban.com/subject/37415399/?dt_dapp=1',
    containerClass: 'scale-[0.9]',
    activeOtherDarkerDotIDs: ['world-map-dot-3', 'world-map-dot-4', 'world-map-dot-sponsor-3'],
    mobileContentTransformClass: 'translate-x-[10%] translate-y-2',
  },
];

export type MapSponsorDotData = {
  lat: number;
  lng: number;
  mobileLat?: number;
  mobileLng?: number;
  icon?: string;
  title: string;
  data: {
    alt: string;
    coverUrl: string;
    videoUrl: string;
    link: string;
    className?: string; // class for individual item positioning
  }[];
  isConference?: boolean; // show conference badge
  conferenceText?: string; // conference badge text
  isSponsor?: boolean; // is also a sponsor dot
  sponsorText?: string; // sponsor badge text
  isResearch?: boolean; // is also a research dot
  researchText?: string; // research badge text
  pulseConfig?: PulseConfig; // custom pulse config
  activeOtherDarkerDotIDs?: string[]; // when active, the other dots will be more transparent
  mobileContentTransformClass?: string; // mobile popup content transform class
};
export const MAP_SPONSOR_DOTS: MapSponsorDotData[] = [
  {
    lat: 54,
    lng: -5,
    title: 'Oxford, UK',
    data: [
      {
        alt: 'Research Project:\nHeart Aging and Metabolism',
        coverUrl: 'https://resources.id.life/engagement/sponsor/sponsor-heart-aging.webp',
        videoUrl: 'https://resources.id.life/engagement/sponsor/sponsor-heart-aging.webm',
        link: '',
      },
      {
        alt: 'Oxford Future Innovation Forum',
        coverUrl: 'https://resources.id.life/engagement/sponsor/sponsor-03.png',
        videoUrl: 'https://resources.id.life/engagement/sponsor/sponsor-03.webm',
        link: 'https://mp.weixin.qq.com/s?__biz=MzI0MzUyODQ1MA==&mid=2247538673&idx=1&sn=8d3e1d197bb192808d1b0bf3b139b72d&chksm=e969b19cde1e388ab6a92c8a94aed3542aff8975b2ef9f95fb2275aa8735e66c7a0f916f1312&scene=178&cur_album_id=3764396479562301443#rd',
      },
    ],
    activeOtherDarkerDotIDs: [
      'world-map-dot-book-0',
      'world-map-dot-book-1',
      'world-map-dot-5',
      'world-map-dot-6',
      'world-map-dot-7',
    ],
    isConference: true,
    isResearch: true,
    isSponsor: true,
    mobileContentTransformClass: 'translate-x-[10%] translate-y-2',
  },
  {
    lat: 24,
    lng: -123.5,
    title: 'San Francisco, USA',
    data: [
      {
        alt: 'Public Longevity\nGroup',
        coverUrl: 'https://resources.id.life/engagement/sponsor/sponsor-05.png',
        videoUrl: 'https://resources.id.life/engagement/sponsor/sponsor-05.webm',
        link: 'https://publiclongevitygroup.framer.website/',
      },
      {
        alt: 'Lifespan Research\nInstitute',
        coverUrl: 'https://resources.id.life/engagement/sponsor/sponsor-05-2.png',
        videoUrl: 'https://resources.id.life/engagement/sponsor/sponsor-05-2.webm',
        link: 'https://www.lifespan.io/',
      },
    ],
    isSponsor: true,
    sponsorText: 'Grant',
    activeOtherDarkerDotIDs: ['world-map-dot-3', 'world-map-dot-4', 'world-map-dot-book-2'],
    mobileContentTransformClass: 'translate-x-[10%] translate-y-2',
  },
  {
    lat: 10,
    lng: 54,
    title: 'Abu Dhabi, UAE',
    data: [
      {
        alt: 'REVIVE ME',
        coverUrl: 'https://resources.id.life/engagement/sponsor/sponsor-08.webp',
        videoUrl: 'https://resources.id.life/engagement/sponsor/sponsor-08.webm',
        link: 'https://revivemeexpo.com/',
      },
    ],
    isConference: true,
    isSponsor: true,
    mobileContentTransformClass: 'translate-x-[10%] translate-y-2',
  },
];

export const MOBILE_DOT_SHOW_ORDER: {
  type: 'sponsor' | 'book' | 'meeting';
  index: number;
  offsetX?: number; // 水平偏移量（像素），正值向右偏移，负值向左偏移
}[] = [
  { type: 'meeting', index: 6, offsetX: 0 }, // 1. Copenhagen, Denmark
  { type: 'sponsor', index: 0, offsetX: 0 }, // 2. Oxford, UK
  { type: 'meeting', index: 5, offsetX: -110 }, // 3. London, UK
  { type: 'meeting', index: 7, offsetX: -50 }, // 4. Aix-En-Provence, France
  { type: 'book', index: 0, offsetX: 0 }, // 5. Lustica Bay, Montenegro
  { type: 'sponsor', index: 2, offsetX: 40 }, // 6. Abu Dhabi, UAE
  { type: 'meeting', index: 0, offsetX: 0 }, // 7. Shanghai, China
  { type: 'meeting', index: 1, offsetX: 0 }, // 8. Chiang Mai, Thailand
  { type: 'meeting', index: 2, offsetX: 0 }, // 9. Singapore
  { type: 'meeting', index: 4, offsetX: 80 }, // 10. Berkeley, USA
  { type: 'sponsor', index: 1, offsetX: 80 }, // 11. San Francisco, USA
  { type: 'book', index: 1, offsetX: 0 }, // 12. Los Angeles, USA
  { type: 'meeting', index: 3, offsetX: 90 }, // 13. Roatan, Honduras
];

export const getMobileDotShowInfo = (type: 'sponsor' | 'book' | 'meeting', index: number) => {
  const info = MOBILE_DOT_SHOW_ORDER.find((item) => item.type === type && item.index === index);
  return info;
};
