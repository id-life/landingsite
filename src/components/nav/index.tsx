'use client';

import { useRef } from 'react';
import { clsx } from 'clsx';
import { currentPageAtom } from '@/atoms';
import { useAtom, useAtomValue } from 'jotai';
import { smootherAtom } from '@/atoms/scroll';
import { NAV_LIST, NavItem } from '@/components/nav/nav';

export default function Nav() {
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom);
  const navRef = useRef<HTMLDivElement>(null);
  const smoother = useAtomValue(smootherAtom);

  const handleNavClick = (item: NavItem) => {
    if (!navRef.current) return;
    const offsetHeight = navRef.current.clientHeight;
    const scrollTop = item === NAV_LIST[0] ? offsetHeight + 10 : offsetHeight;
    smoother?.scrollTo(`#${item.id}`, true, `top ${scrollTop}`);
    setCurrentPage(item);
  };

  return (
    <div ref={navRef} id="nav" className="gap-15 fixed left-0 top-0 z-50 flex w-full items-center bg-white p-12">
      <img className="h-12" src="/svg/logo-title.svg" alt="logo" loading="lazy" />
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
