import Markdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { LLMS_HEADER } from '@/app/llms.txt/content';
import { getArticleContent } from '@/app/news/immortal-dragons-news-and-updates/content';
import { portfolioMarkdownLines } from '@/app/portfolio/_components/portfolioData';

// Server-rendered bilingual profile for crawlers on the 3D homepage (visually hidden, sr-only).
// No new copy: Chinese is the 不朽真龙介绍 article up to its 行业点评 chapter (the parts the homepage
// itself shows — fund, portfolio, sponsors); English is the same facts as already translated for
// llms.txt, plus the portfolio list. Both follow their sources automatically.

const ARTICLE_PATH = '/news/immortal-dragons-news-and-updates';
const ARTICLE_STOP_HEADING = '## 四、行业点评';
const EN_SECTIONS = ['Key facts', 'Investment themes', 'Beyond capital'];

function chineseProfile() {
  const article = getArticleContent();
  const end = article.indexOf(ARTICLE_STOP_HEADING);
  return (end === -1 ? article : article.slice(0, end)).replace(/^!\[[^\]]*\]\([^)]*\)\s*$/gm, '').trim();
}

/** Body of a `## heading` section in a markdown string, up to the next `## `. */
function markdownSection(markdown: string, heading: string) {
  const start = markdown.indexOf(`## ${heading}\n`);
  if (start === -1) return '';
  const next = markdown.indexOf('\n## ', start + 3);
  return markdown.slice(start, next === -1 ? undefined : next).trim();
}

function englishProfile() {
  const intro = LLMS_HEADER.split('\n')
    .filter((line) => line.startsWith('>'))
    .map((line) => line.replace(/^>\s?/, ''))
    .join('\n');
  const sections = EN_SECTIONS.map((heading) => markdownSection(LLMS_HEADER, heading)).filter(Boolean);
  return [intro, ...sections, `## Portfolio\n\n${portfolioMarkdownLines().join('\n')}`].join('\n\n');
}

// Hidden links: external ones render as plain text (hidden outbound links read as link spam, and
// /portfolio already links the companies visibly); internal ones stay, out of the keyboard tab order.
const isInternal = (href?: string) => Boolean(href?.startsWith('/'));

const markdownComponents: Components = {
  a: ({ node: _node, href, children, ...props }) =>
    isInternal(href) ? (
      <a {...props} href={href} tabIndex={-1}>
        {children}
      </a>
    ) : (
      <>{children}</>
    ),
};

export default function HomeProfile() {
  return (
    <div className="sr-only">
      <section lang="zh-CN" aria-label="不朽真龙介绍">
        <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {chineseProfile()}
        </Markdown>
        <p>
          <a href={ARTICLE_PATH} tabIndex={-1}>
            阅读全文：不朽真龙介绍
          </a>
        </p>
      </section>
      <section lang="en" aria-label="About Immortal Dragons">
        <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {englishProfile()}
        </Markdown>
      </section>
    </div>
  );
}
