'use client';

import { ReactNode } from 'react';
import NewsFooter from '@/app/news/_components/NewsFooter';
import NewsHeader from '@/app/news/_components/NewsHeader';
import NewsStyle from '@/app/news/_components/NewsStyle';
import NewsSubscribeFooter from '@/app/news/_components/NewsSubscribeFooter';
import MobileFooter from '@/components/layout/footer/MobileFooter';
import { useIsMobile } from '@/hooks/useIsMobile';

// The About page uses the content pages' header and footer (the same frame as /news and the articles) until NAV-04's
// shared site header and footer exist. No 3D, no experience components.
export default function AboutLayout({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <>
      <NewsStyle />
      <div className="mx-auto w-[80rem] mobile:w-auto mobile:px-5">
        <NewsHeader />
        {children}
        <NewsFooter />
      </div>
      {isMobile ? <MobileFooter /> : <NewsSubscribeFooter />}
    </>
  );
}
