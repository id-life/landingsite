/** @type {import('postcss-load-config').Config} */
const config = {
  // Tailwind first, then rem lengths become the layout unit --u (RWD-01, scripts/postcss-layout-unit.js). Next.js
  // takes plugins by name only, so the local plugin is named by its path.
  plugins: {
    tailwindcss: {},
    './scripts/postcss-layout-unit.js': {},
  },
};

export default config;
