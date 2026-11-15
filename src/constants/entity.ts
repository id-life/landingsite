import type { BreadcrumbList, Organization, WithContext } from 'schema-dts';
import { Links, MediaLinkType } from '@/constants/links';
import { FUND } from '@/content/fund';
import { personBySlug } from '@/content/people';
import { FUND_PRESS } from '@/content/press';
import { THEMES } from '@/content/themes';
import { SITE_URL, absoluteUrl } from '@/constants/site';

// JSON-LD builders for the Immortal Dragons entity. The facts come from the content layer (src/content/fund.ts),
// which llms.txt and the About page read too, so the copies cannot drift apart.

export const ORG_ID = `${SITE_URL}/#org`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const ORG_NAME = FUND.name.en;
export const ORG_ALTERNATE_NAME = FUND.name.zh;
export const ORG_LEGAL_NAME = FUND.legalName.value.en;
export const ORG_EMAIL = FUND.email;
export const ORG_LOGO = 'https://resources.id.life/logo.png';
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

// Official profiles. Short links (b23.tv, xhslink) are resolved to their canonical profile URLs.
export const ORG_SAME_AS = [
  'https://en.wikipedia.org/wiki/Immortal_Dragons',
  'https://www.wikidata.org/wiki/Q141592165',
  'https://baike.baidu.com/item/%E4%B8%8D%E6%9C%BD%E7%9C%9F%E9%BE%99%E5%9F%BA%E9%87%91/68055831',
  Links[MediaLinkType.Linkedin],
  Links[MediaLinkType.Youtube],
  'https://space.bilibili.com/3546871983246041',
  'https://www.xiaohongshu.com/user/profile/69345d500000000037007744',
  'https://www.zhihu.com/column/c_2021919119344150153',
  Links[MediaLinkType.Wechat],
];

/** Press coverage about the organization, for Organization.subjectOf. */
export const ORG_PRESS = FUND_PRESS.map(({ title, source, url, date }) => ({
  '@type': 'NewsArticle' as const,
  headline: title,
  url,
  ...(date && { datePublished: date }),
  publisher: { '@type': 'Organization' as const, name: source },
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
  legalName: ORG_LEGAL_NAME,
  url: `${SITE_URL}/`,
  logo: ORG_LOGO,
  image: ORG_COVER,
  description: ORG_DESCRIPTION,
  email: ORG_EMAIL,
  foundingDate: FUND.foundingYear.value.en,
  founder: {
    '@type': 'Person',
    name: FOUNDER.name.en,
    alternateName: FOUNDER.name.zh,
    alumniOf: FOUNDER.alumniOf.map((name) => ({ '@type': 'CollegeOrUniversity' as const, name })),
  },
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
