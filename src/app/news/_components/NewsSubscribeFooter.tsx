'use client';

import Footer from '@/components/layout/footer/Footer';

/**
 * The SUBSCRIBE popup on the news pages. It opens only from a SUBSCRIBE button: it used to open by itself once
 * the reader was 60% down the page. Footer owns the dialog, its animation and the funnel events.
 */
export default function NewsSubscribeFooter() {
  return <Footer />;
}
