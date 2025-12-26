import { mobileCurrentPageAtom } from '@/atoms';
import { NAV_LIST } from '@/components/nav/nav';
import { CONNECT_PAGE_INDEX } from '@/constants/config';
import { cn } from '@/utils';
import { useAtomValue } from 'jotai';

export default function MobileConnect() {
  const currentPage = useAtomValue(mobileCurrentPageAtom);

  return (
    <div
      id={NAV_LIST[CONNECT_PAGE_INDEX].id}
      className={cn('relative h-svh overflow-hidden', {
        hidden: currentPage.id !== NAV_LIST[CONNECT_PAGE_INDEX].id,
      })}
    />
  );
}
