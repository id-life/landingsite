'use client';

import { useEffect } from 'react';
import { track } from './track';

const MARKS = [50, 90];

/**
 * read_depth for content pages that scroll as documents (news articles, podcast episodes): one event at 50 % and one
 * at 90 % of the page, after the visitor scrolls (DATA-05: GA4's own Scrolls event is turned off in the stream, it
 * fired at load on the experience). Renders nothing.
 */
export default function ReadDepth({ itemId }: { itemId: string }) {
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const root = document.documentElement;
      const max = root.scrollHeight;
      if (!max) return;
      const percent = ((window.scrollY + window.innerHeight) / max) * 100;
      for (const mark of MARKS) {
        if (percent >= mark) track('read_depth', { percent: mark, item_id: itemId }, { once: `read_depth:${itemId}:${mark}` });
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [itemId]);
  return null;
}
