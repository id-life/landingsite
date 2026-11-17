import { innerPageIndexAtom, innerPageTotalAtom, navigateToAtom } from '@/atoms';
import { NAV, NavItem } from '@/components/nav/nav';
import { goToSection, type SectionSource } from '@/motion/sectionController';
import { useAtom, useSetAtom } from 'jotai';
import { useCallback, useEffect } from 'react';

/**
 * Desktop section changes from the nav, the arrows (navigateToAtom) and in-page links go through the section
 * controller (MOT-01): it retargets a running transition, lands on the section's rest pose and writes the URL.
 * There is no throttle: a second click while moving retargets instead of being swallowed.
 * `enabled` is false on the other deck's mount of Home (one Home for both decks): the hook then does nothing.
 */
export function useNavigation(enabled = true) {
  const [navigateTo, setNavigateTo] = useAtom(navigateToAtom);
  const setInnerPageIndex = useSetAtom(innerPageIndexAtom);
  const setInnerPageTotal = useSetAtom(innerPageTotalAtom);

  const handleNavClick = useCallback(
    (item: NavItem, source: SectionSource = 'nav') => {
      goToSection(item.id, source);
      if (item.id === NAV.connect_page.id) setInnerPageIndex(0);
      else setInnerPageTotal(0);
    },
    [setInnerPageIndex, setInnerPageTotal],
  );

  useEffect(() => {
    if (!enabled || !navigateTo) return;
    handleNavClick(navigateTo, 'arrow');
    setNavigateTo(null);
  }, [enabled, handleNavClick, navigateTo, setNavigateTo]);

  return { handleNavClick };
}
