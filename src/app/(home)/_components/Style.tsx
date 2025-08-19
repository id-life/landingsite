'use client';

import React from 'react';

import 'swiper/css';
import '@/styles/webgl.css';
import '@/styles/loading.css';

export default function Style() {
  return (
    <style jsx global>{`
      :root {
        font-size: 16px;
      }

      body {
        overscroll-behavior: none;
        background: var(--background);
      }

      @media screen and (min-width: 1px) {
        :root {
          font-size: 0.8333vw;
        }
      }

      @media screen and (max-width: 768px) {
        :root {
          font-size: 16px;
        }

        body {
          height: 100%;
          overflow: hidden;
        }
      }
    `}</style>
  );
}
