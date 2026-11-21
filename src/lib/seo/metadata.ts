import type { Metadata } from 'next';
import { HOME_HEADING } from '@/constants/home-heading';

/**
 * Titles, descriptions and Open Graph tags for every route (SEO-06). One rule set:
 * - the <title> is the owner's own tab title for the page (question 5i, 2026-11-18: his titles exactly, e.g.
 *   "Portfolio 投资", "News 新闻 | Immortal Dragons"); pages his site titles by rule get "<topic> | Immortal Dragons";
 * - og:title is the same text, as on his site;
 * - the keywords meta as the owner's site serves it: a page's own list, or the site's (src/app/layout.tsx);
 * - the description is served as given, whole: the owner's own descriptions, word for word (2026-11-18).
 * Wording beyond these mechanical rules is the owner's: drafts are not shipped from here.
 */

const BRAND = { en: 'Immortal Dragons', zh: '不朽真龙' } as const;

/** The site's keywords meta, as the owner's site serves it on every page without a list of its own. */
export const SITE_KEYWORDS = [
  'Longevity',
  'anti-aging',
  'life extension',
  'investment fund',
  'innovation',
  'biotech',
  'pharmaceutical',
  'healthcare',
  'Immortal Dragons',
];

/** The title his site gives an address that does not exist (Next's default 404 title). */
export const NOT_FOUND_TITLE = '404: This page could not be found.';

/**
 * The link-preview image (question 9, 2026-11-18): the owner's own cover, the one his site declares
 * (https://resources.id.life/id-life-cover-2.webp, 800x400 WebP), as a 1200x630 JPEG served from the site: enlarged
 * 1.5x (Lanczos) to 1200x600 and extended by its own top and bottom rows to 1200x630, nothing cropped or drawn.
 * LinkedIn needs at least 1200x627 and Apple's Messages 900 px wide, which the 800x400 original is not; some
 * previewers do not take WebP.
 */
export const DEFAULT_OG_IMAGE = {
  url: '/og-cover.jpg',
  width: 1200,
  height: 630,
  type: 'image/jpeg',
  // og:image:alt (SEO-07; the lead's ruling of 2026-11-21): the words the page already shows, his h1 on /.
  alt: HOME_HEADING,
};

/** A link-preview image; `alt` is words its page already shows (the lead's ruling of 2026-11-21). */
export type OgImage = { url: string; width?: number; height?: number; type?: string; alt?: string };

const CJK = /[㐀-鿿豈-﫿]/;

export type MetadataInput = {
  /** Canonical path, e.g. '/portfolio'. */
  path: string;
  /** The topic, in the page's language, without the brand. */
  title: string;
  /**
   * The browser tab title exactly as the owner's site has it (owner, question 5i, 2026-11-18). Default: "<topic> |
   * Immortal Dragons", his site's rule for an episode. og:title (and so twitter:title, which Next derives from it)
   * carries the same text, as on his site.
   */
  tabTitle?: string;
  description: string;
  /** The page's own keywords, as the owner's site serves them; absent, the site's list applies. */
  keywords?: string[];
  /**
   * The page's own image: its address, or its address with the size and type read from the file; null for a page his
   * site gives none (no image is declared).
   */
  image?: string | OgImage | null;
  type?: 'website' | 'article';
};

export function buildMetadata({
  path,
  title,
  tabTitle,
  description,
  keywords,
  image,
  type = 'website',
}: MetadataInput): Metadata {
  const text = description;
  const full = tabTitle ?? `${title} | ${BRAND.en}`;
  return {
    title: { absolute: full },
    description: text,
    ...(keywords !== undefined && { keywords }),
    alternates: { canonical: path },
    openGraph: {
      title: full,
      description: text,
      siteName: BRAND.en,
      url: path,
      type,
      images: image === null ? [] : [typeof image === 'string' ? { url: image } : (image ?? DEFAULT_OG_IMAGE)],
    },
  };
}
