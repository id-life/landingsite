export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const CHOICES = ['granted', 'denied'];

/**
 * Consent log (DATA-01): one structured line per answer with the random consent id (also kept in the visitor's own
 * idl_consent cookie), the answer, the country and the policy version. No IP address, user agent or other
 * identifier is written. The line goes to the deployment's runtime logs; a durable store (log drain or KV) is an
 * owner decision.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    const text = await request.text();
    if (text.length > 1024) return new Response(null, { status: 413 });
    body = JSON.parse(text);
  } catch {
    return new Response(null, { status: 400 });
  }
  const consentId = typeof body.consentId === 'string' ? body.consentId : '';
  const choice = typeof body.choice === 'string' ? body.choice : '';
  if (!/^[\w-]{8,64}$/.test(consentId) || !CHOICES.includes(choice)) return new Response(null, { status: 400 });
  const region = typeof body.region === 'string' && /^[A-Z]{0,2}$/.test(body.region) ? body.region : '';
  const policyVersion = typeof body.policyVersion === 'string' ? body.policyVersion.slice(0, 40) : '';
  const ts = typeof body.ts === 'number' && Number.isFinite(body.ts) ? body.ts : Date.now();
  console.info(JSON.stringify({ route: 'consent', consentId, choice, region, policyVersion, ts }));
  return new Response(null, { status: 204, headers: { 'cache-control': 'no-store' } });
}
