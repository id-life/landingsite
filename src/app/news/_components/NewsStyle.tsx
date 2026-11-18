import React from 'react';
import { desktopTreeAnd, PHONE_LAYOUT_UNIT, PHONE_TREE_QUERY } from '@/styles/device-classes';

import 'swiper/css';
import '@/styles/webgl.css';
import '@/styles/loading.css';

// Page-level rules of the news pages. A plain <style> rendered on the server; it was a styled-jsx client
// component. It unmounts with the news layout, so the rules never reach the experience. The root stays 16 px; the
// layout unit carries the original's 1200-1320 px scaling (below).
const NEWS_CSS = `
  :root {
    font-size: 16px;
  }

  /* Two versions (RWD-02) and the owner's rule on font sizes: on the laptop deck every text is the original's size
     at the same window, and the original scaled these pages down from 1320 px to the deck's edge. The layout unit
     follows it there (text and layout in rem scale together, as they did). */
  @media ${desktopTreeAnd('(max-width: 1320.98px)')} {
    :root {
      --u: calc(1.25vw - 0.5px);
    }
  }

  body {
    overscroll-behavior: none;
    background: var(--background);
  }

  /* The phone deck: the phone layout in the deck's unit (16 px up to 599 px, then growing with the window). */
  @media ${PHONE_TREE_QUERY} {
    :root {
      font-size: 16px;
      --u: ${PHONE_LAYOUT_UNIT};
    }

    /* The article body: github-markdown-css sets it in px (16 px, its headings in em of that), so it stayed at its
       phone size on an upright tablet while the page around it grew. In the deck's unit it grows with the rest; on
       the laptop deck it keeps the original's fixed 16 px. */
    .markdown-body {
      font-size: calc(var(--t) * 1);
    }

    body {
      /* Allow scrolling on mobile for news page */
      overflow: auto;
    }
  }
`;

export default function NewsStyle() {
  // No characters React would escape (<, >, &, quotes) may appear in NEWS_CSS.
  return <style>{NEWS_CSS}</style>;
}
