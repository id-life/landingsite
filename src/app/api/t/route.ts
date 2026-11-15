export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const STAGES = ['html', 'hydrated', 'assets'];

/**
 * Cookieless load_abandon beacon (DATA-06), sent by the head script when a visitor leaves before the 3D experience
 * is ready and analytics is allowed. Validated, then logged as one structured line with no identifier. When the owner
 * sets GA4_MP_API_SECRET it is also forwarded to GA4 through the Measurement Protocol under a throw-away client id,
 * so abandonment by stage can sit on the same dashboard as experience_ready.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    const text = await request.text();
    if (text.length > 512) return new Response(null, { status: 413 });
    body = JSON.parse(text);
  } catch {
    return new Response(null, { status: 400 });
  }
  if (body.e !== 'load_abandon' || typeof body.stage !== 'string' || !STAGES.includes(body.stage)) {
    return new Response(null, { status: 400 });
  }
  const event = {
    stage: body.stage,
    ms: typeof body.ms === 'number' && Number.isFinite(body.ms) ? Math.max(0, Math.round(body.ms)) : 0,
    layout: body.layout === 'mobile' ? 'mobile' : 'desktop',
    conn: typeof body.conn === 'string' ? body.conn.slice(0, 8) : '',
  };
  console.info(JSON.stringify({ route: 't', e: 'load_abandon', ...event }));
  const secret = process.env.GA4_MP_API_SECRET;
  const id = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
  if (secret && id) {
    const url = `https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(id)}&api_secret=${encodeURIComponent(secret)}`;
    await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        client_id: `${Date.now()}.${Math.floor(Math.random() * 1e9)}`,
        non_personalized_ads: true,
        events: [
          { name: 'load_abandon', params: { stage: event.stage, load_ms: event.ms, layout: event.layout, conn: event.conn } },
        ],
      }),
    }).catch(() => {});
  }
  return new Response(null, { status: 204, headers: { 'cache-control': 'no-store' } });
}
