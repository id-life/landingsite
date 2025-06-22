import { useCallback, useEffect, useRef } from 'react';

/**
 * custom hook used to control browser zoom
 * @param disableZoom - whether to disable browser zoom
 */
export const useBrowserZoom = (disableZoom: boolean) => {
  // Save the original viewport content for correct restoration
  const originalViewportRef = useRef<string | null>(null);

  const setViewportZoom = useCallback((disable: boolean) => {
    if (typeof document === 'undefined') return; // SSR safety check

    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) return;

    // Save the original content on first call
    if (originalViewportRef.current === null) {
      originalViewportRef.current = viewport.getAttribute('content') || '';
    }

    const content = viewport.getAttribute('content') || '';

    if (disable) {
      // Disable zoom
      if (!content.includes('user-scalable=no')) {
        const newContent = content.includes('user-scalable=')
          ? content.replace(/user-scalable=[^,]*/, 'user-scalable=no')
          : content + ', user-scalable=no';
        viewport.setAttribute('content', newContent);
      }
    } else {
      // Restore zoom - use original content or remove user-scalable=no
      if (originalViewportRef.current) {
        viewport.setAttribute('content', originalViewportRef.current);
      } else {
        const newContent = content.replace(/,?\s*user-scalable=no/, '');
        viewport.setAttribute('content', newContent);
      }
    }
  }, []);

  useEffect(() => {
    setViewportZoom(disableZoom);

    return () => {
      setViewportZoom(false);
    };
  }, [disableZoom, setViewportZoom]);
};
