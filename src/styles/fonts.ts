import localFont from 'next/font/local';
import { Poppins } from 'next/font/google';
import { Oxanium } from 'next/font/google';

const xirod = localFont({
  src: './fonts/Xirod.ttf',
  variable: '--font-xirod',
  weight: '100 900',
});

const migrena = localFont({
  src: './fonts/Migrena_Grotesque.ttf',
  variable: '--font-migrena',
  weight: '100 900',
});

const ttLakes = localFont({
  src: './fonts/TTLakes-DemiBold.otf',
  variable: '--font-tt',
  weight: '100 900',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

const oxanium = Oxanium({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-oxanium',
});

const sourceHanSansCN = localFont({
  src: [
    {
      path: './fonts/SourceHanSansCN-Bold-min.ttf',
      weight: '700',
    },
    {
      path: './fonts/SourceHanSansCN-Medium-min.ttf',
      weight: '500',
    },
  ],
  variable: '--font-source-han-sans-cn',
});

export { xirod, poppins, ttLakes, migrena, oxanium, sourceHanSansCN };
