'use client';

import { useCallback, useEffect } from 'react';
import { FloatingFocusManager, FloatingOverlay, FloatingPortal, useFloating, useTransitionStyles } from '@floating-ui/react';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

type VideoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  title: string;
};

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function VideoModal({ isOpen, onClose, videoId, title }: VideoModalProps) {
  const { refs, context } = useFloating({ open: isOpen, onOpenChange: (open) => !open && onClose() });

  const { isMounted, styles } = useTransitionStyles(context, {
    initial: { opacity: 0 },
    open: { opacity: 1 },
    close: { opacity: 0 },
  });

  // Handle escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  // Pause ScrollSmoother when modal is open
  useEffect(() => {
    const smoother = ScrollSmoother.get();
    if (smoother) {
      smoother.paused(isOpen);
    }
  }, [isOpen]);

  if (!isMounted) return null;

  return (
    <FloatingPortal>
      <FloatingOverlay
        className="z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
        style={styles}
        onClick={onClose}
        lockScroll
      >
        <FloatingFocusManager context={context}>
          {/* Close button - fixed at screen top right */}
          <button
            onClick={onClose}
            className="fixed right-6 top-6 z-[101] flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white"
            aria-label="Close video"
          >
            <CloseIcon />
          </button>

          <div ref={refs.setFloating} className="relative" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-video w-[80vw] max-w-[960px] overflow-hidden rounded-lg bg-black shadow-2xl">
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  );
}
