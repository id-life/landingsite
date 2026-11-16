import React from 'react';
import { PHONE_TREE_QUERY } from '@/styles/device-classes';

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

  /* The owner's rule on font sizes: from 1200 px every text has the original's size, and the original scaled these
     pages down between 769 and 1320 px. The layout unit follows it from 1200 to 1320 px (text and layout in rem
     scale together, as they did); below 1200 px the tablet tier keeps the original's 1440 size (16 px). */
  @media (min-width: 1200px) and (max-width: 1320.98px) {
    :root {
      --u: calc(1.25vw - 0.5px);
    }
  }

  body {
    overscroll-behavior: none;
    background: var(--background);
  }

  @media ${PHONE_TREE_QUERY} {
    :root {
      font-size: 16px;
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
