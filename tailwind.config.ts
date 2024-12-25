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
        'source-han-sans-cn': ['var(--font-source-han-sans-cn)'],
      },
      animation: {
        'ripple-1': 'ripple-1 2s infinite 0.5s',
        'ripple-2': 'ripple-2 2s infinite 1s',
        'ripple-3': 'ripple-3 2s infinite 1.5s',
      },
      keyframes: {
        'ripple-1': {
          '0%': {
            transform: 'scale(1, 1)',
            opacity: '1',
          },
          '100%': {
            transform: 'scale(1.5, 1.85)',
            opacity: '0',
          },
        },
        'ripple-2': {
          '0%': {
            transform: 'scale(1, 1)',
            opacity: '1',
          },
          '100%': {
            transform: 'scale(1.5, 1.85)',
            opacity: '0',
          },
        },
        'ripple-3': {
          '0%': {
            transform: 'scale(1, 1)',
            opacity: '1',
          },
          '100%': {
            transform: 'scale(1.5, 1.85)',
            opacity: '0',
          },
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
        19.5: '4.875rem',
        22.5: '5.625rem',
        32.5: '8.125rem',
        34: '8.5rem',
        37: '9.25rem',
        42: '10.5rem',
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
        yellow: {
          800: '#FFD12C',
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
