import { NAV_LIST } from '@/components/nav/nav';
import { useEffect, useMemo, useState } from 'react';

export function usePageScrollHeight() {
  const [scrollPageId, setScrollPageId] = useState<string>(NAV_LIST[0].id);

  useEffect(() => {
    const offsetTop: [string, number][] = NAV_LIST.map((item) => {
      const elementById = document.getElementById(item.id);
      return [item.id, elementById?.offsetTop ?? -200];
    });
    console.log('offsetTop: ', offsetTop);
    window.addEventListener('scroll', () => {
      const offsetTop: [string, number][] = NAV_LIST.map((item) => {
        const elementById = document.getElementById(item.id);
        return [item.id, elementById?.offsetTop ?? -200];
      });
      offsetTop.forEach(([key, value]) => {
        if (window.scrollY + 100 >= value) {
          setScrollPageId(key);
        }
      });
    });
    window.addEventListener('beforeunload', () => window.scrollTo({ top: 0 }));
  }, []);

  return useMemo(() => ({ scrollPageId }), [scrollPageId]);
}
