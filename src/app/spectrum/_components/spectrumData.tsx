// Shared spectrum data - used by both useSpectrumData hook and SpectrumSEO component

import { BookSVG, DigitalTwinSVG, InternSVG, RelationSVG, SponsorSVG } from '@/components/svg';

export type SpectrumLinkData = {
  label: string;
  link?: string;
  isComingSoon?: boolean;
  routeKey?: string;
  labelClassName?: string;
  icon?: string;
  size?: string;
  mobileSize?: string;
};

export type SpectrumItemData = {
  title: string;
  titleCn: string;
  icon: JSX.Element;
  links: SpectrumLinkData[];
  linksClassName?: string;
  className?: string;
};

export const spectrumBaseData: SpectrumItemData[] = [
  {
    title: 'Translation & Publishing',
    titleCn: '翻译与出版',
    icon: <BookSVG />,
    linksClassName: 'grid grid-cols-2',
    links: [
      { label: 'Bio/Acc Manifesto', routeKey: 'biohacker-dao' },
      {
        label: 'The case against death',
        isComingSoon: true,
        labelClassName: '-ml-4 mobile:ml-0 text-[.5rem]/3',
      },
      { label: 'The Network State', routeKey: 'the-network-state' },
      { label: 'Better With Age', labelClassName: '-ml-4 mobile:ml-0', routeKey: 'better-with-age' },
    ],
  },
  {
    title: 'Evangelism',
    titleCn: '布道者',
    icon: <RelationSVG />,
    links: [
      { label: 'Influence Network', link: '/spectrum/influence-network' },
      { label: 'Disease Management', link: '/spectrum/disease-management' },
    ],
  },
  {
    title: 'Digital Twin',
    titleCn: '数字孪生',
    icon: <DigitalTwinSVG />,
    className: 'mobile:pt-4',
    links: [{ label: 'Access Digital Twin', routeKey: 'digital-twin' }],
  },
  {
    title: 'Global Internship',
    titleCn: '实习生计划',
    icon: <InternSVG />,
    className: 'mobile:pt-4',
    links: [
      { label: 'Apply (CN)', link: 'https://id.life/career' },
      { label: 'Apply (EN)', link: 'https://id.life/career-en' },
    ],
  },
  {
    title: 'Proudly Sponsoring & Supporting',
    titleCn: '本机构赞助支持',
    icon: <SponsorSVG />,
    className: 'mobile:text-xl',
    links: [
      {
        label: 'ARDD',
        routeKey: 'ardd-2025',
        icon: '/imgs/investments/sponsors/ardd.png',
        size: 'h-15',
        mobileSize: 'h-10.5 ipad:h-15',
      },
      {
        label: 'TimePie Longevity Forum',
        routeKey: 'timepie-longevity-forum',
        icon: '/imgs/investments/sponsors/time-pie.png',
        size: 'h-15',
        mobileSize: 'h-10.5 ipad:h-14',
      },
      {
        label: 'Lifespan Research Institute',
        routeKey: 'lifespan-research-institute',
        icon: '/imgs/investments/sponsors/lifespan.png',
        size: 'h-12',
        mobileSize: 'h-8 ipad:h-13',
      },
      {
        label: 'Public Longevity Group',
        routeKey: 'public-longevity-group',
        icon: '/imgs/investments/sponsors/public-longevity.png',
        size: 'h-15',
        mobileSize: 'h-10.5 ipad:h-15',
      },
      {
        label: '2060 Longevity Forum',
        routeKey: '2060-longevity-forum',
        icon: '/imgs/investments/sponsors/2060-longevity.png',
        size: 'h-12',
        mobileSize: 'h-8 ipad:h-13',
      },
      {
        label: 'REVIVE ME',
        routeKey: 'revive-me-2025',
        icon: '/imgs/investments/sponsors/revive-me.png',
        size: 'h-12',
        mobileSize: 'h-8 ipad:h-13',
      },
      {
        label: 'Health Longevity and Medicine Conference',
        routeKey: 'healthy-longevity-medicine-conference',
        icon: '/imgs/investments/sponsors/healthy-longevity.png',
        size: 'h-15',
        mobileSize: 'h-10.5 ipad:h-15',
      },
      {
        label: 'Vitalist Bay Summit',
        routeKey: 'vitalist-bay-summit-grant',
        icon: '/imgs/investments/sponsors/vitalist-bay.png',
        size: 'h-12',
        mobileSize: 'h-8 ipad:h-13',
      },
      {
        label: 'Cornerstone Non-profit Foundation',
        link: 'https://www.cornerstoneondemand.org',
        icon: '/imgs/investments/sponsors/cornerstone.png',
        size: 'h-6.5',
        mobileSize: 'h-4.5 ipad:h-6.5',
      },
      {
        label: 'Beyond Tomorrow Podcast',
        link: 'https://beyondtomorrowpodcast.com/',
        icon: '/imgs/investments/sponsors/beyond-tomorrow.png',
        size: 'h-5',
        mobileSize: 'h-3.5 ipad:h-4.5',
      },
      {
        label: 'HackAging.ai Hackathon',
        link: 'https://www.hackaging.ai/',
        icon: '/imgs/investments/sponsors/hackaging.png',
        size: 'h-5',
        mobileSize: 'h-3.5 ipad:h-4.5',
      },
      {
        label: 'BioHackerDAO',
        link: 'https://biohackerdao.org/',
        icon: '/imgs/investments/sponsors/biohackerdao.png',
        size: 'h-15',
        mobileSize: 'h-10.5 ipad:h-15',
      },
    ],
  },
];

export const getSpectrumJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'IMMORTAL DRAGONS Spectrum - Longevity Initiatives',
  url: 'https://id.life/spectrum',
  description:
    "Immortal Dragon's variety of longevity initiatives including translation, publishing, sponsorships, digital twin, and global internship programs.",
  hasPart: spectrumBaseData.map((item) => ({
    '@type': 'WebPageElement',
    name: `${item.title} (${item.titleCn})`,
    description: item.links.map((l) => l.label).join(', '),
  })),
});
