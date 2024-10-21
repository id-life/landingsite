import { navigateToAtom, currentPageAtom } from '@/atoms';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import { NAV_LIST, NavItem } from '@/components/nav/nav';
import { smootherAtom } from '@/atoms/scroll';
import { usePageScrollHeight } from './usePageScrollHeight';
// import { useSwitchPage } from '@/hooks/useSwitchPage';

export function useNavigation() {
  const setCurrentPage = useSetAtom(currentPageAtom);
  const smoother = useAtomValue(smootherAtom);
  const { scrollPageId } = usePageScrollHeight();
  const [navigateTo, setNavigateTo] = useAtom(navigateToAtom);
  // const { onChangeCurrentPage } = useSwitchPage();

  const handleNavClick = useCallback(
    (item: NavItem) => {
      if (item.id === NAV_LIST[0].id) {
        smoother?.scrollTo(0, true);
      } else {
        smoother?.scrollTo(`#${item.id}`, true);
      }
      const index = NAV_LIST.findIndex((i) => i.id === item.id);
      // onChangeCurrentPage(index > 2 ? 2 : index);
      setCurrentPage(item);
    },
    [setCurrentPage, smoother],
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
