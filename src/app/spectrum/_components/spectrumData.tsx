// Shared spectrum data - used by both useSpectrumData hook and SpectrumSEO component

import { BookSVG, DigitalTwinSVG, InternSVG, RelationSVG, SponsorSVG } from '@/components/svg';
import { CollectionPage, WithContext } from 'schema-dts';

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
      { label: 'Bio/Acc Manifesto', link: 'https://bioacc.life/zh/' },
      {
        label: 'The case against death',
        isComingSoon: true,
        labelClassName: '-ml-4 mobile:ml-0 text-[.5rem]/3',
      },
      { label: 'The Network State', link: 'https://www.thenetworkstate-zh.com/foreword/' },
      {
        label: 'Better With Age',
        labelClassName: '-ml-4 mobile:ml-0',
        link: 'https://book.douban.com/subject/37415399/?dt_dapp=1',
      },
    ],
  },
  {
    title: 'Evangelism',
    titleCn: '布道者',
    icon: <RelationSVG />,
    links: [
      { label: 'Influence Network', link: 'https://landingsite-test.id.life/spectrum/influence-network' },
      { label: 'Disease Management', link: 'https://landingsite-test.id.life/spectrum/disease-management' },
    ],
  },
  {
    title: 'Digital Twin',
    titleCn: '数字孪生',
    icon: <DigitalTwinSVG />,
    className: 'mobile:pt-4',
    links: [{ label: 'Access Digital Twin', link: 'https://landingsite-test.id.life/digitaltwin' }],
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
        link: 'https://agingpharma.org/',
        icon: '/imgs/investments/sponsors/ardd.png',
        size: 'h-15',
        mobileSize: 'h-10.5 ipad:h-15',
      },
      {
        label: 'TimePie Longevity Forum',
        link: 'https://www.timepie.com/',
        icon: '/imgs/investments/sponsors/time-pie.png',
        size: 'h-15',
        mobileSize: 'h-10.5 ipad:h-14',
      },
      {
        label: 'Lifespan Research Institute',
        link: 'https://lifespan.io/',
        icon: '/imgs/investments/sponsors/lifespan.png',
        size: 'h-12',
        mobileSize: 'h-8 ipad:h-13',
      },
      {
        label: 'Public Longevity Group',
        link: '',
        icon: '/imgs/investments/sponsors/public-longevity.png',
        size: 'h-15',
        mobileSize: 'h-10.5 ipad:h-15',
      },
      {
        label: '2060 Longevity Forum',
        link: 'https://forum.2060.life/',
        icon: '/imgs/investments/sponsors/2060-longevity.png',
        size: 'h-12',
        mobileSize: 'h-8 ipad:h-13',
      },
      {
        label: 'REVIVE ME',
        link: 'https://revivemeexpo.com/',
        icon: '/imgs/investments/sponsors/revive-me.png',
        size: 'h-12',
        mobileSize: 'h-8 ipad:h-13',
      },
      {
        label: 'Health Longevity and Medicine Conference',
        link: 'https://www.hlmconference.com/',
        icon: '/imgs/investments/sponsors/healthy-longevity.png',
        size: 'h-15',
        mobileSize: 'h-10.5 ipad:h-15',
      },
      {
        label: 'Vitalist Bay Summit',
        link: 'https://vitalistbay.com/',
        icon: '/imgs/investments/sponsors/vitalist-bay.png',
        size: 'h-12',
        mobileSize: 'h-8 ipad:h-13',
      },
      {
        label: 'UNIVERSITY OF COPENHAGEN PROJECT: Aging Brain Rejuvenation',
        link: '',
        icon: '/imgs/investments/sponsors/aging-brain.png',
        size: 'h-18',
        mobileSize: 'h-14 ipad:h-18',
      },
      {
        label: 'UNIVERSITY OF OXFORD PROJECT: Heart Aging And Metabolism',
        link: '',
        icon: '/imgs/investments/sponsors/heart-aging.png',
        size: 'h-18',
        mobileSize: 'h-14 ipad:h-18',
      },
      {
        label: 'Stanford University PROJECT: Brain Resilience Mechanism',
        link: '',
        icon: '/imgs/investments/sponsors/brain-resilience.png',
        size: 'h-18',
        mobileSize: 'h-14 ipad:h-18',
      },
      {
        label: 'Cornerstone Non-profit Foundation',
        link: 'https://www.cornerstone.foundation/',
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

export const getSpectrumJsonLd = (): WithContext<CollectionPage> => ({
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
