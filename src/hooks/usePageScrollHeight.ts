import { NAV_LIST } from '@/components/nav/nav';
import { useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'react-use';

export function usePageScrollHeight() {
  const [scrollY, setScrollY] = useState<number>(0);
  const [scrollHeight, setScrollHeight] = useState<Map<string, number>>();
  const [scrollPageId, setScrollPageId] = useState<string>(NAV_LIST[0].id);

  useEffect(() => {
    const nav = document.querySelector('#nav');
    if (!nav) return;
    const map = new Map();

    NAV_LIST.forEach((item) => {
      const elementById = document.getElementById(item.id);
      if (!elementById) return 0;
      const height = elementById.getBoundingClientRect().y - nav.clientHeight;
      map.set(item.id, height);
    });
    setScrollHeight(map);
    window.addEventListener('scroll', () => setScrollY(window.scrollY));
    window.addEventListener('beforeunload', () => window.scrollTo({ top: 0 }));
  }, []);

  useDebounce(
    () => {
      if (!scrollHeight) return;
      scrollHeight.forEach((value, key) => scrollY + 10 >= value && setScrollPageId(key));
    },
    100,
    [scrollY],
  );

  return useMemo(() => ({ scrollHeight, scrollPageId }), [scrollHeight, scrollPageId]);
}
