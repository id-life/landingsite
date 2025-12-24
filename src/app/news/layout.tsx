'use client';

import React, { ReactNode } from 'react';
import NewsHeader from './_components/NewsHeader';
import NewsFooter from './_components/NewsFooter';
import NewsSubscribeFooter from './_components/NewsSubscribeFooter';
import Style from '@/app/(home)/_components/Style';

export default function NewsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Style />
      <div className="container mx-auto max-w-[1280px] px-4">
        <NewsHeader />
        {children}
        <NewsFooter />
        <NewsSubscribeFooter />
      </div>
    </>
  );
}
