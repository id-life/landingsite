import Link from 'next/link';
import NewsContent from '@/app/news/_components/NewsContent';

export default function NewsArticle1() {
  return (
    <article style={{ height: 0, overflow: 'hidden' }}>
      <h1>Immortal Dragons is a purpose-driven longevity fund headquartered in Biopolis, Singapore.</h1>
      <NewsContent />
      <Link href="/news">ID News</Link>
    </article>
  );
}
