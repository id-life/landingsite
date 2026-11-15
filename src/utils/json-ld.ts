// No imports: this module is loaded as-is by the unit tests.

/**
 * The body of a <script type="application/ld+json">. JSON.stringify does not escape '<', so a title such as
 * '</script><script>…' from the CMS would close the element and run as script. Writing every '<' as the
 * JSON escape < keeps the JSON identical for parsers and makes the sequence impossible.
 * https://nextjs.org/docs/app/guides/json-ld
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
