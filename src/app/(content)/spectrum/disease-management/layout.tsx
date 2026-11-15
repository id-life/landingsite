import React, { ReactNode } from 'react';
import DMStyle from '@/app/spectrum/_components/DMStyle';
import '@/styles/components/disease-management-page.css';
import SpectrumHeader from '@/app/spectrum/_components/SpectrumHeader';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbJsonLd, WEBSITE_ID } from '@/constants/entity';
import PageSEOContent from '@/components/seo/PageSEOContent';
import { MedicalWebPage, WithContext } from 'schema-dts';
import JsonLd from '@/components/seo/JsonLd';

const PAGE_TITLE = 'Disease Management & Cure Status';
const PAGE_DESCRIPTION = '可治疗与可控制疾病列表 A list of curable and manageable diseases';

// Title "<topic> | Immortal Dragons" in one language, og:title without the brand, no keywords (SEO-06).
export const metadata: Metadata = buildMetadata({
  path: '/spectrum/disease-management',
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
});

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
      <JsonLd data={[jsonLd, breadcrumb]} />
      {/* The page's one h1 (it used to inherit the Spectrum section's), until the visible content layer ships. */}
      <PageSEOContent title={PAGE_TITLE} intro={[PAGE_DESCRIPTION]} />
      <DMStyle />
      <SpectrumHeader />
      <div className="hide-scrollbar disease-management-content flex-1 overflow-y-auto px-10 pb-10 opacity-0 mobile:px-5 mobile:pb-5">
        {children}
      </div>
      <div className="base-background base-background1 fixed left-0 top-0 -z-10 h-screen w-screen" />
    </div>
  );
}
