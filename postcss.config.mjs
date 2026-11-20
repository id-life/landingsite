/** @type {import('postcss-load-config').Config} */
const config = {
  // Tailwind first, then rem lengths become the layout unit --u (RWD-01, scripts/postcss-layout-unit.js). Next.js
  // takes plugins by name only, so the local plugin is named by its path.
  plugins: {
    tailwindcss: {},
    './scripts/postcss-layout-unit.js': {},
    // Every hand-written :hover rule inside @media (hover: hover) (CON-15 A7, scripts/postcss-hover-media.js).
    './scripts/postcss-hover-media.js': {},
  },
};

export default config;
