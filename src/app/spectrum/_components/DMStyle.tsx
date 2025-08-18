'use client';

import React from 'react';

export default function DMStyle() {
  return (
    <style jsx global>{`
      :root {
        font-size: 16px;
      }

      body {
        overscroll-behavior: none;
        background: #000000;
      }

      .base-background2 {
        opacity: 0;
      }
    `}</style>
  );
}
