import { innerPageIndexAtom, mobileCurrentPageAtom } from '@/atoms';
import { NAV_LIST } from '@/components/nav/nav';
import { VALUE_PAGE_INDEX } from '@/constants/config';
import { GA_EVENT_NAMES } from '@/constants/ga';
import { useGA } from '@/hooks/useGA';
import { cn } from '@/utils';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';

export default function MobileValue() {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
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
    <div
      id={NAV_LIST[VALUE_PAGE_INDEX].id}
      className={cn('relative h-[800svh] overflow-auto', {
        hidden: currentPage.id !== NAV_LIST[VALUE_PAGE_INDEX].id,
      })}
    />
  );
}
