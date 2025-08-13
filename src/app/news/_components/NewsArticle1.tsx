import Link from 'next/link';
import NewsContent from '@/app/news/_components/NewsContent';

export default function NewsArticle1() {
  return (
    <article style={{ height: 0, overflow: 'hidden' }}>
      <h1>Immortal Dragons is a purpose-driven longevity fund headquartered in Biopolis, Singapore.</h1>
      <img src="https://cdn.id.life/id-life-cover-2.webp" alt="" />
      <NewsContent />
      <Link href="/news" />
      <Link href="/podcast" />
      <Link href="/podcast?c=id" />
      <Link href="/podcast?c=lt" />
      <Link href="/portfolio" />
      <Link href="/spectrum" />
      <Link href="/digitaltwin" />
      <Link href="/value" />
      <Link href="/about" />
    </article>
  );
}
