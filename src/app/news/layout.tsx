'use client';

import React, { ReactNode } from 'react';
import NewsHeader from './_components/NewsHeader';
import NewsFooter from './_components/NewsFooter';

export default function NewsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto max-w-screen-xl mobile:px-2">
      <NewsHeader />
      {children}
      <NewsFooter />
    </div>
  );
}
