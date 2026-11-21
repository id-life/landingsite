import HiddenMarkdown from '@/components/seo/HiddenMarkdown';
import { ARTICLE_PATH, ARTICLE_TITLE, getArticleSection } from '@/app/news/immortal-dragons-news-and-updates/content';

// Hidden Chinese excerpt of the 不朽真龙介绍 article for a page whose visible content covers the same
// topic (e.g. the portfolio or sponsors). Pass the article's own headings; it follows the article.
export default function ArticleExcerpt({ headings }: { headings: string[] }) {
  const markdown = headings.map(getArticleSection).filter(Boolean).join('\n\n');
  if (!markdown) return null;
  return (
    <section className="sr-only" lang="zh-CN" aria-label={ARTICLE_TITLE}>
      <HiddenMarkdown>{markdown}</HiddenMarkdown>
      <p>
        <a href={ARTICLE_PATH} tabIndex={-1}>
          阅读全文：{ARTICLE_TITLE}
        </a>
      </p>
    </section>
  );
}
