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
        6.5: '1.625rem',
        14: '3.5rem',
        15: '3.75rem',
        17: '4.25rem',
        18: '4.5rem',
        22.5: '5.625rem',
        37: '9.25rem',
        205: '51.25rem',
      },
      colors: {
        red: {
          600: '#C11111',
        },
      },
      lineHeight: {
        12: '3rem',
      },
    },
  },
  plugins: [],
};
export default config;
