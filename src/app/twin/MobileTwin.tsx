import { mobileCurrentPageAtom } from '@/atoms';
import { NAV_LIST } from '@/components/nav/nav';
import { cn } from '@/utils';
import { useAtomValue } from 'jotai';

export default function MobileTwin() {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  return (
    <div
      id={NAV_LIST[3].id}
      className={cn('page-container-mobile', {
        hidden: currentPage.id !== NAV_LIST[3].id,
      })}
    >
      Twin
    </div>
  );
}
