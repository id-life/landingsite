/**
 * AI crawlers whose visits are recorded (see `src/middleware.ts`).
 *
 * `token` is the product token each vendor documents for its User-Agent, matched case-sensitively.
 * The same tokens are repeated in the middleware's `matcher`, which has to be a literal: keep both in sync.
 *
 * Not listed, because they send no User-Agent of their own: Google-Extended and Applebot-Extended
 * (robots.txt switches only), and Gemini / Copilot, which read the Googlebot and Bingbot indexes.
 */
export type AiCrawlerPurpose =
  /** Collects pages to train models. */
  | 'training'
  /** Builds the index an AI search answers from. */
  | 'search'
  /** Fetches a page because a person asked the assistant about it. */
  | 'user';

export type AiCrawler = { token: string; vendor: string; purpose: AiCrawlerPurpose };

export const AI_CRAWLERS: AiCrawler[] = [
  { token: 'GPTBot', vendor: 'OpenAI', purpose: 'training' },
  { token: 'OAI-SearchBot', vendor: 'OpenAI', purpose: 'search' },
  { token: 'ChatGPT-User', vendor: 'OpenAI', purpose: 'user' },
  { token: 'ClaudeBot', vendor: 'Anthropic', purpose: 'training' },
  { token: 'Claude-SearchBot', vendor: 'Anthropic', purpose: 'search' },
  { token: 'Claude-User', vendor: 'Anthropic', purpose: 'user' },
  { token: 'PerplexityBot', vendor: 'Perplexity', purpose: 'search' },
  { token: 'Perplexity-User', vendor: 'Perplexity', purpose: 'user' },
  { token: 'meta-externalagent', vendor: 'Meta', purpose: 'training' },
  { token: 'meta-externalfetcher', vendor: 'Meta', purpose: 'user' },
  { token: 'Bytespider', vendor: 'ByteDance', purpose: 'training' },
  { token: 'CCBot', vendor: 'Common Crawl', purpose: 'training' },
  { token: 'Amazonbot', vendor: 'Amazon', purpose: 'search' },
  { token: 'Applebot', vendor: 'Apple', purpose: 'search' },
  { token: 'DuckAssistBot', vendor: 'DuckDuckGo', purpose: 'user' },
  { token: 'MistralAI-User', vendor: 'Mistral', purpose: 'user' },
];

export const AI_CRAWLER_EVENT = 'ai_crawler_visit';

export const findAiCrawler = (userAgent: string | null) =>
  userAgent ? AI_CRAWLERS.find((crawler) => userAgent.includes(crawler.token)) : undefined;
