import { useEffect, useState, RefObject } from 'react';

const DEFAULT_SLOT_HEIGHT = 206; // 默认卡片高度146 + 间距20 + 40

export function useMobileItemsPerPage(
  containerRef: RefObject<HTMLDivElement>,
  isMobile: boolean,
  slotHeight = DEFAULT_SLOT_HEIGHT,
) {
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    if (!isMobile || !containerRef.current) return;

    const calculateItems = () => {
      const containerHeight = containerRef.current?.clientHeight || 0;
      const items = Math.floor(containerHeight / slotHeight);
      setItemsPerPage(Math.max(2, Math.min(6, items)));
    };

    const observer = new ResizeObserver(calculateItems);
    observer.observe(containerRef.current);
    calculateItems();

    return () => observer.disconnect();
  }, [isMobile, slotHeight, containerRef]);

  return itemsPerPage;
}
