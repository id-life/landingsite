import localFont from 'next/font/local';
import { Poppins } from 'next/font/google';
import { Oxanium } from 'next/font/google';

// Preloads: only Oxanium (one variable WOFF2 file: the nav and the display lines of the first
// screen). next/font preloads every file of a family it is asked to preload, on every route, at the
// highest priority, in competition with the JavaScript and the hero; the other faces load when text
// using them is laid out (display: swap, metric-adjusted fallbacks).
// Xirod, Migrena and TT Lakes keep their files and declared weights until the owner decides whether
// they stay (Oxanium + Poppins palette); they paint three words, three button labels and the phone
// menu, and /news and /podcast use none of them, so they are no longer preloaded.
const xirod = localFont({
  src: './fonts/Xirod.ttf',
  variable: '--font-xirod',
  weight: '100 900',
  preload: false,
});

const migrena = localFont({
  src: './fonts/Migrena_Grotesque.ttf',
  variable: '--font-migrena',
  weight: '100 900',
  preload: false,
});

const ttLakes = localFont({
  src: './fonts/TTLakes-DemiBold.otf',
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

// Subsets of the characters the site sets in this face (font-min/index.md), as WOFF2
// (scripts/build-fonts.mjs). Any other Chinese character falls back to the system CJK face.
const sourceHanSansCN = localFont({
  src: [
    {
      path: './fonts/SourceHanSansCN-Bold-min.woff2',
      weight: '700',
    },
    {
      path: './fonts/SourceHanSansCN-Medium-min.woff2',
      weight: '500',
    },
  ],
  variable: '--font-source-han-sans-cn',
  preload: false,
  fallback: ['PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans SC', 'Noto Sans CJK SC', 'sans-serif'],
});

export { xirod, poppins, ttLakes, migrena, oxanium, sourceHanSansCN };
