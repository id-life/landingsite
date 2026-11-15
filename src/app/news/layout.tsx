import { ReactNode } from 'react';
import NewsFooter from './_components/NewsFooter';
import NewsHeader from './_components/NewsHeader';
import NewsStyle from './_components/NewsStyle';
import SubscribePopup from '@/components/layout/footer/SubscribePopup';

// A server component: the pages render on the server and only the header, the footer form, the cards and the
// popup hydrate. It was a client layout (useIsMobile), which made the whole news tree client code.
export default function NewsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NewsStyle />
      <div className="mx-auto w-[80rem] mobile:w-auto mobile:px-5">
        <NewsHeader />
        {children}
        <NewsFooter />
      </div>
      <SubscribePopup />
    </>
  );
}
