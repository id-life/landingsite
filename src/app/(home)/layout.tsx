import React, { ReactNode } from 'react';
import ClientNav from '@/components/nav/CilentNav';
import Style from '@/app/(home)/_components/Style';
import type { Graph } from 'schema-dts';
import { ORG_DESCRIPTION, ORGANIZATION, WEBSITE } from '@/constants/entity';
import NewsArticle1 from '@/app/news/_components/NewsArticle1';
import type { Metadata } from 'next';
import PageSEOContent from '@/components/seo/PageSEOContent';
import HomeProfile from '@/app/(home)/_components/HomeProfile';

// Chinese intro for crawlers, from the 不朽真龙介绍 profile (previously a hidden 0×0 block).
const HOME_INTRO_CN = [
  '不朽真龙是一家投资激进延寿领域的使命驱动基金，致力于支持那些经济回报尚不明确、被主流资本忽视、但具备长期价值的突破性项目。',
  '不朽真龙的主要投资方向包括器官替换策略、3D 生物打印、基因疗法、人造子宫等。',
  '除投资之外，不朽真龙也翻译出版书籍、资助行业会议与学术机构、制作播客和媒体内容，从而支持抗衰科学研究，布道长寿理念与信仰。',
];

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  title: 'Immortal Dragons 不朽真龙',
  description: ORG_DESCRIPTION,
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
    title: 'Immortal Dragons 不朽真龙',
    siteName: 'Immortal Dragons',
    description: ORG_DESCRIPTION,
    images: [
      {
        url: 'https://resources.id.life/id-life-cover-2.webp',
      },
    ],
  },
};

const jsonLd: Graph = {
  '@context': 'https://schema.org',
  '@graph': [ORGANIZATION, WEBSITE],
};

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PageSEOContent
        title="Immortal Dragons 不朽真龙"
        intro={[...HOME_INTRO_CN.map((text) => ({ text, lang: 'zh-CN' })), { text: ORG_DESCRIPTION, lang: 'en' }]}
      />
      <HomeProfile />
      <link rel="prefetch" crossOrigin="anonymous" href="/assets/draco/draco_decoder.wasm" />
      <link rel="prefetch" crossOrigin="anonymous" href="/assets/draco/draco_wasm_wrapper.js" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Style />
      <ClientNav />
      {children}
      <NewsArticle1 />
    </>
  );
}
