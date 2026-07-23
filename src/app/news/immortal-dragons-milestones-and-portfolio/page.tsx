import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import Link from 'next/link';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { NewsArticle, WithContext } from 'schema-dts';
import 'github-markdown-css/github-markdown-light.css';
import '@/styles/markdown.css';

const articleTitle = '不朽真龙公司资讯';
const articleDescription = '不朽真龙的重要事件与投资组合概览，涵盖基金发布、产业投资和行业参与。';
const articleUrl = 'https://www.id.life/news/immortal-dragons-milestones-and-portfolio';
const articlePath = path.join(process.cwd(), 'src/app/news/immortal-dragons-milestones-and-portfolio/article.md');

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Immortal Dragons: Milestones and Portfolio',
  description: articleDescription,
  openGraph: {
    title: 'Immortal Dragons: Milestones and Portfolio',
    siteName: 'Immortal Dragons',
    description: articleDescription,
    url: articleUrl,
    type: 'article',
    images: [
      {
        url: 'https://resources.id.life/id-life-cover-2.webp',
      },
    ],
  },
};

const jsonLd: WithContext<NewsArticle> = {
  '@context': 'https://schema.org',
  '@type': 'NewsArticle',
  headline: articleTitle,
  description: articleDescription,
  url: articleUrl,
  mainEntityOfPage: articleUrl,
  image: 'https://resources.id.life/id-life-cover-2.webp',
  author: {
    '@type': 'Organization',
    name: 'Immortal Dragons',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Immortal Dragons',
    logo: {
      '@type': 'ImageObject',
      url: 'https://resources.id.life/logo.png',
    },
  },
};

function getArticleContent() {
  return fs
    .readFileSync(articlePath, 'utf8')
    .replace(/^# .+\r?\n+/, '')
    .replace(/\\([._-])/g, '$1');
}

export default function ImmortalDragonsMilestonesAndPortfolioPage() {
  const articleContent = getArticleContent();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div>
        <div className="mt-5 flex items-center justify-between mobile:mt-3.5">
          <div className="text-xl/5 font-medium mobile:text-xs/5">
            <Link href="/news">News</Link>
            <span className="ml-1 text-black/50">&gt; Article</span>
          </div>
        </div>
        <article className="mt-10 rounded-3xl bg-white p-20 mobile:mt-3 mobile:rounded-lg mobile:p-3">
          <div className="flex items-center justify-center gap-2 text-sm/5 font-semibold">
            <img src="/imgs/news/article_logo.webp" className="size-7" alt="" />
            Immortal Dragons
          </div>
          <h1 className="mt-5 text-center text-[2.375rem]/[3.75rem] font-semibold mobile:mt-3 mobile:text-lg">
            {articleTitle}
          </h1>
          <div className="mx-auto mb-15 mt-10 max-w-80 border-b border-dashed border-black mobile:mb-10 mobile:mt-7.5" />
          <div className="markdown-body mobile:[&_p]:text-sm mobile:[&_table]:block mobile:[&_table]:overflow-x-auto">
            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {articleContent}
            </Markdown>
          </div>
        </article>
      </div>
    </>
  );
}
