'use client';

import React from 'react';

export default function DMStyle() {
  return (
    <style jsx global>{`
      html,
      body {
        height: 100%;
      }

      :root {
        font-size: 16px;
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

      .base-background2 {
        opacity: 0;
      }

      .disease-management-content {
        opacity: 1;
      }
    `}</style>
  );
}
