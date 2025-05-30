'use client';

import { useMediaQuery } from 'react-responsive';
import { useIsMounted } from './useIsMounted';

export const useIsMobile = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isMounted = useIsMounted();
  return isMounted ? isMobile : null;
};
