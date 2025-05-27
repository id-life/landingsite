import { innerPageNavigateToAtom, mobileCurrentPageAtom, mobileCurrentPageIndexAtom } from '@/atoms';
import { useAtom } from 'jotai';

export function useMobileCurrentPage() {
  const [currentPage, setCurrentPage] = useAtom(mobileCurrentPageAtom);
  const [currentPageIndex, setCurrentPageIndex] = useAtom(mobileCurrentPageIndexAtom);
  const [valuePageNavigateTo, setValuePageNavigateTo] = useAtom(innerPageNavigateToAtom);
  return {
    currentPage,
    setCurrentPage,
    currentPageIndex,
    setCurrentPageIndex,
    valuePageNavigateTo,
    setValuePageNavigateTo,
  };
}
