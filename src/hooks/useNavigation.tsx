import { navigateToAtom, currentPageAtom } from '@/atoms';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import { NAV_LIST, NavItem } from '@/components/nav/nav';
import { smootherAtom } from '@/atoms/scroll';
import { usePageScrollHeight } from './usePageScrollHeight';

export function useNavigation() {
  const setCurrentPage = useSetAtom(currentPageAtom);
  const smoother = useAtomValue(smootherAtom);
  const { scrollPageId } = usePageScrollHeight();
  const [navigateTo, setNavigateTo] = useAtom(navigateToAtom);

  const handleNavClick = useCallback(
    (item: NavItem) => {
      const clientHeight = document.querySelector('#nav')?.clientHeight;
      if (item.id === NAV_LIST[0].id) {
        smoother?.scrollTo(0, true);
      } else {
        smoother?.scrollTo(`#${item.id}`, true, `top ${clientHeight}px`);
      }
      setCurrentPage(item);
    },
    [smoother, setCurrentPage],
  );

  useEffect(() => {
    const item = NAV_LIST.find((item) => item.id === scrollPageId);
    if (!item) return;
    setCurrentPage(item);
  }, [scrollPageId, setCurrentPage]);

  useEffect(() => {
    if (navigateTo) {
      handleNavClick(navigateTo);
      setCurrentPage(navigateTo);
      setNavigateTo(null);
    }
  }, [handleNavClick, navigateTo, setCurrentPage, setNavigateTo, smoother]);
  return { handleNavClick };
}
