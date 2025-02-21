import {
  mobileCurrentPageAtom,
  mobileCurrentPageIndexAtom,
  mobilePortfolioPageIndexAtom,
  mobilePortfolioPageNavigateToAtom,
  valuePageNavigateToAtom,
} from '@/atoms';
import { useAtom } from 'jotai';

export function useMobileCurrentPage() {
  const [currentPage, setCurrentPage] = useAtom(mobileCurrentPageAtom);
  const [currentPageIndex, setCurrentPageIndex] = useAtom(mobileCurrentPageIndexAtom);
  const [valuePageNavigateTo, setValuePageNavigateTo] = useAtom(valuePageNavigateToAtom);
  return {
    currentPage,
    setCurrentPage,
    currentPageIndex,
    setCurrentPageIndex,
    valuePageNavigateTo,
    setValuePageNavigateTo,
  };
}
