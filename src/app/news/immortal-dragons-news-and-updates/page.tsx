import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { pageMeta } from '@/content/pages';
import { ORG_COVER, ORG_REF, breadcrumbJsonLd } from '@/constants/entity';
import Markdown from 'react-markdown';
import { markdownRehypePlugins, markdownRemarkPlugins } from '@/utils/markdown';
import { NewsArticle, WithContext } from 'schema-dts';
import 'github-markdown-css/github-markdown-light.css';
import { getArticleContent } from './content';
import '@/styles/markdown.css';
import JsonLd from '@/components/seo/JsonLd';
import ReadDepth from '@/lib/analytics/ReadDepth';
import Breadcrumb from '@/components/site/Breadcrumb';

// Title and description from the content layer (src/content/pages.ts), shared with llms.txt.
const PAGE = pageMeta('article-profile');
const articleTitle = PAGE.title;
const articleDescription = PAGE.description;
const articleUrl = 'https://www.id.life/news/immortal-dragons-news-and-updates';

export const dynamic = 'force-static';

// The title is the article's own heading, in its language; it names the brand, so it is not suffixed twice
// (it read "Immortal Dragons ... | Immortal Dragons 不朽真龙").
export const metadata: Metadata = buildMetadata({ ...PAGE, type: 'article' });

const jsonLd: WithContext<NewsArticle> = {
  '@context': 'https://schema.org',
  '@type': 'NewsArticle',
  headline: articleTitle,
  description: articleDescription,
  url: articleUrl,
  mainEntityOfPage: articleUrl,
  image: ORG_COVER,
  author: ORG_REF,
  publisher: ORG_REF,
};

const breadcrumb = breadcrumbJsonLd([
  { name: 'News', path: '/news' },
  { name: articleTitle, path: '/news/immortal-dragons-news-and-updates' },
]);

export default function ImmortalDragonsNewsAndUpdatesPage() {
  const articleContent = getArticleContent();

  return (
    <>
      <JsonLd data={[jsonLd, breadcrumb]} />
      <ReadDepth itemId={'immortal-dragons-news-and-updates'} />
      <div>
        <Breadcrumb className="mt-5 mobile:mt-3.5" items={[{ label: 'News', href: '/news' }, { label: 'Article' }]} />
        <article className="mt-10 rounded-3xl bg-white p-20 mobile:mt-3 mobile:rounded-lg mobile:p-3">
          <div className="flex items-center justify-center gap-2 text-sm/5 font-semibold">
            <img src="/imgs/news/article_logo.webp" className="size-7" alt="" />
            Immortal Dragons
          </div>
          <h1 className="mt-5 text-center text-[2.375rem]/[3.75rem] font-semibold mobile:mt-3 mobile:text-lg">
            {articleTitle}
          </h1>
          <div className="mx-auto mb-15 mt-10 max-w-80 border-b border-dashed border-black mobile:mb-10 mobile:mt-7.5" />
          <div className="article-body markdown-body mobile:[&_table]:block mobile:[&_table]:overflow-x-auto">
            <Markdown remarkPlugins={markdownRemarkPlugins} rehypePlugins={markdownRehypePlugins}>
              {articleContent}
            </Markdown>
          </div>
        </article>
      </div>
    </>
  );
}
