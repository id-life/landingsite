import localFont from 'next/font/local';
import { Poppins } from 'next/font/google';

const xirod = localFont({
  src: './fonts/xirod.ttf',
  variable: '--font-xirod',
  weight: '100 900',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export { xirod, poppins };
