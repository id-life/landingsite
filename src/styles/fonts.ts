import localFont from 'next/font/local';
import { Poppins } from 'next/font/google';
import { Oxanium } from 'next/font/google';

// Preloads: only Oxanium (one variable WOFF2 file: the nav and the display lines of the first
// screen). next/font preloads every file of a family it is asked to preload, on every route, at the
// highest priority, in competition with the JavaScript and the hero; the other faces load when text
// using them is laid out (display: swap, metric-adjusted fallbacks).
// Xirod, Migrena and TT Lakes stay (the owner's decision of 2026-11-18). Each is served as WOFF2, a lossless
// conversion of the original TTF/OTF (every table but head.flags bit 11, which WOFF2 sets, decompiles identically),
// with the same declared weights, so the text they set renders exactly as before. They paint section titles, three
// button labels and the phone menu, and /news and /podcast use none of them, so they are not preloaded.
const xirod = localFont({
  src: './fonts/Xirod.woff2',
  variable: '--font-xirod',
  weight: '100 900',
  preload: false,
});

const migrena = localFont({
  src: './fonts/Migrena_Grotesque.woff2',
  variable: '--font-migrena',
  weight: '100 900',
  preload: false,
});

const ttLakes = localFont({
  src: './fonts/TTLakes-DemiBold.woff2',
  variable: '--font-tt',
  weight: '100 900',
  preload: false,
});

// Four weight files: not preloaded.
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  preload: false,
});

const oxanium = Oxanium({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-oxanium',
});

// The Chinese display face (VIS-07): Source Han Sans CN cut to the characters of the display strings
// (src/constants/display-strings.ts) by scripts/build-cjk-subset.mjs; test/cjk-display.test.mjs fails when a display
// character is missing. Only the brand font roles use it (tokens.ts fontRoles); all other Chinese is set in the system
// faces, so no run mixes the two. Not preloaded: 17 KB per weight, requested when a display string is laid out.
const sourceHanSansCN = localFont({
  src: [
    {
      path: './fonts/cjk-display-700.woff2',
      weight: '700',
    },
    {
      path: './fonts/cjk-display-500.woff2',
      weight: '500',
    },
  ],
  variable: '--font-source-han-sans-cn',
  preload: false,
  fallback: ['PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans SC', 'Noto Sans CJK SC', 'sans-serif'],
});

export { xirod, poppins, ttLakes, migrena, oxanium, sourceHanSansCN };
