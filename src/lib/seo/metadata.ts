import type { Metadata } from 'next';

/**
 * Titles, descriptions and Open Graph tags for every route (SEO-06). One rule set:
 * - the <title> is "<topic> | <brand>" in the page's language: "Immortal Dragons" after an English topic,
 *   "不朽真龙" after a Chinese one; a topic that already names the brand stands alone;
 * - og:title is the topic alone (the brand is og:site_name);
 * - no keywords meta (search engines ignore it; one 9-word list was pasted into eleven files);
 * - descriptions that run long are cut at a sentence end (snippet), never rewritten.
 * Wording beyond these mechanical rules is the owner's: drafts are not shipped from here.
 */

export const BRAND = { en: 'Immortal Dragons', zh: '不朽真龙' } as const;
export type Locale = keyof typeof BRAND;

export const DEFAULT_OG_IMAGE = 'https://resources.id.life/id-life-cover-2.webp';

const CJK = /[㐀-鿿豈-﫿]/;

/** The language a piece of text is written in, by script: Chinese when it contains any CJK character. */
export const localeOf = (text: string): Locale => (CJK.test(text) ? 'zh' : 'en');

/**
 * The language a description is cut by: Chinese when CJK characters are at least a third of it. A bilingual show
 * description ("解码长寿革命。... Decoding the longevity revolution. ...") is cut by the Latin limit, so its English
 * half is not cut off mid-word at 80 characters.
 */
const descriptionLocale = (text: string): Locale =>
  (text.match(new RegExp(CJK.source, 'g'))?.length ?? 0) * 3 >= [...text].length ? 'zh' : 'en';

/** "<topic> | <brand in the topic's language>", or the topic alone when it already names that brand. */
export function brandTitle(topic: string, locale: Locale = localeOf(topic)): string {
  return topic.includes(BRAND[locale]) ? topic : `${topic} | ${BRAND[locale]}`;
}

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
  description: string;
  /** Defaults to the language of the title. */
  locale?: Locale;
  image?: string;
  type?: 'website' | 'article';
};

export function buildMetadata({ path, title, description, locale, image, type = 'website' }: MetadataInput): Metadata {
  const lang = locale ?? localeOf(title);
  const text = snippet(description);
  return {
    title: { absolute: brandTitle(title, lang) },
    description: text,
    alternates: { canonical: path },
    openGraph: {
      title,
      description: text,
      siteName: BRAND.en,
      url: path,
      type,
      images: [{ url: image || DEFAULT_OG_IMAGE }],
    },
  };
}
