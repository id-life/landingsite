import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        mobile: { max: '768px' },
        tablet: { min: '768px', max: '1540px' },
      },
      fontFamily: {
        xirod: ['var(--font-xirod)'],
        poppins: ['var(--font-poppins)'],
        migrena: ['var(--font-migrena)'],
        tt: ['var(--font-tt)'],
        oxanium: ['var(--font-oxanium)'],
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
        3.5: '0.875rem',
        4.5: '1.125rem',
        6.5: '1.625rem',
        7.5: '1.875rem',
        10.5: '2.625rem',
        14: '3.5rem',
        15: '3.75rem',
        15.5: '3.875rem',
        17: '4.25rem',
        18: '4.5rem',
        22.5: '5.625rem',
        32.5: '8.125rem',
        34: '8.5rem',
        37: '9.25rem',
        50: '12.5rem',
        51.5: '12.875rem',
        55: '13.75rem',
        66.5: '16.625rem',
        100: '23rem',
        105: '26.25rem',
        112: '28rem',
        205: '51.25rem',
      },
      colors: {
        gray: {
          200: '#D4D4D4',
          350: '#999999',
          400: '#9C979D',
          800: '#222222',
        },
        red: {
          500: '#BB1212',
          600: '#C11111',
        },
        green: {
          600: '#318135',
        },
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      lineHeight: {
        3.5: '0.875rem',
        4.5: '1.125rem',
        5.5: '1.375rem',
        7.5: '1.875rem',
        12: '3rem',
      },
    },
  },
  plugins: [],
};
export default config;
