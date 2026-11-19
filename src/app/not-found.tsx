import type { Metadata } from 'next';
import NewsStyle from '@/app/news/_components/NewsStyle';
import SubscribePopup from '@/components/layout/footer/SubscribePopup';
import SiteHeader from '@/components/site/SiteHeader';
import { NOT_FOUND_TITLE } from '@/lib/seo/metadata';

export const metadata: Metadata = {
  // His site's title for an unknown address (question 5i); og:title stays the site default, as on his site.
  title: { absolute: NOT_FOUND_TITLE },
  robots: { index: false, follow: true },
};

/**
 * Shown for unknown addresses, /about and podcast or news items that do not exist (HTTP 404).
 *
 * The message is exactly what the owner's site draws for a wrong address (the framework's default page): "404" and
 * "This page could not be found.", nothing more; his rule is no text he has not shown. In the site's type, under the
 * site's header as the content pages have it (his logo and SUBSCRIBE), which is the visitor's way home: his default
 * page had none, a defect fixed here.
 */
export default function NotFound() {
  return (
    <>
      <NewsStyle />
      <div className="mx-auto w-[80rem] mobile:w-auto mobile:px-5">
        <SiteHeader variant="solid" currentId={null} className="relative py-5" />
        <main
          id="content-start"
          tabIndex={-1}
          className="flex min-h-[60svh] items-center justify-center text-black outline-none"
        >
          <div className="flex items-center">
            <h1 className="mr-5 border-r border-black/30 py-2.5 pr-6 font-display text-2xl/[49px] font-medium">404</h1>
            <h2 className="font-text text-sm/[49px] font-normal">This page could not be found.</h2>
          </div>
        </main>
      </div>
      <SubscribePopup />
    </>
  );
}
