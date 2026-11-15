import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import { color, accentTint, typeRoles, grid } from './src/styles/tokens';
import { DURATION, EASE_POINTS, motionCssVariables } from './src/motion/tokens';

// Motion tokens (MOT-08, src/motion/tokens.ts): --dur-* / --ease-* on :root, and duration-<token> / ease-<token>
// utilities that read them, so CSS transitions play the same durations and curves as GSAP and motion.
const motionDurations = Object.fromEntries([...Object.keys(DURATION), 'page'].map((n) => [n, `var(--dur-${n})`]));
const motionEases = Object.fromEntries([...Object.keys(EASE_POINTS), 'linear'].map((n) => [`token-${n}`, `var(--ease-${n})`]));

// Colours, font roles, type roles and the grid come from src/styles/tokens.ts (VIS-02). theme.colors REPLACES
// Tailwind's palette (theme.extend would keep it: red-600 would silently fall back to #dc2626), so a colour that is
// not a token has no utility. The markdown palette (md-*) is CSS-only.
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './src/constants/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      inherit: 'inherit',
      ...color,
      'accent-tint': accentTint,
      // The section theme, tweened per section (tokens.ts themes).
      background: 'var(--background)',
      foreground: 'var(--foreground)',
    },
    extend: {
      screens: {
        mobile: { max: '768px' },
        notMobile: { min: '769px' },
        tablet: { min: '768px', max: '1540px' },
        middle: { min: '1200px' },
        desktop: { min: '1540px' },
        desktop2k: { min: '1920px' },
        ipad: { min: '500px', max: '768px' },
      },
      // Font roles (tokens.ts fontRoles): components name a role, never a typeface. FONT_PALETTE picks the faces.
      fontFamily: {
        display: ['var(--font-role-display)'],
        text: ['var(--font-role-text)'],
        brand: ['var(--font-role-brand)'],
        'brand-text': ['var(--font-role-brand-text)'],
        title: ['var(--font-role-title)'],
        button: ['var(--font-role-button)'],
        menu: ['var(--font-role-menu)'],
      },
      maxWidth: {
        measure: grid.measure,
        grid: grid.maxWidth,
      },
      spacing: {
        0.75: '0.1875rem',
        3.5: '0.875rem',
        4.5: '1.125rem',
        5.5: '1.375rem',
        6.5: '1.625rem',
        7.5: '1.875rem',
        8.5: '2.125rem',
        9.5: '2.375rem',
        10.5: '2.625rem',
        11: '2.75rem',
        12.5: '3.125rem',
        13: '3.25rem',
        14: '3.5rem',
        14.5: '3.625rem',
        15: '3.75rem',
        15.5: '3.875rem',
        16.5: '4.125rem',
        17: '4.25rem',
        18: '4.5rem',
        19.5: '4.875rem',
        21: '5.25rem',
        22.5: '5.625rem',
        25: '6.25rem',
        26.5: '6.625rem',
        30: '7.5rem',
        32.5: '8.125rem',
        33: '8.25rem',
        34: '8.5rem',
        37: '9.25rem',
        42: '10.5rem',
        45: '11.25rem',
        50: '12.5rem',
        51.5: '12.875rem',
        55: '13.75rem',
        66.5: '16.625rem',
        68: '17rem',
        70: '17.5rem',
        71: '17.75rem',
        75: '18.75rem',
        76: '19rem',
        87: '21.75rem',
        97: '24.25rem',
        100: '25rem',
        105: '26.25rem',
        112: '28rem',
        130: '32.5rem',
        136: '34rem',
        205: '51.25rem',
      },
      lineHeight: {
        3.5: '0.875rem',
        4.5: '1.125rem',
        5.5: '1.375rem',
        7.5: '1.875rem',
        12: '3rem',
      },
      keyframes: {
        scale: {
          '50%': { transform: 'scale(1.1)' },
        },
        'pulse-10': {
          '50%': {
            opacity: '0.1',
          },
        },
        'move-right': {
          '50%': { transform: 'translateX(10px)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        scale: 'scale 4s linear infinite',
        'pulse-10': 'pulse-10 4s linear infinite',
        'move-right': 'move-right 3s linear infinite',
        'fade-in': 'fade-in 1s ease-in-out forwards',
      },
      transitionDuration: motionDurations,
      transitionTimingFunction: motionEases,
      fontSize: {
        ss: '0.625rem',
        // The nine type roles (tokens.ts typeRoles; guide: docs/design-tokens.md).
        ...Object.fromEntries(
          Object.keys(typeRoles).map((k) => [k, [`var(--type-${k})`, { lineHeight: `var(--type-${k}-lh)` }]]),
        ),
        // Reading sizes of the content pages (news, podcast), all derived from --read-body (globals.css): 16 px body
        // on phones, growing about 1.3x from 1440 to 2560 px. Captions stay at 12 px or more.
        read: ['var(--read-body)', { lineHeight: '1.7' }],
        'read-sm': ['calc(var(--read-body) * 0.875)', { lineHeight: '1.6' }],
        'read-xs': ['calc(var(--read-body) * 0.75)', { lineHeight: '1.5' }],
        'read-lg': ['calc(var(--read-body) * 1.25)', { lineHeight: '1.4' }],
      },
    },
  },
  // Tailwind's own .container (breakpoint max-widths) is replaced by the grid container below.
  corePlugins: { container: false },
  plugins: [
    // Motion tokens (MOT-08) on :root.
    plugin(({ addBase }) => addBase({ ':root': motionCssVariables() })),
    // The page grid (tokens.ts grid): .container = 1280 px max content width with fluid margins; .grid-12 = 12
    // columns with 24 px gutters. Both in px and vw, so they hold under the experience's viewport-scaled rem.
    plugin(({ addComponents }) => {
      addComponents({
        '.container': {
          width: '100%',
          maxWidth: `calc(var(--grid-max) + 2 * var(--grid-margin))`,
          marginInline: 'auto',
          paddingInline: 'var(--grid-margin)',
        },
        '.grid-12': {
          display: 'grid',
          gridTemplateColumns: 'repeat(var(--grid-columns), minmax(0, 1fr))',
          columnGap: 'var(--grid-gutter)',
        },
      });
    }),
  ],
};
export default config;
