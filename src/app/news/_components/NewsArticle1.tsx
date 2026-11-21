import Link from 'next/link';

/**
 * His zero-height block on / (his NewsArticle1), server-rendered as his site serves it: the sentence and the three
 * links, in a height 0 / overflow hidden box. Brought back after 5ad6cf0 deleted it (what his site serves stays unless
 * an answer of his removes it). Two parts of his block are not here, pending the lead: the cover image it loads, and
 * the English article from 2025 his NewsContent injects into it after hydration (a text no other page serves, which
 * names a second founder and companies outside his portfolio; it goes to him first).
 */
export default function NewsArticle1() {
  return (
    <div style={{ height: 0, overflow: 'hidden' }}>
      <div>Immortal Dragons is a purpose-driven longevity fund headquartered in Biopolis, Singapore.</div>
      <Link href="/podcast">Podcast</Link>
      <Link href="/podcast?c=lt">Long talk</Link>
      <Link href="/news">News</Link>
    </div>
  );
}
