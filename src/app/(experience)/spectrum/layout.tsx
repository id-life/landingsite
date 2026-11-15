import React, { ReactNode } from 'react';
import Style from '@/app/(home)/_components/Style';
import ClientNav from '@/components/nav/CilentNav';
import type { Metadata } from 'next';
import PageSEOContent from '@/components/seo/PageSEOContent';
import { getSpectrumJsonLd, spectrumBaseData } from '@/app/spectrum/_components/spectrumData';
import JsonLd from '@/components/seo/JsonLd';
import HeroPreloads from '@/components/gl/HeroPreloads';

const PAGE_TITLE = 'Spectrum 谱系';
const PAGE_DESCRIPTION =
  "Explore Immortal Dragons' variety of longevity initiatives on insight sharing, sponsorships, literature translation and publication, podcast channel, digital twin and clinical intelligence.";

export const metadata: Metadata = {
  alternates: { canonical: '/spectrum' },
  // The two tool pages (/spectrum/disease-management, /spectrum/influence-network) live in the (content)
  // route group, so this layout, its experience nav and its JSON-LD no longer wrap them; they take the
  // root layout's title template.
  title: { default: PAGE_TITLE, template: '%s | Immortal Dragons 不朽真龙' },
  description: PAGE_DESCRIPTION,
  keywords: [
    'Longevity',
    'anti-aging',
    'life extension',
    'investment fund',
    'innovation',
    'biotech',
    'pharmaceutical',
    'healthcare',
    'Immortal Dragons',
  ],
  openGraph: {
    title: PAGE_TITLE,
    siteName: 'Immortal Dragons',
    description: PAGE_DESCRIPTION,
    images: [
      {
        url: 'https://resources.id.life/id-life-cover-2.webp',
      },
    ],
  },
};

export default function SpectrumLayout({ children }: { children: ReactNode }) {
  const jsonLd = getSpectrumJsonLd();

  return (
    <>
      <HeroPreloads />
      <JsonLd data={jsonLd} />
      {/* Same summary as the other section routes: one h1, the page description, the section's five headings
          and the item names it shows, with no links. The hidden link list that stood here (31 links, 28 of
          them external, aria-hidden) read as hidden link spam. */}
      <PageSEOContent
        title={PAGE_TITLE}
        intro={[PAGE_DESCRIPTION]}
        sections={spectrumBaseData.map((item) => ({
          heading: `${item.title} ${item.titleCn}`,
          items: item.links.map((link) => ({ title: link.label })),
        }))}
      />
      <Style />
      <ClientNav />
      {children}
    </>
  );
}
