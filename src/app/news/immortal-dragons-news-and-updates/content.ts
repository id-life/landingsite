import fs from 'node:fs';
import path from 'node:path';

// 不朽真龙介绍 (converted from the profile docx). Read at build time by the article page and the homepage.
const articlePath = path.join(process.cwd(), 'src/app/news/immortal-dragons-news-and-updates/article.md');

/** Article markdown without its H1 title, with docx-export escapes (\. \_ \-) removed. */
export function getArticleContent() {
  return fs
    .readFileSync(articlePath, 'utf8')
    .replace(/^# .+\r?\n+/, '')
    .replace(/\\([._-])/g, '$1');
}
