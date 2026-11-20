import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import NewsFooter from './_components/NewsFooter';
import SiteFooter from '@/components/site/SiteFooter';
import SiteHeader from '@/components/site/SiteHeader';
import NewsStyle from './_components/NewsStyle';
import SubscribePopup from '@/components/layout/footer/SubscribePopup';

// Non-production test hook: ?force-error=route (src/components/common/ForcedError.tsx). A production build drops
// this branch and its import while compiling, so no byte of the hook ships (the build's chunks are checked for it).
const ForcedError =
  process.env.NEXT_PUBLIC_DEPLOY_ENV === 'production' ? null : dynamic(() => import('@/components/common/ForcedError'));

// A server component: the pages render on the server and only the header, the footer form, the cards and the
// popup hydrate. It was a client layout (useIsMobile), which made the whole news tree client code.
export default function NewsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NewsStyle />
      {/* The original's 80rem column. Below 1321 px its rem follows the window (NewsStyle), so it is the window less
          20 px each side there, and 1280 px above. */}
      <div className="mx-auto w-[80rem] mobile:w-auto mobile:px-5">
        <SiteHeader variant="solid" currentId="news" className="relative py-5" />
        {ForcedError && <ForcedError where="route" />}
        {children}
        <SiteFooter>
          <NewsFooter />
        </SiteFooter>
      </div>
      <SubscribePopup openOnArrival />
    </>
  );
}
