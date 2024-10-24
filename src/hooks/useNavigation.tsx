import { useCallback, useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { NAV_LIST, NavItem } from '@/components/nav/nav';
import { navigateToAtom, currentPageAtom } from '@/atoms';

export function useNavigation() {
  const setCurrentPage = useSetAtom(currentPageAtom);
  const [navigateTo, setNavigateTo] = useAtom(navigateToAtom);

  const handleNavClick = useCallback(
    (item: NavItem) => {
      const smoother = ScrollSmoother.get();
      if (!smoother) return;
      if (item.id === NAV_LIST[0].id) {
        smoother?.scrollTo(`#${item.id}`, true);
      }
      if (item.id === NAV_LIST[1].id) {
        smoother?.scrollTo(`#${item.id}`, false, 'top 10px');
        requestAnimationFrame(() => smoother?.scrollTo('.page2-contact', true, `${window.innerHeight}px`));
      }
      if (item.id === NAV_LIST[2].id) {
        smoother?.scrollTo(`#${item.id}`, true);
      }
      setCurrentPage(item);
    },
    [setCurrentPage],
  );

  useEffect(() => {
    if (navigateTo) {
      handleNavClick(navigateTo);
      setCurrentPage(navigateTo);
      setNavigateTo(null);
    }
  }, [handleNavClick, navigateTo, setCurrentPage, setNavigateTo]);
  return { handleNavClick };
}
