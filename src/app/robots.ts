import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/constants/site';

// Every crawler is allowed. Crawlers are listed by name so the policy for any
// single one can later be changed (e.g. moved to `disallow: '/'`) in one place.
const SEARCH_ENGINE_BOTS = ['Googlebot', 'Bingbot', 'Baiduspider', 'YandexBot'];

// AI search / user-triggered fetchers: let AI answers cite and link id.life.
const AI_SEARCH_BOTS = ['OAI-SearchBot', 'ChatGPT-User', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User'];

// AI training crawlers: let the brand and its ideas into model knowledge.
const AI_TRAINING_BOTS = ['GPTBot', 'ClaudeBot', 'Google-Extended', 'Applebot-Extended', 'CCBot', 'Bytespider'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: SEARCH_ENGINE_BOTS, allow: '/' },
      { userAgent: AI_SEARCH_BOTS, allow: '/' },
      { userAgent: AI_TRAINING_BOTS, allow: '/' },
      { userAgent: '*', allow: '/' },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
