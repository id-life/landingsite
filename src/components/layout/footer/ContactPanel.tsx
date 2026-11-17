'use client';

import { isMobileFooterContactShowAtom } from '@/atoms/footer';
import { FloatingPortal } from '@floating-ui/react';
import { useAtom } from 'jotai';
import { AnimatePresence, motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';
import FooterContactContent from './FooterContactContent';
import { DURATION, EASE } from '@/motion/tokens';

export default function ContactPanel() {
  const subscribeRef = useRef<HTMLDivElement | null>(null);
  const [isSubscribeShow, setIsSubscribeShow] = useAtom(isMobileFooterContactShowAtom);
  const pathname = usePathname();
  const isConnectPage = pathname === '/connect';

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (subscribeRef.current && !subscribeRef.current.contains(event.target as Node)) {
        setIsSubscribeShow(false);
      }
    },
    [setIsSubscribeShow],
  );

  // Publish the open panel's height so the Connect text box above it ends where the panel starts
  // (--connect-panel-h, read by MobileConnectSinglePage). A callback ref: AnimatePresence mounts the panel
  // after the previous child's exit, so it is not there yet when isSubscribeShow turns true.
  const panelObserverRef = useRef<ResizeObserver | null>(null);
  const panelRef = useCallback((el: HTMLDivElement | null) => {
    subscribeRef.current = el;
    panelObserverRef.current?.disconnect();
    panelObserverRef.current = null;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      document.documentElement.style.setProperty('--connect-panel-h', `${el.offsetHeight}px`);
    });
    observer.observe(el);
    panelObserverRef.current = observer;
  }, []);

  useEffect(() => {
    if (isSubscribeShow) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside, isSubscribeShow]);

  return (
    <FloatingPortal>
      <AnimatePresence mode="wait">
        {isSubscribeShow ? (
          <motion.div
            key="expanded"
            // On a phone in landscape the panel is taller than the window: it stops at the header (whose height the
            // header publishes) and scrolls, instead of running under it.
            ref={panelRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: DURATION.fast, ease: EASE.out }}
            className="page-footer fixed inset-x-0 bottom-0 z-[102] border-2 border-white bg-white/20 p-5 backdrop-blur-xl shortScreen:max-h-[calc(100svh_-_var(--site-header-h,4.5rem))] shortScreen:overflow-y-auto"
          >
            <FooterContactContent />
          </motion.div>
        ) : isConnectPage ? (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: DURATION.fast, ease: EASE.out }}
            onClick={() => setIsSubscribeShow(true)}
            className="group fixed bottom-6.5 left-5 z-[90] flex h-9 cursor-pointer items-center justify-center gap-1 py-0.5 pl-3 pr-1.5 font-text text-base/5 font-semibold tap-area hover:opacity-80"
          >
            {/* Border SVG with top-left cut corner */}
            <svg className="absolute inset-0" viewBox="0 0 100 36" fill="none" preserveAspectRatio="none">
              <path d="M10 1H99V35H1V10L10 1Z" stroke="var(--color-accent)" strokeWidth="2" />
            </svg>
            <span className="relative text-sm/5 text-accent">Connect</span>
            {/* Right chevron arrow */}
            <svg className="relative -mt-px size-4" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 4L10 8L6 12"
                stroke="var(--color-accent)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </FloatingPortal>
  );
}
