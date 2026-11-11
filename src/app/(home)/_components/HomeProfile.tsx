import { LLMS_SECTIONS, llmsIntro, llmsSection } from '@/app/llms.txt/content';
import {
  ARTICLE_PATH,
  ARTICLE_TITLE,
  getArticleContent,
  stripImages,
} from '@/app/news/immortal-dragons-news-and-updates/content';
import { portfolioMarkdownLines } from '@/app/portfolio/_components/portfolioData';
import HiddenMarkdown from '@/components/seo/HiddenMarkdown';

// Server-rendered bilingual profile for crawlers on the 3D homepage (visually hidden, sr-only).
// No new copy: Chinese is the 不朽真龙介绍 article up to its 行业点评 chapter (the parts the homepage
// itself shows — fund, portfolio, sponsors); English is the official English profile as kept in
// llms.txt, plus the portfolio list. Both follow their sources automatically.

const ARTICLE_STOP_HEADING = '## 四、行业点评';
const EN_SECTIONS = ['keyFacts', 'themes', 'advocacy', 'sponsorships'] as const;

function chineseProfile() {
  const article = getArticleContent();
  const end = article.indexOf(ARTICLE_STOP_HEADING);
  return stripImages(end === -1 ? article : article.slice(0, end));
}

function englishProfile() {
  const sections = EN_SECTIONS.map((key) => llmsSection(LLMS_SECTIONS[key])).filter(Boolean);
  return [llmsIntro(), ...sections, `## Portfolio\n\n${portfolioMarkdownLines().join('\n')}`].join('\n\n');
}

export default function HomeProfile() {
  return (
    <div className="sr-only">
      <section lang="zh-CN" aria-label={ARTICLE_TITLE}>
        <HiddenMarkdown>{chineseProfile()}</HiddenMarkdown>
        <p>
          <a href={ARTICLE_PATH} tabIndex={-1}>
            阅读全文：{ARTICLE_TITLE}
          </a>
        </p>
      </section>
      <section lang="en" aria-label="About Immortal Dragons">
        <HiddenMarkdown>{englishProfile()}</HiddenMarkdown>
      </section>
    </div>
  );
}
