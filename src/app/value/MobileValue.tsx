import { mobileCurrentPageAtom } from '@/atoms';
import { NAV_LIST } from '@/components/nav/nav';
import { cn } from '@/utils';
import { useAtomValue } from 'jotai';

export default function MobileValue() {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  return (
    <div
      id={NAV_LIST[2].id}
      className={cn('relative h-[800svh] overflow-auto', {
        hidden: currentPage.id !== NAV_LIST[2].id,
      })}
    />
  );
}
