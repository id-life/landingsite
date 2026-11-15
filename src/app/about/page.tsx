import type { Metadata } from 'next';
import type { AboutPage, WithContext } from 'schema-dts';
import JsonLd from '@/components/seo/JsonLd';
import { ORG_ADDRESS, ORG_COVER, ORG_ID, ORG_LOGO, WEBSITE_ID, breadcrumbJsonLd } from '@/constants/entity';
import { buildMetadata } from '@/lib/seo/metadata';
import { absoluteUrl } from '@/constants/site';
import { pageMeta } from '@/content/pages';
import { FUND } from '@/content/fund';
import { THEMES } from '@/content/themes';
import AboutView, { ABOUT_TITLE } from './_components/AboutView';

// Title "About | Immortal Dragons" and the one-sentence statement (79 characters, it suits a search snippet) from the
// content layer (src/content/pages.ts); the page itself opens with the two-sentence summary.
const PAGE = pageMeta('about');
const description = PAGE.description;

export const metadata: Metadata = buildMetadata({ ...PAGE, image: ORG_COVER });

// Structured data states only what the page shows (Google: do not mark up content that is not visible). The full
// Organization node (founder, legal name, founding date) stays on / and /connect until those facts are confirmed.
const jsonLd: WithContext<AboutPage> = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  '@id': `${absoluteUrl('/about')}#webpage`,
  url: absoluteUrl('/about'),
  name: ABOUT_TITLE,
  description,
  isPartOf: { '@id': WEBSITE_ID },
  mainEntity: {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: FUND.name.en,
    alternateName: FUND.name.zh,
    url: absoluteUrl('/'),
    logo: ORG_LOGO,
    description: FUND.statement.text.en,
    email: FUND.email,
    address: ORG_ADDRESS,
    knowsAbout: THEMES.map((theme) => theme.name.en),
  },
};

export default function AboutRoute() {
  return (
    <>
      <JsonLd data={[jsonLd, breadcrumbJsonLd([{ name: 'About', path: '/about' }])]} />
      <AboutView />
    </>
  );
}
