import React, { ReactNode } from 'react';
import DMStyle from '@/app/spectrum/_components/DMStyle';
import '@/styles/components/disease-management-page.css';
import SpectrumHeader from '@/app/spectrum/_components/SpectrumHeader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disease Management & Cure Status | Immortal Dragons',
  description: '可治疗与可控制疾病列表 A list of curable and manageable diseases',
  keywords: [
    'curable diseases',
    'manageable diseases',
    'disease management status',
    'disease cure status',
    'disease wikipedia',
    '疾病百科',
    '可治愈疾病列表',
    '可控制疾病列表',
  ],
  openGraph: {
    title: 'Disease Management & Cure Status | Immortal Dragons',
    siteName: 'Immortal Dragons',
    description: '可治疗与可控制疾病列表 A list of curable and manageable diseases',
    images: [
      {
        url: 'https://cdn.id.life/id-life-cover-2.webp',
      },
    ],
  },
};

export default function DiseaseManagementLayout({ children }: { children: ReactNode }) {
  return (
    <div className="disease-management-page relative z-[100] flex h-screen flex-col overflow-y-auto bg-black">
      <DMStyle />
      <SpectrumHeader />
      <div className="hide-scrollbar flex-1 overflow-y-auto px-10 pb-10 mobile:px-5 mobile:pb-5">{children}</div>
      <div className="base-background base-background1 fixed left-0 top-0 -z-10 h-screen w-screen" />
    </div>
  );
}
