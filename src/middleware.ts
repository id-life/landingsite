import { NextResponse, type NextFetchEvent, type NextRequest } from 'next/server';
import { AI_CRAWLER_EVENT, findAiCrawler } from '@/constants/ai-crawlers';

/**
 * Records visits from AI crawlers as a Google Analytics event.
 *
 * Crawlers do not run the page's scripts, so the normal GA tag never sees them. This sends the
 * event from the server instead (GA4 Measurement Protocol), without delaying the response.
 *
 * The event carries no `page_location`, so it has no hostname: reports that filter on
 * hostname = www.id.life (the weekly report does) keep counting people only.
 */
export function middleware(request: NextRequest, event: NextFetchEvent) {
  const measurementId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
  const apiSecret = process.env.GA_MP_API_SECRET;
  const crawler = findAiCrawler(request.headers.get('user-agent'));

  if (crawler && measurementId && apiSecret) {
    const url = `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`;
    const body = JSON.stringify({
      // One fixed id per crawler, so each crawler shows up in GA as a single "user".
      client_id: `ai-crawler.${crawler.token}`,
      non_personalized_ads: true,
      events: [
        {
          name: AI_CRAWLER_EVENT,
          params: {
            crawler_name: crawler.token,
            crawler_vendor: crawler.vendor,
            crawler_purpose: crawler.purpose,
            page_path: request.nextUrl.pathname,
          },
        },
      ],
    });
    event.waitUntil(fetch(url, { method: 'POST', body }).catch(() => undefined));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    {
      // Pages and text files (llms.txt, robots.txt, sitemap.xml), not build output, API routes or media.
      source:
        '/((?!_next/|api/|.*\\.(?:js|css|map|json|png|jpe?g|gif|webp|avif|svg|ico|glb|gltf|hdr|bin|woff2?|ttf|otf|mp3|mp4|webm|wav)$).*)',
      // Only requests from the crawlers in `AI_CRAWLERS` reach this function; everyone else skips it.
      has: [
        {
          type: 'header',
          key: 'user-agent',
          value:
            '.*(?:GPTBot|OAI-SearchBot|ChatGPT-User|ClaudeBot|Claude-SearchBot|Claude-User|PerplexityBot|Perplexity-User|meta-externalagent|meta-externalfetcher|Bytespider|CCBot|Amazonbot|Applebot|DuckAssistBot|MistralAI-User).*',
        },
      ],
    },
  ],
};
