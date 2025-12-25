'use client';

import { ReactNode } from 'react';
import NewsFooter from './_components/NewsFooter';
import NewsHeader from './_components/NewsHeader';
import NewsSubscribeFooter from './_components/NewsSubscribeFooter';
import Style from '../(home)/_components/Style';

export default function NewsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Style />
      <div className="mx-auto px-4">
        <NewsHeader />
        {children}
        <NewsFooter />
        <NewsSubscribeFooter />
      </div>
    </>
  );
}
