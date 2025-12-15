'use client';

import React, { ReactNode } from 'react';
import NewsHeader from './_components/NewsHeader';
import NewsFooter from './_components/NewsFooter';
import NewsSubscribeFooter from './_components/NewsSubscribeFooter';

export default function NewsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto max-w-screen-xl">
      <NewsHeader />
      {children}
      <NewsFooter />
      <NewsSubscribeFooter />
    </div>
  );
}
