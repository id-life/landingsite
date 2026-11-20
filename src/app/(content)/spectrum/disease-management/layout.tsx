import React, { ReactNode } from 'react';
import DMStyle from '@/app/spectrum/_components/DMStyle';
import '@/styles/components/disease-management-page.css';
import SiteHeader from '@/components/site/SiteHeader';
import HiddenSectionsNav from '@/components/site/HiddenSectionsNav';
import SubscribePopup from '@/components/layout/footer/SubscribePopup';
import SiteFooter from '@/components/site/SiteFooter';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { pageMeta } from '@/content/pages';
import { breadcrumbJsonLd, WEBSITE_ID } from '@/constants/entity';
import PageSEOContent from '@/components/seo/PageSEOContent';
import { MedicalWebPage, WithContext } from 'schema-dts';
import JsonLd from '@/components/seo/JsonLd';
import { getSpectrumJsonLd } from '@/app/spectrum/_components/spectrumData';

// Title topic and description from the content layer (src/content/pages.ts), shared with llms.txt.
const PAGE = pageMeta('disease-management');
const PAGE_TITLE = PAGE.title;
const PAGE_DESCRIPTION = PAGE.description;

// The owner's own tab title (src/content/pages.ts tabTitle), og:title the same, no keywords (SEO-06).
export const metadata: Metadata = buildMetadata(PAGE);

const jsonLd: WithContext<MedicalWebPage> = {
  '@context': 'https://schema.org',
  '@type': 'MedicalWebPage',
  name: PAGE_TITLE,
  url: 'https://www.id.life/spectrum/disease-management',
  description: PAGE_DESCRIPTION,
  medicalAudience: {
    '@type': 'MedicalAudience',
    audienceType: 'Patient',
  },
  isPartOf: { '@id': WEBSITE_ID },
};

const breadcrumb = breadcrumbJsonLd([
  { name: 'Spectrum', path: '/spectrum' },
  { name: 'Disease Management', path: '/spectrum/disease-management' },
]);

export default function DiseaseManagementLayout({ children }: { children: ReactNode }) {
  return (
    <div className="disease-management-page relative z-[100] flex h-screen flex-col overflow-y-auto bg-black">
      {/* His site serves the Spectrum section's own JSON-LD on this page too (it was nested in that section). */}
      <JsonLd data={[getSpectrumJsonLd(), jsonLd, breadcrumb]} />
      {/* The page's one h1 (it used to inherit the Spectrum section's), until the visible content layer ships. */}
      <PageSEOContent title={PAGE_TITLE} intro={[PAGE_DESCRIPTION]} />
      <DMStyle />
      <SiteHeader
        variant="solid"
        currentId="spectrum_page"
        currentKind="true"
        action="exit"
        className="relative p-10 mobile:p-5"
      />
      <HiddenSectionsNav />
      <SubscribePopup />
      <div className="hide-scrollbar disease-management-content flex-1 overflow-y-auto px-10 pb-10 opacity-0 mobile:px-5 mobile:pb-5">
        {children}
        <SiteFooter className="mt-15 text-white" />
      </div>
      <div className="base-background base-background1 fixed left-0 top-0 -z-10 h-screen w-screen" />
    </div>
  );
}
