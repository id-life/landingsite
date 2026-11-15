import { ReactNode } from 'react';
import NewsFooter from '@/app/news/_components/NewsFooter';
import NewsHeader from '@/app/news/_components/NewsHeader';
import NewsStyle from '@/app/news/_components/NewsStyle';
import SubscribePopup from '@/components/layout/footer/SubscribePopup';

// The About page uses the content pages' header and footer (the same frame as /news and the articles) until NAV-04's
// shared site header and footer exist. No 3D, no experience components. A server component like the news layout:
// the page and its footer render on the server, and the SUBSCRIBE popup loads on first use.
export default function AboutLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NewsStyle />
      <div className="mx-auto w-[min(80rem,calc(100%-5rem))] mobile:w-auto mobile:px-5">
        <NewsHeader />
        {children}
        <NewsFooter />
      </div>
      <SubscribePopup />
    </>
  );
}
