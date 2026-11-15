import { serializeJsonLd } from '@/utils/json-ld';

/**
 * Structured data for a page. The only component allowed to use dangerouslySetInnerHTML (an ESLint rule
 * enforces it): its input is serialised with every '<' escaped, so no string in it can end the script.
 */
export default function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
