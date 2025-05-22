'use client';

import { currentPageAtom, innerPageIndexAtom } from '@/atoms';
import { NAV_LIST } from '@/components/nav/nav';
import { VALUE_PAGE_INDEX } from '@/constants/config';
import { GA_EVENT_NAMES } from '@/constants/ga';
import { useGA } from '@/hooks/useGA';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';

export default function Value() {
  const currentPage = useAtomValue(currentPageAtom);
  const innerPageIndex = useAtomValue(innerPageIndexAtom);

  const { trackEvent } = useGA();

  useEffect(() => {
    if (currentPage.id !== NAV_LIST[VALUE_PAGE_INDEX].id) return;

    trackEvent({
      name: GA_EVENT_NAMES.VALUE_VIEW,
      label: innerPageIndex.toString(),
    });
  }, [innerPageIndex, currentPage]);

  return (
    <div id={NAV_LIST[4].id} className="page-container value">
      <div id="value-page1" className="-z-10 h-screen w-screen" />
      <div className="value-gap h-25" />
      <div id="value-page2" className="-z-10 h-screen w-screen" />
      <div className="value-gap h-25" />
      <div id="value-page3" className="-z-10 h-screen w-screen" />
      <div className="value-gap h-25" />
      <div id="value-page4" className="-z-10 h-screen w-screen" />
      <div className="value-gap h-25" />
      <div id="value-page5" className="-z-10 h-screen w-screen" />
      <div className="value-gap h-25" />
    </div>
  );
}
