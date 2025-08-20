'use client';

export default function AboutStyle() {
  return (
    <style jsx global>{`
      html,
      body {
        height: 100vh;
      }

      :root {
        font-size: 16px;
      }

      .about-header,
      .about-page {
        opacity: 1;
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
