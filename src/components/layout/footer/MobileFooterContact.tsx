'use client';

import { isMobileFooterContactShowAtom } from '@/atoms/footer';
import { FloatingPortal } from '@floating-ui/react';
import { useAtom } from 'jotai';
import { AnimatePresence, motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';
import FooterContactContent from './FooterContactContent';

export default function MobileFooterContact() {
  const subscribeRef = useRef<HTMLDivElement>(null);
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
            ref={subscribeRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="page-footer fixed inset-x-0 bottom-0 z-[102] border-2 border-white bg-white/20 p-5 backdrop-blur-xl"
          >
            <FooterContactContent />
          </motion.div>
        ) : isConnectPage ? (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={() => setIsSubscribeShow(true)}
            className="group fixed bottom-6.5 left-5 z-[90] flex h-9 cursor-pointer items-center justify-center gap-1 py-0.5 pl-3 pr-1.5 font-poppins text-base/5 font-semibold hover:opacity-80"
          >
            {/* Border SVG with top-left cut corner */}
            <svg className="absolute inset-0" viewBox="0 0 100 36" fill="none" preserveAspectRatio="none">
              <path d="M10 1H99V35H1V10L10 1Z" stroke="#C11111" strokeWidth="2" />
            </svg>
            <span className="relative text-sm/5 text-red-600">Connect</span>
            {/* Right chevron arrow */}
            <svg className="relative -mt-px size-4" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="#C11111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </FloatingPortal>
  );
}
