// Shared spectrum data - used by the useSpectrumData hook and the Spectrum JSON-LD.
// The records (groups, books, labs, papers, sponsored bodies) live in the content layer (src/content/initiatives.ts,
// src/content/grants.ts); this file adds only their presentation, keyed by slug.

import BookSVG from '@/../public/svgs/engagement/book.svg?component';
import DigitalTwinSVG from '@/../public/svgs/spectrum/digital-twin.svg?component';
import RelationSVG from '@/../public/svgs/spectrum/relation.svg?component';
import ResearchSVG from '@/../public/svgs/engagement/research.svg?component';
import SponsorSVG from '@/../public/svgs/engagement/sponsor.svg?component';
import { absoluteUrl } from '@/constants/site';
import { SPECTRUM_GRANTS } from '@/content/grants';
import { BOOKS, LABS, PAPERS_BY_CITATIONS, SPECTRUM_GROUPS, bySlug } from '@/content/initiatives';
import { CollectionPage, WithContext } from 'schema-dts';

import type { JSX } from 'react';

export type SpectrumLinkData = {
  label: string;
  link?: string;
  isComingSoon?: boolean;
  routeKey?: string;
  labelClassName?: string;
  icon?: string;
  size?: string;
  mobileSize?: string;
};

export type SpectrumItemData = {
  /** The group's slug in the content layer (SPECTRUM_GROUPS). */
  id: string;
  title: string;
  titleCn: string;
  icon: JSX.Element;
  links: SpectrumLinkData[];
  linksClassName?: string;
  className?: string;
  /** Show only this many links at rest; a "more" control reveals the others in place. */
  collapsedCount?: number;
};

/** Group presentation, in display order. */
const GROUP_VIEW: Record<string, Pick<SpectrumItemData, 'icon' | 'linksClassName' | 'className' | 'collapsedCount'>> = {
  'translation-publishing': { icon: <BookSVG />, linksClassName: 'grid grid-cols-2' },
  evangelism: { icon: <RelationSVG />, linksClassName: 'grid grid-cols-2 gap-x-6' },
  'digital-twin': { icon: <DigitalTwinSVG />, className: 'mobile:pt-4' },
  // The three most cited papers show at rest; "more" opens the others in place (the owner's arrangement, 2026-11-17).
  'papers-reviews': {
    icon: <ResearchSVG className="[&_path]:fill-white" />,
    linksClassName: 'flex max-w-[15rem] flex-col gap-1',
    collapsedCount: 3,
  },
  'proudly-supporting': { icon: <SponsorSVG />, className: 'mobile:text-xl' },
};

/** Per-link presentation that is not content: label classes and logo heights. */
const BOOK_VIEW: Record<string, Partial<SpectrumLinkData>> = {
  'the-case-against-death': { isComingSoon: false },
  'better-with-age': { labelClassName: 'mobile:ml-0' },
};

