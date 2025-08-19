import { ReactNode } from 'react';
import SpectrumHeader from '@/app/spectrum/_components/SpectrumHeader';
import INStyle from '../_components/INStyle';

export default function InfluenceNetworkLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <INStyle />
      <div className="relative h-full w-full">
        <SpectrumHeader className="fixed left-0 top-0 w-full" />
        {children}
      </div>
    </>
  );
}
