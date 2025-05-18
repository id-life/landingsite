import { useMemo } from 'react';
import { MeetingSVG, SponsorSVG } from '../../components/svg';

export type SpectrumLinkItem = {
  label: string;
  link?: string; // jumpTo link
  onClick?: () => void; // jumpTo some where
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
        icon: <MeetingSVG />,
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
        icon: <SponsorSVG />,
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
      url: '/imgs/particle/0.png',
      scaleNum: isMobile ? 0.8 : 2.2,
      resize: [512, 300],
    },
    {
      url: '/imgs/particle/spectrum/01.png',
      resize: [700, 700],
      scaleNum: isMobile ? 0.4 : 0.8,
      loadPercentage: 0.005,
    },
    {
      url: '/imgs/particle/spectrum/02.png',
      resize: [700, 700],
      scaleNum: isMobile ? 0.4 : 0.8,
      loadPercentage: 0.005,
    },
  ];
};