const SPONSOR_VIEW: Record<string, Required<Pick<SpectrumLinkData, 'icon' | 'size' | 'mobileSize'>>> = {
  ardd: { icon: '/imgs/investments/sponsors/ardd.png', size: 'h-15', mobileSize: 'h-10.5 ipad:h-15' },
  'nakauchi-lab': { icon: '/imgs/investments/sponsors/nakauchi-lab.png', size: 'h-18', mobileSize: 'h-9 ipad:h-11' },
  xprize: { icon: '/imgs/investments/sponsors/xprize.png', size: 'h-9', mobileSize: 'h-6 ipad:h-9' },
  'lifespan-research-institute': { icon: '/imgs/investments/sponsors/lifespan.png', size: 'h-12', mobileSize: 'h-8 ipad:h-13' },
  'public-longevity-group': {
    icon: '/imgs/investments/sponsors/public-longevity.png',
    size: 'h-15',
    mobileSize: 'h-10.5 ipad:h-15',
  },
  '2060-longevity-forum': { icon: '/imgs/investments/sponsors/2060-longevity.png', size: 'h-12', mobileSize: 'h-8 ipad:h-13' },
  'revive-me': { icon: '/imgs/investments/sponsors/revive-me.png', size: 'h-12', mobileSize: 'h-8 ipad:h-13' },
  'healthy-longevity-medicine-conference': {
    icon: '/imgs/investments/sponsors/healthy-longevity.png',
    size: 'h-15',
    mobileSize: 'h-10.5 ipad:h-15',
  },
  'vitalist-bay-summit': { icon: '/imgs/investments/sponsors/vitalist-bay.png', size: 'h-12', mobileSize: 'h-8 ipad:h-13' },
  'copenhagen-aging-brain-rejuvenation': {
    icon: '/imgs/investments/sponsors/aging-brain.png',
    size: 'h-18',
    mobileSize: 'h-14 ipad:h-18',
  },
  'oxford-heart-aging-metabolism': {
    icon: '/imgs/investments/sponsors/heart-aging.png',
    size: 'h-18',
    mobileSize: 'h-14 ipad:h-18',
  },
  'stanford-brain-resilience': {
    icon: '/imgs/investments/sponsors/brain-resilience.png',
    size: 'h-18',
    mobileSize: 'h-14 ipad:h-18',
  },
  'cornerstone-foundation': {
    icon: '/imgs/investments/sponsors/cornerstone.png',
    size: 'h-6.5',
    mobileSize: 'h-4.5 ipad:h-6.5',
  },
  'beyond-tomorrow-podcast': {
    icon: '/imgs/investments/sponsors/beyond-tomorrow.png',
    size: 'h-5',
    mobileSize: 'h-3.5 ipad:h-4.5',
  },
  'hackaging-ai': { icon: '/imgs/investments/sponsors/hackaging.png', size: 'h-5', mobileSize: 'h-3.5 ipad:h-4.5' },
  biohackerdao: { icon: '/imgs/investments/sponsors/biohackerdao.png', size: 'h-15', mobileSize: 'h-10.5 ipad:h-15' },
  vitalism: { icon: '/imgs/investments/sponsors/vitalism.png', size: 'h-10', mobileSize: 'h-7.5 ipad:h-10' },
  'longevity-science-foundation': {
    icon: '/imgs/investments/sponsors/longevity-science.png',
    size: 'h-12',
    mobileSize: 'h-8 ipad:h-12',
  },
  'sundial-initiative': {
    icon: '/imgs/investments/sponsors/sundial-initiative.webp',
    size: 'h-12',
    mobileSize: 'h-8 ipad:h-12',
  },
  'timepie-longevity-forum': { icon: '/imgs/investments/sponsors/time-pie.png', size: 'h-15', mobileSize: 'h-10.5 ipad:h-14' },
};

const lab = (slug: string): SpectrumLinkData => {
  const { title, url, routeKey } = bySlug(LABS, slug, 'spectrumData');
  return { label: title, link: url, ...(routeKey && { routeKey }) };
};

const LINKS: Record<string, SpectrumLinkData[]> = {
  'translation-publishing': BOOKS.map(({ slug, title, url }) => ({ label: title, link: url, ...BOOK_VIEW[slug] })),
  evangelism: ['influence-network', 'disease-management', 'longevity-trend-radar'].map(lab),
  'digital-twin': [lab('digital-twin')],
  'papers-reviews': PAPERS_BY_CITATIONS.map(({ title, url }) => ({ label: title, link: url })),
  'proudly-supporting': SPECTRUM_GRANTS.map((grant) => ({
    label: grant.spectrumLabel ?? grant.name,
    link: grant.url ?? '',
    ...SPONSOR_VIEW[grant.slug],
  })),
};

export const spectrumBaseData: SpectrumItemData[] = SPECTRUM_GROUPS.map(({ id, text }) => ({
  id,
  title: text.en,
  titleCn: text.zh ?? '',
  ...GROUP_VIEW[id],
  links: LINKS[id],
}));

export const getSpectrumJsonLd = (): WithContext<CollectionPage> => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  // The name and description his site serves here, word for word (2026-11-18: what his site serves stays).
  name: 'IMMORTAL DRAGONS Spectrum - Longevity Initiatives',
  url: absoluteUrl('/spectrum'),
  description:
    "Immortal Dragon's variety of longevity initiatives including translation, publishing, research papers, reviews, sponsorships, and digital twin projects.",
  hasPart: spectrumBaseData.map((item) => ({
    '@type': 'WebPageElement',
    name: `${item.title} (${item.titleCn})`,
    description: item.links.map((l) => l.label).join(', '),
  })),
});
