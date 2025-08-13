'use client';

import SubscribeBorderSVG from '@/../public/svgs/subscribe-border.svg?component';
import { currentPageAtom } from '@/atoms';
import { isSubscribeShowAtom } from '@/atoms/footer';
import { globalLoadedAtom } from '@/atoms/geo';
import Logo from '@/components/nav/Logo';
import { useNavigation } from '@/hooks/useNavigation';
import { useThrottle } from '@/hooks/useThrottle';
import { clsx } from 'clsx';
import gsap from 'gsap';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useRef } from 'react';
import { NAV_LIST } from './nav';
import { useEvent } from 'react-use';
import { useGA } from '@/hooks/useGA';
import { GA_EVENT_LABELS, GA_EVENT_NAMES } from '@/constants/ga';
import { isCharacterRelationShowAtom } from '@/atoms/character-relation';
import { cn } from '@/utils';
import { showDiseaseManagementContentAtom } from '@/atoms/spectrum';
import { useGSAP } from '@gsap/react';
import { useSubscribeAction } from '@/hooks/useSubscribeAction';

export default function PCNav() {
  const currentPage = useAtomValue(currentPageAtom);
  const { handleNavClick } = useNavigation();
  const { onSubscribeClick, handleScroll, handleClickOutside } = useSubscribeAction();
  const globalLoaded = useAtomValue(globalLoadedAtom);
  const isCharacterRelationShow = useAtomValue(isCharacterRelationShowAtom);
  const isShowingDiseaseManagement = useAtomValue(showDiseaseManagementContentAtom);

  useEffect(() => {
    window.addEventListener('beforeunload', () => window.scrollTo({ top: 0 }));
  }, []);

  useEvent('scroll', handleScroll);

  useGSAP(() => {
    gsap.to('.main-nav-links', {
      opacity: isShowingDiseaseManagement ? 0 : 1,
      pointerEvents: isShowingDiseaseManagement ? 'none' : 'auto',
      duration: 0.5,
    });
  }, [isShowingDiseaseManagement]);

  useEvent('mousedown', handleClickOutside);

  if (!globalLoaded) return null;
  return (
    <div
      id="nav"
      className={cn(
        'fixed left-0 top-0 z-50 flex w-full items-center gap-15 p-10 text-foreground opacity-0 mobile:gap-0 mobile:p-5',
        isCharacterRelationShow && 'character-relation-css-vars-inject z-[51] pb-4',
      )}
    >
      <Logo />
      <div
        className={cn(
          'main-nav-links flex gap-8 text-sm font-semibold mobile:hidden',
          (isCharacterRelationShow || isShowingDiseaseManagement) && 'hidden',
        )}
      >
        {NAV_LIST.map((item) => (
          <div
            onClick={() => handleNavClick(item)}
            className={clsx(
              'nav-item bilingual-font relative cursor-pointer whitespace-nowrap text-center font-bold uppercase',
              currentPage.id === item.id && 'nav-active',
            )}
            key={item.id}
          >
            {item.title}
          </div>
        ))}
      </div>
      <div id="subscribe-btn" className="flex h-12 flex-1 justify-end mobile:h-auto mobile:items-center">
        <div
          onClick={onSubscribeClick}
          className="group relative flex h-12 w-51.5 cursor-pointer items-center justify-center text-sm font-semibold uppercase duration-300 hover:stroke-red-600 hover:text-red-600 mobile:h-8 mobile:w-24 mobile:text-xs/5"
        >
          <SubscribeBorderSVG className="absolute left-0 top-0 size-full stroke-foreground duration-300 group-hover:stroke-red-600" />
          Subscribe
        </div>
      </div>
    </div>
  );
}
