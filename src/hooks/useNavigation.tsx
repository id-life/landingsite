import { navigateToAtom, currentPageAtom } from '@/atoms';
import { useAtom, useSetAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import { NAV_LIST, NavItem } from '@/components/nav/nav';
import { usePageScrollHeight } from './usePageScrollHeight';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

// import { useSwitchPage } from '@/hooks/useSwitchPage';

export function useNavigation() {
  const setCurrentPage = useSetAtom(currentPageAtom);
  const { scrollPageId } = usePageScrollHeight();
  const [navigateTo, setNavigateTo] = useAtom(navigateToAtom);
  // const { onChangeCurrentPage } = useSwitchPage();

  const handleNavClick = useCallback(
    (item: NavItem) => {
      const smoother = ScrollSmoother.get();
      if (item.id === NAV_LIST[0].id) {
        smoother?.scrollTo(0, true);
      } else {
        smoother?.scrollTo(`#${item.id}`, true);
      }
      const index = NAV_LIST.findIndex((i) => i.id === item.id);
      // onChangeCurrentPage(index > 2 ? 2 : index);
      setCurrentPage(item);
    },
    [setCurrentPage],
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
  }, [handleNavClick, navigateTo, setCurrentPage, setNavigateTo]);
  return { handleNavClick };
}
