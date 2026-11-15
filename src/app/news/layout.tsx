import { ReactNode } from 'react';
import NewsFooter from './_components/NewsFooter';
import SiteFooter from '@/components/site/SiteFooter';
import SiteHeader from '@/components/site/SiteHeader';
import NewsStyle from './_components/NewsStyle';
import SubscribePopup from '@/components/layout/footer/SubscribePopup';

// A server component: the pages render on the server and only the header, the footer form, the cards and the
// popup hydrate. It was a client layout (useIsMobile), which made the whole news tree client code.
export default function NewsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NewsStyle />
      {/* 80rem (1280 px) from 1360 px up, as before; narrower screens keep a 40 px margin each side. */}
      <div className="mx-auto w-[min(80rem,calc(100%-5rem))] mobile:w-auto mobile:px-5">
        <SiteHeader variant="solid" currentId="news" className="relative py-5" />
        {children}
        <SiteFooter>
          <NewsFooter />
        </SiteFooter>
      </div>
      <SubscribePopup />
    </>
  );
}
