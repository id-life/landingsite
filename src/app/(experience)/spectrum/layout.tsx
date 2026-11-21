import React, { ReactNode } from 'react';
import Style from '@/app/(home)/_components/Style';
import ExperienceHeader from '@/components/site/ExperienceHeader';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { pageMeta } from '@/content/pages';
import { getSpectrumJsonLd } from '@/app/spectrum/_components/spectrumData';
import SpectrumSEO from '@/app/spectrum/_components/SpectrumSEO';
import JsonLd from '@/components/seo/JsonLd';
import HeroPreloads from '@/components/gl/HeroPreloads';

// Title topic and description from the content layer (src/content/pages.ts), shared with llms.txt.
const PAGE = pageMeta('spectrum');

// The owner's own tab title (src/content/pages.ts tabTitle), og:title the same, no keywords (SEO-06).
export const metadata: Metadata = buildMetadata(PAGE);

export default function SpectrumLayout({ children }: { children: ReactNode }) {
  const jsonLd = getSpectrumJsonLd();

  return (
    <>
      <HeroPreloads />
      <JsonLd data={jsonLd} />
      {/* His hidden Spectrum list, as his layout renders it (SpectrumSEO). */}
      <SpectrumSEO />
      <Style />
      <ExperienceHeader />
      {children}
    </>
  );
}
