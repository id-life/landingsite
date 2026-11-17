import type { BreadcrumbList, Organization, WithContext } from 'schema-dts';
import { Links, MediaLinkType } from '@/constants/links';
import { FUND } from '@/content/fund';
import { personBySlug } from '@/content/people';
import { FUND_PRESS } from '@/content/press';
import { THEMES } from '@/content/themes';
import { SITE_URL, absoluteUrl } from '@/constants/site';

// JSON-LD builders for the Immortal Dragons entity. The facts come from the content layer (src/content/fund.ts).
// The owner's rule of 2026-11-18 ("if I never put it in the website, then you shouldn't put it in") holds for these:
// each statement is words the site shows on the page that carries it. The description and knowsAbout (the focus)
// stay as they were: "Don't change the text regarding this" (question 12g).

export const ORG_ID = `${SITE_URL}/#org`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const ORG_NAME = FUND.name.en;
export const ORG_ALTERNATE_NAME = FUND.name.zh;
export const ORG_EMAIL = FUND.email;
const ORG_LOGO = 'https://resources.id.life/logo.png';
export const ORG_COVER = 'https://resources.id.life/id-life-cover-2.webp';

export const ORG_DESCRIPTION = FUND.description.text.en;

export const ORG_ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress: FUND.address.streetAddress,
  addressLocality: FUND.address.addressLocality,
  postalCode: FUND.address.postalCode,
  addressCountry: FUND.address.addressCountry,
} as const;

const FOUNDER = personBySlug(FUND.founder);

// Official profiles the site's footer links to (short links b23.tv and xhslink resolved to their canonical profile
// URLs). Profiles the site never links to are not claimed here (the owner's rule of 2026-11-18).
export const ORG_SAME_AS = [
  Links[MediaLinkType.Linkedin],
  Links[MediaLinkType.Youtube],
  'https://space.bilibili.com/3546871983246041',
  'https://www.xiaohongshu.com/user/profile/69345d500000000037007744',
  Links[MediaLinkType.Wechat],
];

/**
 * Press coverage about the organization, for Organization.subjectOf: the headline as the site's news list shows it,
 * and its link. No publisher or date: the site shows another date (a day later) and no or another source name, and
 * no launch date is stated in hidden data (owner, 2026-11-18, questions 12a and 12b).
 */
export const ORG_PRESS = FUND_PRESS.map(({ title, url }) => ({
  '@type': 'NewsArticle' as const,
  headline: title,
  url,
}));

/** Lightweight reference to the organization for author / publisher / creator fields. */
export const ORG_REF = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: ORG_NAME,
  url: `${SITE_URL}/`,
  logo: { '@type': 'ImageObject', url: ORG_LOGO },
} as const;

/** Full organization node; rendered on the homepage and the connect page. */
export const ORGANIZATION: Exclude<Organization, string> = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: ORG_NAME,
  alternateName: ORG_ALTERNATE_NAME,
  url: `${SITE_URL}/`,
  logo: ORG_LOGO,
  image: ORG_COVER,
  description: ORG_DESCRIPTION,
  email: ORG_EMAIL,
  // The founder's name as the experience shows it ("Boyang Wang, Founder, Immortal Dragons", a news headline); his
  // Chinese name and schools are shown only on the 不朽真龙介绍 article, not on these pages.
  founder: { '@type': 'Person', name: FOUNDER.name.en },
  address: ORG_ADDRESS,
  knowsAbout: THEMES.map((theme) => theme.name.en),
  sameAs: ORG_SAME_AS,
  subjectOf: ORG_PRESS,
};

export const WEBSITE = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  name: ORG_NAME,
  alternateName: ORG_ALTERNATE_NAME,
  url: `${SITE_URL}/`,
  publisher: { '@id': ORG_ID },
} as const;

type Crumb = { name: string; path: string };

/** BreadcrumbList starting at Home; pass the trail below it, ending with the current page. */
export function breadcrumbJsonLd(trail: Crumb[]): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...trail].map(({ name, path }, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name,
      item: absoluteUrl(path),
    })),
  };
}
