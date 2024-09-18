'use client';

import { useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import { currentPageAtom } from '@/atoms';
import { useAtom, useAtomValue } from 'jotai';
import { smootherAtom } from '@/atoms/scroll';
import { NAV_LIST, NavItem } from '@/components/nav/nav';
import { usePageScrollHeight } from '@/hooks/usePageScrollHeight';

export default function Nav() {
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom);
  const navRef = useRef<HTMLDivElement>(null);
  const smoother = useAtomValue(smootherAtom);
  const { scrollHeight, scrollPageId } = usePageScrollHeight();

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
    <div ref={navRef} id="nav" className="fixed left-0 top-0 z-50 flex w-full items-center gap-15 bg-background p-12">
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
    </div>
  );
}
