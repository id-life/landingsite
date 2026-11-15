'use client';

import dynamic from 'next/dynamic';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { isSubscribeShowAtom } from '@/atoms/footer';

// The popups carry the form library, Floating UI and their animation code (GSAP on desktop, motion on phones);
// content pages load them only when the visitor first asks for the popup.
const Footer = dynamic(() => import('@/components/layout/footer/Footer'), { ssr: false });
const MobileFooter = dynamic(() => import('@/components/layout/footer/MobileFooter'), { ssr: false });

/**
 * The SUBSCRIBE popup of the content pages (news, podcast). It opens only from a SUBSCRIBE button
 * (subscribePopupAtom); the first open loads the phone or desktop popup, which then stays mounted so it can
 * animate closed and open again. Footer and MobileFooter own the dialog, its animation and the funnel events.
 */
export default function SubscribePopup() {
  const open = useAtomValue(isSubscribeShowAtom);
  // null until the first open; then which popup to load, by the layout breakpoint (Tailwind `mobile`, <= 768 px).
  const [variant, setVariant] = useState<'phone' | 'desktop' | null>(null);

  useEffect(() => {
    if (open && !variant) setVariant(window.matchMedia('(max-width: 768px)').matches ? 'phone' : 'desktop');
  }, [open, variant]);

  if (!variant) return null;
  return variant === 'phone' ? <MobileFooter /> : <Footer />;
}
