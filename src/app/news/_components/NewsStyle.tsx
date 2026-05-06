'use client';

import React from 'react';

import 'swiper/css';
import '@/styles/webgl.css';
import '@/styles/loading.css';

export default function NewsStyle() {
  return (
    <style jsx global>{`
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
    `}</style>
  );
}
