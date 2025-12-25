'use client';

import Logo from '@/components/nav/Logo';
import { useRouter } from 'next/navigation';
import SubscribeBorderSVG from '@/../public/svgs/subscribe-border.svg?component';
import MenuCloseSVG from '@/../public/svgs/menu-close.svg?component';
import MenuOpenSVG from '@/components/svg/MenuOpenSVG';
import { isNewsNavOpenAtom } from '@/atoms/news';
import { useAtom, useSetAtom } from 'jotai';
import NewsNavDialog from './NewsNavDialog';
import { isSubscribeShowAtom, subscribeTypeAtom } from '@/atoms/footer';
import { GA_EVENT_LABELS, GA_EVENT_NAMES } from '@/constants/ga';
import { trackEvent } from '@/hooks/useGA';

export default function NewsHeader() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useAtom(isNewsNavOpenAtom);
  const setIsSubscribeShow = useSetAtom(isSubscribeShowAtom);
  const setSubscribeType = useSetAtom(subscribeTypeAtom);

  const handleSubscribeClick = () => {
    setIsSubscribeShow(true);
    setSubscribeType('footer');
    trackEvent({
      name: GA_EVENT_NAMES.SUBSCRIBE_SHOW,
      label: GA_EVENT_LABELS.SUBSCRIBE_SHOW.FOOTER,
    });
  };

  return (
    <div className="flex items-center justify-between py-5">
      <div onClick={() => router.replace('/')} className="cursor-pointer">
        <Logo />
      </div>
      <div className="flex items-center gap-5">
        <div
          onClick={handleSubscribeClick}
          className="group relative flex h-10 w-34 cursor-pointer items-center justify-center text-sm font-semibold uppercase duration-300 hover:stroke-red-600 hover:text-red-600 mobile:h-8 mobile:w-24 mobile:text-xs/5"
        >
          <SubscribeBorderSVG className="absolute left-0 top-0 size-full stroke-foreground duration-300 group-hover:stroke-red-600" />
          Subscribe
        </div>
        <div className="hidden mobile:block" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <MenuCloseSVG className="h-10" /> : <MenuOpenSVG className="h-10" />}
        </div>
      </div>
      <NewsNavDialog />
    </div>
  );
}
