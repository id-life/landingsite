import { mobileCurrentPageAtom } from '@/atoms';
import { NAV_LIST } from '@/components/nav/nav';
import { VALUE_PAGE_INDEX } from '@/constants/config';
import { cn } from '@/utils';
import { useAtomValue } from 'jotai';

export default function MobileValue() {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  return (
    <div
      id={NAV_LIST[VALUE_PAGE_INDEX].id}
      className={cn('relative h-[800svh] overflow-auto', {
        hidden: currentPage.id !== NAV_LIST[VALUE_PAGE_INDEX].id,
      })}
    />
  );
}
