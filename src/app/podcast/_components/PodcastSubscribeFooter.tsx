'use client';

import ContentPageContact from '@/components/layout/footer/ContentPageContact';
import Footer from '@/components/layout/footer/Footer';

/**
 * The SUBSCRIBE popup on the podcast pages. It opens only from a SUBSCRIBE button: it used to open by itself once
 * the reader was 60% down the page. Footer owns the dialog, its animation and the funnel events. The podcast pages
 * have no page footer, so this one also carries the contact row and the About link (CON-01).
 */
export default function PodcastSubscribeFooter() {
  return (
    <>
      <ContentPageContact />
      <Footer />
    </>
  );
}
