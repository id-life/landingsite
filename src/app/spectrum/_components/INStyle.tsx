'use client';

import '@/styles/components/character-relation.css';

export default function INStyle() {
  return (
    <style jsx global>{`
      html,
      body {
        height: 100%;
      }

      .base-background2 {
        opacity: 1 !important;
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
    `}</style>
  );
}
