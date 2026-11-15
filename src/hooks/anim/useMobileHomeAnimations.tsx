import { mobileCurrentPageAtom } from '@/atoms';
import { BACKGROUND_THEME } from '@/constants/config';
import { useAtomValue } from 'jotai';
import { useEffect, useRef } from 'react';
import { useMobileThemeTransition } from '../useMobileThemeTransition';

export function useMobileHomeAnimateInit() {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const { transitionToTheme } = useMobileThemeTransition();
  // The first theme is set on mount, under the loader: no transition. An animated one would block
  // navigation for 0.5 s (mobileNavChange ignores requests while a theme transition runs) and drop a
  // deep link that the router applies as soon as a fast first load ends.
  const mountedRef = useRef(false);

  useEffect(() => {
    const options = { instant: !mountedRef.current };
    mountedRef.current = true;
    if (currentPage.id === 'portfolio_page') {
      transitionToTheme(BACKGROUND_THEME.BLACK_RED, options);
    } else if (currentPage.id === 'spectrum_page') {
      transitionToTheme(BACKGROUND_THEME.BLACK_RED_2, options);
    } else if (currentPage.id === 'engagement_page') {
      transitionToTheme(BACKGROUND_THEME.BLACK, options);
    } else {
      transitionToTheme(BACKGROUND_THEME.LIGHT, options);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);
}
