import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        xirod: ['var(--font-xirod)'],
        poppins: ['var(--font-poppins)'],
        migrena: ['var(--font-migrena)'],
      },
      animation: {
        'scroll-down': 'scroll-down 1.5s ease-in infinite',
      },
      keyframes: {
        'scroll-down': {
          '0%, 100%': { transform: 'translate3d(-50%, -6px, 0)' },
          '50%': { transform: 'translate3d(-50%, 6px, 0)' },
        },
      },
      spacing: {
        15: '3.75rem',
      },
    },
  },
  plugins: [],
};
export default config;
