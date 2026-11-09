import ArticleExcerpt from '@/components/seo/ArticleExcerpt';
import PageSEOContent, { type SEOItem } from '@/components/seo/PageSEOContent';
import { MAP_BOOK_DOTS, MAP_SPONSOR_DOTS, WORLD_MAP_DOTS } from '@/constants/engagement';

// Map copy uses "\n" for visual line breaks only.
const oneLine = (value: string) => value.replace(/\s*\n\s*/g, ' ').trim();

function eventItems(): SEOItem[] {
  return WORLD_MAP_DOTS.flatMap((dot) => {
    const location = [dot.label, dot.country].filter(Boolean).join(', ');
    const text = [location, dot.period].filter((value): value is string => Boolean(value));
    return [dot.title, dot.secondTitle]
      .filter((title): title is string => Boolean(title))
      .map((title) => ({ title: oneLine(title), text, href: dot.link || undefined }));
  });
}

function bookItems(): SEOItem[] {
  return MAP_BOOK_DOTS.filter((dot) => dot.bookTitle).map((dot) => ({
    title: dot.bookTitle as string,
    text: [dot.desc, dot.title].filter((value): value is string => Boolean(value)),
    href: dot.link || undefined,
  }));
}

function sponsorItems(): SEOItem[] {
  return MAP_SPONSOR_DOTS.flatMap((dot) =>
    dot.data.map((item) => ({ title: oneLine(item.alt), text: [dot.title], href: item.link || undefined })),
  );
}

export default function PresenceSummary({ title, description }: { title: string; description: string }) {
  return (
    <>
      <PageSEOContent
        title={title}
        intro={[description]}
        sections={[
          { heading: 'Conference', items: eventItems() },
          { heading: 'Translation & Publishing 翻译与出版', items: bookItems() },
          { heading: 'Sponsorship & Research', items: sponsorItems() },
        ]}
      />
      {/* The map only names events and sponsors; the profile article says what each one is. */}
      <ArticleExcerpt headings={['行业布道', '三、行业赞助']} />
    </>
  );
}
