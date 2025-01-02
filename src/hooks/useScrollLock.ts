import { useCallback, useRef } from 'react';

type ScrollDirection = 'up' | 'down' | 'both';

export const useScrollLock = () => {
  const cleanupRef = useRef<(() => void) | null>(null);

  const lockScroll = useCallback((direction: ScrollDirection = 'up') => {
    // 如果已经有事件监听器，先清除
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
    console.log('lockScroll ', direction);
    const handleWheel = (e: WheelEvent) => {
      if ((direction === 'up' && e.deltaY < 0) || (direction === 'down' && e.deltaY > 0) || direction === 'both') {
        e.preventDefault();
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchCurrentY = e.touches[0].clientY;
      const isScrollingUp = touchCurrentY > touchStartY;
      const isScrollingDown = touchCurrentY < touchStartY;

      if ((direction === 'up' && isScrollingUp) || (direction === 'down' && isScrollingDown) || direction === 'both') {
        e.preventDefault();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    // 保存清理函数
    cleanupRef.current = () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const unlockScroll = useCallback(() => {
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
    console.log('unlockScroll');
  }, []);

  return {
    lockScroll,
    unlockScroll,
  };
};
