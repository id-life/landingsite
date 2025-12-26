'use client';

import { ReactNode } from 'react';
import NewsFooter from './_components/NewsFooter';
import NewsHeader from './_components/NewsHeader';
import NewsStyle from './_components/NewsStyle';
import MobileFooter from '@/components/layout/footer/MobileFooter';

export default function NewsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NewsStyle />
      <div className="mx-auto px-[20rem] mobile:px-5">
        <NewsHeader />
        {children}
        <NewsFooter />
      </div>
      <MobileFooter />
    </>
  );
}
