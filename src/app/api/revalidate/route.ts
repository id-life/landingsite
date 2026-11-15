import { revalidatePath } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';
import { cleanPaths, pingBaidu, pingIndexNow, type PingResult } from '@/lib/indexnow';

// Never cached, never prerendered: it acts only when the CMS calls it.
export const dynamic = 'force-dynamic';

/**
 * Publish webhook for the CMS (id-platform), SEO-04. On every publish or update the CMS POSTs
 *   Authorization: Bearer <REVALIDATE_SECRET>
 *   { "paths": ["/podcast/57", "/podcast"] }
 * The route regenerates those pages, /sitemap.xml and /llms.txt, then tells IndexNow and (when BAIDU_PUSH_ENDPOINT is
 * set) Baidu about the changed URLs, and answers with both responses so the CMS can log them. Without
 * REVALIDATE_SECRET in the environment the route does not exist (404).
 */
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) return NextResponse.json({ error: 'not found' }, { status: 404 });
  if (request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'body must be JSON: { "paths": ["/podcast/57"] }' }, { status: 400 });
  }
  const paths = cleanPaths((body as { paths?: unknown })?.paths);
  if (!paths.length) return NextResponse.json({ error: 'no valid paths' }, { status: 400 });

  for (const path of [...paths, '/sitemap.xml', '/llms.txt']) revalidatePath(path);

  const pings: Promise<PingResult>[] = [pingIndexNow(paths)];
  const baidu = process.env.BAIDU_PUSH_ENDPOINT;
  if (baidu) pings.push(pingBaidu(baidu, paths));
  const results = await Promise.all(pings);
  // warn, not log: production builds strip console.log/info (next.config removeConsole), and these lines are the record.
  for (const r of results) console.warn(`[revalidate] ${r.service} ${r.status ?? 'error'} ${r.body.slice(0, 200)}`);

  return NextResponse.json({ revalidated: paths, pings: results });
}
