import React from 'react';

import 'swiper/css';
import '@/styles/webgl.css';
import '@/styles/loading.css';

// Page-level rules of the news pages. A plain <style> rendered on the server; it was a styled-jsx client
// component. It unmounts with the news layout, so the rules never reach the experience.
const NEWS_CSS = `
  :root {
    font-size: 16px;
  }

  @media screen and (min-width: 769px) and (max-width: 1320px) {
    :root {
      font-size: clamp(9.125px, calc(1.25vw - 0.5px), 16px);
    }
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
