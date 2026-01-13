import { useCallback, useState, RefObject } from 'react';
import { useContainerResize } from './useContainerResize';

const DEFAULT_SLOT_HEIGHT = 206; // 默认卡片高度146 + 间距20 + 40

export function useMobileItemsPerPage(
  containerRef: RefObject<HTMLDivElement>,
  isMobile: boolean,
  slotHeight = DEFAULT_SLOT_HEIGHT,
  isVisible = true,
) {
  const [itemsPerPage, setItemsPerPage] = useState(3);

  const calculateItems = useCallback(
    (entry: ResizeObserverEntry) => {
      if (!isMobile) return;

      const containerHeight = entry.contentRect.height;
      const items = Math.floor(containerHeight / slotHeight);
      setItemsPerPage(Math.max(2, Math.min(6, items)));
    },
    [isMobile, slotHeight],
  );

  useContainerResize(containerRef, calculateItems, undefined, [isVisible]);

  return itemsPerPage;
}
