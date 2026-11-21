import type { MetadataRoute } from 'next';
import { ORG_DESCRIPTION } from '@/constants/entity';
import { color } from '@/styles/tokens';

/**
 * The web app manifest (ENG-17; question 9, "from your existing logo", no new wording): the name his site's title
 * carries, his description, and his symbol (public/icon.svg is public/svgs/logo.svg unchanged; the PNGs are made from
 * it by scripts/build-icons.mjs as public/apple-icon.png was). It opens as the site does in a browser tab
 * (display: browser), so adding it to a home screen changes nothing about how the site behaves.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Immortal Dragons 不朽真龙',
    short_name: 'Immortal Dragons',
    description: ORG_DESCRIPTION,
    start_url: '/',
    scope: '/',
    display: 'browser',
    background_color: color['tone-100'],
    theme_color: color['tone-100'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
    ],
  };
}
