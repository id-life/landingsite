import type { Metadata } from 'next';

/**
 * Titles, descriptions and Open Graph tags for every route (SEO-06). One rule set:
 * - the <title> is the owner's own tab title for the page (question 5i, 2026-11-18: his titles exactly, e.g.
 *   "Portfolio 投资", "News 新闻 | Immortal Dragons"); pages his site titles by rule get "<topic> | Immortal Dragons";
 * - og:title is the same text, as on his site;
 * - no keywords meta (search engines ignore it; one 9-word list was pasted into eleven files);
 * - descriptions that run long are cut at a sentence end (snippet), never rewritten.
 * Wording beyond these mechanical rules is the owner's: drafts are not shipped from here.
 */

const BRAND = { en: 'Immortal Dragons', zh: '不朽真龙' } as const;
type Locale = keyof typeof BRAND;

/** The title his site gives an address that does not exist (Next's default 404 title). */
export const NOT_FOUND_TITLE = '404: This page could not be found.';

/**
 * The link-preview image (question 9, 2026-11-18): the site's own logo (public/svgs/logo-en.svg) on the site's
 * background colour, nothing else, at 1200x630 PNG (LinkedIn's minimum is 1200x627; WhatsApp wants 300 px or wider
 * and under 600 KB; Apple's Messages 900 px or wider). It replaces the 800x400 WebP cover as the default.
 */
const DEFAULT_OG_IMAGE = { url: '/og-image.png', width: 1200, height: 630, type: 'image/png' };

const CJK = /[㐀-鿿豈-﫿]/;

/**
 * The language a description is cut by: Chinese when CJK characters are at least a third of it. A bilingual show
 * description ("解码长寿革命。... Decoding the longevity revolution. ...") is cut by the Latin limit, so its English
 * half is not cut off mid-word at 80 characters.
 */
const descriptionLocale = (text: string): Locale =>
  (text.match(new RegExp(CJK.source, 'g'))?.length ?? 0) * 3 >= [...text].length ? 'zh' : 'en';

// Longest description kept whole, and the shortest cut accepted, per language: 110-160 Latin or 70-80 CJK
// characters (the plan's bounds; Google shows about 155 Latin characters).
const LIMITS = { en: { max: 160, min: 110 }, zh: { max: 80, min: 70 } } as const;
const ZH_FLOOR = 35;
const SENTENCE_END = /[.!?。！？](?=\s|$)|[。！？]/g;
const CLAUSE_END = /[,;:，；：、]/g;

function lastMatchEnd(text: string, re: RegExp, from: number): number {
  let end = -1;
  const scan = new RegExp(re.source, 'g');
  let m: RegExpExecArray | null;
  while ((m = scan.exec(text)) !== null) if (m.index + m[0].length >= from) end = m.index + m[0].length;
  return end;
}

/**
 * A description of at most about 160 Latin or 80 CJK characters: the text itself when it fits, else cut at the
 * last sentence end that keeps enough of it, else at the last clause end or word with an ellipsis.
 */
export function snippet(text: string, locale: Locale = descriptionLocale(text)): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  const { max, min } = LIMITS[locale];
  if (clean.length <= max) return clean;
  const head = clean.slice(0, max);
  const sentence = lastMatchEnd(head, SENTENCE_END, min);
  if (sentence > 0) return head.slice(0, sentence).trim();
  const clause = lastMatchEnd(head.slice(0, max - 1), CLAUSE_END, min);
  if (clause > 0) return `${head.slice(0, clause - 1).trim()}…`;
  // Chinese has no spaces to cut at, so an earlier clause end (down to the 35-character floor) beats a cut inside a word.
  const early = locale === 'zh' ? lastMatchEnd(head.slice(0, max - 1), CLAUSE_END, ZH_FLOOR) : -1;
  if (early > 0) return `${head.slice(0, early - 1).trim()}…`;
  const space = locale === 'en' ? head.lastIndexOf(' ', max - 1) : -1;
  return `${head.slice(0, space > min ? space : max - 1).trim()}…`;
}

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
  image?: string;
  type?: 'website' | 'article';
};

export function buildMetadata({ path, title, tabTitle, description, image, type = 'website' }: MetadataInput): Metadata {
  const text = snippet(description);
  const full = tabTitle ?? `${title} | ${BRAND.en}`;
  return {
    title: { absolute: full },
    description: text,
    alternates: { canonical: path },
    openGraph: {
      title: full,
      description: text,
      siteName: BRAND.en,
      url: path,
      type,
      images: [image ? { url: image } : DEFAULT_OG_IMAGE],
    },
  };
}
