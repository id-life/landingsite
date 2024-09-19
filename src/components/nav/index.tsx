'use client';

import { useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';
import Dialog from '@/components/dialog';
import { currentPageAtom } from '@/atoms';
import { useAtom, useAtomValue } from 'jotai';
import { smootherAtom } from '@/atoms/scroll';
import { NAV_LIST, NavItem } from '@/components/nav/nav';
import { usePageScrollHeight } from '@/hooks/usePageScrollHeight';
import SubscribeDialog from '@/components/dialog/SubscribeDialog';
import SubscribeBorderSVG from '@/../public/svgs/subscribe-border.svg?component';

export default function Nav() {
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom);
  const navRef = useRef<HTMLDivElement>(null);
  const smoother = useAtomValue(smootherAtom);
  const { scrollHeight, scrollPageId } = usePageScrollHeight();
  const [open, setOpen] = useState<boolean>(false);

  const handleNavClick = (item: NavItem) => {
    smoother?.scrollTo(scrollHeight?.get(item.id) ?? 0, true);
    setCurrentPage(item);
  };

  useEffect(() => {
    const item = NAV_LIST.find((item) => item.id === scrollPageId);
    if (!item) return;
    setCurrentPage(item);
  }, [scrollPageId, setCurrentPage]);

  return (
    <div ref={navRef} id="nav" className="fixed left-0 top-0 z-50 flex w-full items-center gap-15 bg-background p-11">
      <img className="h-12" src="/svgs/logo-title.svg" alt="logo" loading="lazy" />
      <div className="flex gap-8 text-sm font-semibold">
        {NAV_LIST.map((item) => (
          <div
            onClick={() => handleNavClick(item)}
            className={clsx('nav-item relative cursor-pointer uppercase', currentPage.id === item.id && 'nav-active')}
            key={item.id}
          >
            {item.title}
          </div>
        ))}
      </div>
      <div className="flex h-12 flex-1 justify-end">
        <div
          onClick={() => setOpen(!open)}
          className="group relative flex h-12 w-51.5 cursor-pointer items-center justify-center text-sm font-semibold uppercase duration-300 hover:stroke-red-600 hover:text-red-600"
        >
          <SubscribeBorderSVG className="absolute left-0 top-0 size-full duration-300 group-hover:stroke-red-600" />
          Subscribe
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen} render={() => <SubscribeDialog handleSubmit={() => setOpen(false)} />} />
    </div>
  );
}
