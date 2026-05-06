'use client';

import { ReactNode } from 'react';
import NewsFooter from './_components/NewsFooter';
import NewsHeader from './_components/NewsHeader';
import NewsStyle from './_components/NewsStyle';
import NewsSubscribeFooter from './_components/NewsSubscribeFooter';
import MobileFooter from '@/components/layout/footer/MobileFooter';
import { useIsMobile } from '@/hooks/useIsMobile';
import { cn } from '@/utils';

export default function NewsLayout({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <>
      <NewsStyle />
      <div className={cn('mx-auto w-[80rem] mobile:w-auto mobile:px-5')}>
        <NewsHeader />
        {children}
        <NewsFooter />
      </div>
      {isMobile ? <MobileFooter /> : <NewsSubscribeFooter />}
    </>
  );
}
