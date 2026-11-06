import type { BreadcrumbList, Organization, WithContext } from 'schema-dts';
import { Links, MediaLinkType } from '@/constants/links';
import { SITE_URL, absoluteUrl } from '@/constants/site';

// Single source for the Immortal Dragons entity used by every JSON-LD block.
// Facts follow the site copy and the 不朽真龙介绍 profile; keep them in sync with llms.txt.

export const ORG_ID = `${SITE_URL}/#org`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const ORG_NAME = 'Immortal Dragons';
export const ORG_ALTERNATE_NAME = '不朽真龙';
export const ORG_LEGAL_NAME = 'IMMORTAL DRAGONS PRIVATE LIMITED';
export const ORG_EMAIL = 'contact@id.life';
export const ORG_LOGO = 'https://resources.id.life/logo.png';
export const ORG_COVER = 'https://resources.id.life/id-life-cover-2.webp';

export const ORG_DESCRIPTION =
  'Immortal Dragons is a purpose-driven longevity fund headquartered in Singapore. Its investment themes include replacement strategy, 3D bioprinting, gene therapy, artificial womb, longevity special economic zones, and LP positions in other long-bio funds. Beyond conventional capital investment, Immortal Dragons also engages in book translation and publishing, delivers talks and produces podcasts, sponsors events and initiatives, and collaborates on research projects.';

export const ORG_ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress: '3 Biopolis Dr, #01-15',
  addressLocality: 'Singapore',
  postalCode: '138623',
  addressCountry: 'SG',
} as const;

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
  foundingDate: '2024',
  founder: {
    '@type': 'Person',
    name: 'Boyang Wang',
    alternateName: '朢舶洋',
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: 'National University of Singapore' },
      { '@type': 'CollegeOrUniversity', name: 'Yale University' },
    ],
  },
  address: ORG_ADDRESS,
  knowsAbout: ['Replacement Strategy', 'Neuro & Brain Rejuvenation', 'Cells and Gene Therapy', 'Reproduction Technology'],
  sameAs: ORG_SAME_AS,
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
