/**
 * ENG-03 A3 (the lead's reading): the page language stays as the owner's site declares it (en); the parts that hold
 * Chinese text are marked lang="zh-CN" (the value the original itself writes on its Chinese parts), which is what a
 * screen reader needs to switch voice. A text counts as
 * Chinese when its CJK characters outweigh its Latin letters (a CJK character counts as three letters: one carries
 * about a word), the measure the suite uses for a page. Marking restyles nothing: the CJK styling rule in globals.css
 * applies to `.zh-run` elements only.
 */
const CJK = /[㐀-鿿豈-﫿]/g;
const LATIN = /[A-Za-z]/g;

export const isMostlyChinese = (text: string | null | undefined): boolean => {
  if (!text) return false;
  const cjk = text.match(CJK)?.length ?? 0;
  const latin = text.match(LATIN)?.length ?? 0;
  return cjk > 0 && cjk * 3 > latin;
};

/** lang="zh-CN" for a mostly Chinese text, nothing otherwise (the page's en applies). */
export const zhLang = (text: string | null | undefined): 'zh-CN' | undefined => (isMostlyChinese(text) ? 'zh-CN' : undefined);
