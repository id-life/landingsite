'use client';

import { useCallback, useEffect, useRef } from 'react';
import { track } from '@/lib/analytics/track';
import { FloatingFocusManager, FloatingOverlay, FloatingPortal, useFloating, useTransitionStyles } from '@floating-ui/react';
import { pauseSmoother } from '@/utils/smoother';

type VideoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  title: string;
  /** Where the video was opened from (analytics). */
  placement?: string;
};

const YT_ORIGIN = 'https://www.youtube-nocookie.com';
const PROGRESS_MARKS = [25, 50, 75, 100];

/**
 * video_progress without loading YouTube's IFrame API script: an embed with enablejsapi=1 posts its state to the
 * parent once the parent says it is listening (the protocol the API script itself uses). Each mark is sent once.
 */
function useVideoProgress(isOpen: boolean, videoId: string, frame: React.RefObject<HTMLIFrameElement | null>) {
  useEffect(() => {
    if (!isOpen) return;
    const sent = new Set<number>();
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== YT_ORIGIN || event.source !== frame.current?.contentWindow) return;
      let data: { event?: string; info?: { currentTime?: number; duration?: number; playerState?: number } };
      try {
        data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      } catch {
        return;
      }
      const info = data?.info;
      if (data?.event !== 'infoDelivery' || !info) return;
      const { currentTime, duration, playerState } = info;
      const percent = playerState === 0 ? 100 : duration && currentTime ? (currentTime / duration) * 100 : 0;
      for (const mark of PROGRESS_MARKS) {
        if (percent >= mark && !sent.has(mark)) {
          sent.add(mark);
          track('video_progress', { video_id: videoId, percent: mark });
        }
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [isOpen, videoId, frame]);
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function VideoModal({ isOpen, onClose, videoId, title, placement = 'insights' }: VideoModalProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  useVideoProgress(isOpen, videoId, frameRef);
  useEffect(() => {
    if (isOpen) track('video_open', { video_id: videoId, placement });
  }, [isOpen, videoId, placement]);

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
    pauseSmoother(isOpen);
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
          <>
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
                  ref={frameRef}
                  className="absolute inset-0 h-full w-full"
                  // Privacy-enhanced mode (no YouTube cookies until play) with the JS API for video_progress.
                  src={`${YT_ORIGIN}/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1&origin=${encodeURIComponent(typeof window === 'undefined' ? '' : window.location.origin)}`}
                  onLoad={(event) =>
                    event.currentTarget.contentWindow?.postMessage(
                      JSON.stringify({ event: 'listening', id: videoId, channel: 'widget' }),
                      YT_ORIGIN,
                    )
                  }
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  );
}
