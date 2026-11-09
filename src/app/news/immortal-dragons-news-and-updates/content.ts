import fs from 'node:fs';
import path from 'node:path';

// 不朽真龙介绍 (converted from the profile docx). Read at build time by the article page and by the
// hidden crawler summaries on the homepage, /portfolio and /presence.
const articlePath = path.join(process.cwd(), 'src/app/news/immortal-dragons-news-and-updates/article.md');

export const ARTICLE_PATH = '/news/immortal-dragons-news-and-updates';
export const ARTICLE_TITLE = '不朽真龙介绍';

/** Article markdown without its H1 title, with docx-export escapes (\. \_ \-) removed. */
export function getArticleContent() {
  return fs
    .readFileSync(articlePath, 'utf8')
    .replace(/^# .+\r?\n+/, '')
    .replace(/\\([._-])/g, '$1');
}

/** Drops images, which a hidden text layer should not download. */
export const stripImages = (markdown: string) => markdown.replace(/^!\[[^\]]*\]\([^)]*\)\s*$/gm, '').trim();

/**
 * One `##`/`###` section of the article (heading included), up to the next heading of the same or a
 * higher level, re-levelled so it starts at `##`. Returns '' if the heading is missing.
 */
export function getArticleSection(heading: string) {
  const lines = getArticleContent().split('\n');
  const start = lines.findIndex((line) => /^#{2,3} /.test(line) && line.replace(/^#+ /, '').trim() === heading);
  if (start === -1) return '';
  const level = lines[start].indexOf(' ');
  const endOffset = lines.slice(start + 1).findIndex((line) => {
    const match = /^(#+) /.exec(line);
    return match !== null && match[1].length <= level;
  });
  const section = lines.slice(start, endOffset === -1 ? undefined : start + 1 + endOffset);
  const shift = level - 2;
  return stripImages(section.map((line) => (/^#{2,6} /.test(line) ? line.slice(shift) : line)).join('\n'));
}
