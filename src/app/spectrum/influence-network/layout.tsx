import React, { ReactNode } from 'react';
import SpectrumHeader from '@/app/spectrum/_components/SpectrumHeader';

export default function InfluenceNetworkLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <SpectrumHeader />
      {children}
    </div>
  );
}
