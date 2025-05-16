import { useMemo } from 'react';
import { MeetingSVG, SponsorSVG } from '../../components/svg';

export type SpectrumLinkItem = {
  label: string;
  link?: string; // jumpTo link
  onClick?: () => void; // jumpTo some where
  linkElement?: JSX.Element; // jumpTo linkElement
  className?: string;
};

export type SpectrumItemInfo = {
  title: string;
  titleCn: string;
  icon: JSX.Element;
  links?: SpectrumLinkItem[];
};

export const useSpectrumData = () => {
  const spectrumData: SpectrumItemInfo[] = useMemo(() => {
    const data: SpectrumItemInfo[] = [
      {
        title: 'Insights Sharing',
        titleCn: '演讲与洞见',
        icon: <MeetingSVG className="size-7.5 fill-white" />,
        links: [
          {
            label: 'bio/acc manifesto',
            // onClick: jumpTo engagement meetings
          },
        ],
      },
      {
        title: 'Grant & Sponsorships',
        titleCn: '赞助',
        icon: <SponsorSVG className="size-7.5 fill-white" />,
        links: [
          {
            label: 'Public Longevity Group',
            // onClick: jumpTo engagement sponsors
          },
          {
            label: 'EthPanda',
            // onClick: jumpTo engagement sponsors
          },
          {
            label: 'BiohackerDAO',
            // onClick: jumpTo engagement sponsors
          },
          {
            label: 'Vitalist Bay',
            // onClick: jumpTo engagement sponsors
          },
        ],
      },
    ];
    return data;
  }, []);
  return spectrumData;
};

export const spectrumGetSourceImgInfos = (isMobile: boolean) => {
  return [
    {
      url: '/imgs/particle/1.png',
      scaleNum: isMobile ? 0.8 : 2.2,
      resize: [512, 300],
    },
    {
      url: '/imgs/particle/0.png',
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
  ];
};
