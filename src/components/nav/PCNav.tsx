'use client';

import SubscribeBorderSVG from '@/../public/svgs/subscribe-border.svg?component';
import { currentPageAtom } from '@/atoms';
import Logo from '@/components/nav/Logo';
import { useNavigation } from '@/hooks/useNavigation';
import { useSubscribeAction } from '@/hooks/useSubscribeAction';
import { cn } from '@/utils';
import { clsx } from 'clsx';
import { useAtomValue } from 'jotai';
import Link from 'next/link';
import { useEffect } from 'react';
import { useEvent } from 'react-use';
import { MessageType } from '../event-bus/messageType';
import { useEventBus } from '../event-bus/useEventBus';
import { NAV_LIST } from './nav';

export default function PCNav() {
  const currentPage = useAtomValue(currentPageAtom);
  const { handleNavClick } = useNavigation();
  const { onSubscribeClick, handleScroll, handleClickOutside, handleClose } = useSubscribeAction();

  useEventBus(MessageType.CLOSE_SUBSCRIBE, () => {
    handleClose();
  });

  useEffect(() => {
    window.addEventListener('beforeunload', () => window.scrollTo({ top: 0 }));
  }, []);

  useEffect(() => {
    const navElement = document.getElementById('nav');
    if (!navElement) return;

    let _isSmootherScrolling = window.isSmootherScrolling || false;

    Object.defineProperty(window, 'isSmootherScrolling', {
      get() {
        return _isSmootherScrolling;
      },
      set(newValue) {
        _isSmootherScrolling = newValue;
        if (newValue) {
          navElement.style.opacity = '0.5';
          navElement.style.pointerEvents = 'none';
        } else {
          navElement.style.opacity = '1';
          navElement.style.pointerEvents = 'auto';
        }
      },
      configurable: true,
    });
  }, []);

  useEvent('scroll', handleScroll);

  useEvent('click', handleClickOutside);

  return (
    <div
      id="nav"
      className={cn(
        'fixed left-0 top-0 z-50 flex w-full items-center gap-15 p-10 text-foreground opacity-0 transition-opacity duration-300 mobile:hidden',
      )}
    >
      <Logo />
      <div className={cn('main-nav-links flex gap-8 text-sm font-semibold')}>
        {NAV_LIST.map((item) => (
          <Link
            href={item.href}
            onClick={(event) => {
              event.preventDefault();
              handleNavClick(item);
            }}
            className={clsx(
              'nav-item bilingual-font relative cursor-pointer whitespace-nowrap text-center font-bold uppercase',
              currentPage.id === item.id && 'nav-active',
            )}
            key={item.id}
          >
            {item.title}
          </Link>
        ))}
      </div>
      <div id="subscribe-btn" className="flex h-12 flex-1 justify-end mobile:h-auto mobile:items-center">
        <div
          onClick={onSubscribeClick}
          className="group relative flex h-10 w-33 cursor-pointer items-center justify-center text-sm font-semibold uppercase duration-300 hover:stroke-red-600 hover:text-red-600 mobile:h-8 mobile:w-24 mobile:text-xs/5"
        >
          <SubscribeBorderSVG className="absolute left-0 top-0 size-full stroke-foreground duration-300 group-hover:stroke-red-600" />
          Subscribe
        </div>
      </div>
    </div>
  );
}
