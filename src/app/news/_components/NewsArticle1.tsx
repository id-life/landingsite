import Link from 'next/link';
import NewsContent from '@/app/news/_components/NewsContent';

export default function NewsArticle1() {
  return (
    <div style={{ height: 0, overflow: 'hidden' }}>
      <h1>Immortal Dragons is a purpose-driven longevity fund headquartered in Biopolis, Singapore.</h1>
      <img src="https://cdn.id.life/id-life-cover-2.webp" alt="" />
      <NewsContent />
      <Link href="/podcast">Podcast</Link>
      <Link href="/podcast?c=id">Immortal Dragons</Link>
      <Link href="/podcast?c=lt">Long talk</Link>
      <Link href="/about">About</Link>
      <Link href="/news">News</Link>
    </div>
  );
}
