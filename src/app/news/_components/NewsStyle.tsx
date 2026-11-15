import React from 'react';

import 'swiper/css';
import '@/styles/webgl.css';
import '@/styles/loading.css';

// Page-level rules of the news pages. A plain <style> rendered on the server; it was a styled-jsx client
// component. It unmounts with the news layout, so the rules never reach the experience. The root stays 16 px at
// every width: a 769-1320 px rule used to shrink it with the viewport, down to 9.75 px (text at 7-11 px) on an
// 820 px iPad; the layout adapts to those widths instead (layout.tsx, NewsFooter).
const NEWS_CSS = `
  :root {
    font-size: 16px;
  }

  body {
    overscroll-behavior: none;
    background: var(--background);
  }

  @media screen and (max-width: 768px) {
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
