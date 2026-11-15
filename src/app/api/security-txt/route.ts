export const dynamic = 'force-static';

/**
 * /.well-known/security.txt (RFC 9116), rewritten here by next.config.mjs (ENG-11). The contact is the owner's
 * decision, so the file is served only when SECURITY_CONTACT is set (one or more comma-separated contact URIs, e.g.
 * mailto:security@... or the repository's private vulnerability reporting URL once it is enabled); without one it
 * answers 404 rather than publish a channel nobody reads. Expires is 180 days after the build, so every deploy renews it.
 */
export function GET() {
  const contacts = (process.env.SECURITY_CONTACT ?? '')
    .split(',')
    .map((c) => c.trim())
    .filter((c) => /^(mailto:|https:\/\/)/.test(c));
  if (!contacts.length) return new Response('Not found\n', { status: 404, headers: { 'content-type': 'text/plain' } });
  const expires = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().replace(/\.\d{3}Z$/, 'Z');
  const body = [
    ...contacts.map((c) => `Contact: ${c}`),
    `Expires: ${expires}`,
    'Canonical: https://www.id.life/.well-known/security.txt',
    'Policy: https://github.com/id-life/landingsite/blob/main/SECURITY.md',
    'Preferred-Languages: en, zh',
    '',
  ].join('\n');
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
