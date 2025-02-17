import { mobileCurrentPageAtom } from '@/atoms';
import { NAV_LIST } from '@/components/nav/nav';
import { useIsMobile } from '@/hooks/useIsMobile';
import { cn } from '@/utils';
import { useAtomValue } from 'jotai';

export default function Value() {
  const mobileCurrentPage = useAtomValue(mobileCurrentPageAtom);
  const isMobile = useIsMobile();
  return (
    <div
      id={NAV_LIST[2].id}
      className={cn(isMobile ? 'page-container-mobile' : 'page-container value', {
        hidden: isMobile && mobileCurrentPage?.id !== NAV_LIST[2].id,
      })}
    />
  );
}
