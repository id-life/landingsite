import React, { ReactNode } from 'react';
import DMStyle from '@/app/spectrum/_components/DMStyle';
import SpectrumHeader from '@/app/spectrum/_components/SpectrumHeader';
import '@/styles/components/disease-management-page.css';

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
