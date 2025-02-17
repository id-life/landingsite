import {
  currentPageAtom,
  currentPageIndexAtom,
  mobileCurrentPageAtom,
  mobileCurrentPageIndexAtom,
  mobilePortfolioPageIndexAtom,
  mobilePortfolioPageNavigateToAtom,
  mobileValuePageNavigateToAtom,
} from '@/atoms';
import { useAtom } from 'jotai';
import { useIsMobile } from './useIsMobile';

export function useCurrentPage() {
  const isMobile = useIsMobile();
  const [currentPage, setCurrentPage] = useAtom(isMobile ? mobileCurrentPageAtom : currentPageAtom);
  const [currentPageIndex, setCurrentPageIndex] = useAtom(isMobile ? mobileCurrentPageIndexAtom : currentPageIndexAtom);
  const [valuePageNavigateTo, setValuePageNavigateTo] = useAtom(mobileValuePageNavigateToAtom);
  const [mobilePortfolioPageIndex, setMobilePortfolioPageIndex] = useAtom(mobilePortfolioPageIndexAtom);
  const [mobilePortfolioPageNavigateTo, setMobilePortfolioPageNavigateTo] = useAtom(mobilePortfolioPageNavigateToAtom);
  return {
    currentPage,
    setCurrentPage,
    currentPageIndex,
    setCurrentPageIndex,
    valuePageNavigateTo,
    setValuePageNavigateTo,
    mobilePortfolioPageIndex,
    setMobilePortfolioPageIndex,
    mobilePortfolioPageNavigateTo,
    setMobilePortfolioPageNavigateTo,
  };
}
