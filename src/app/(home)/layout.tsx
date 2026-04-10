import React, { ReactNode } from 'react';
import ClientNav from '@/components/nav/CilentNav';
import Style from '@/app/(home)/_components/Style';
import { Organization, WithContext } from 'schema-dts';
import NewsArticle1 from '@/app/news/_components/NewsArticle1';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Immortal Dragons 不朽真龙',
  description:
    'Immortal Dragons is a purpose-driven longevity fund headquartered in Singapore. Its investment themes include replacement strategy, 3D bioprinting, gene therapy, artificial womb, longevity special economic zones, and LP positions in other long-bio funds. Beyond conventional capital investment, Immortal Dragons also engages in book translation and publishing, delivers talks and produces podcasts, sponsors events and initiatives, and collaborates on research projects.',
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
    description:
      'Immortal Dragons is a purpose-driven longevity fund headquartered in Singapore. Its investment themes include replacement strategy, 3D bioprinting, gene therapy, artificial womb, longevity special economic zones, and LP positions in other long-bio funds. Beyond conventional capital investment, Immortal Dragons also engages in book translation and publishing, delivers talks and produces podcasts, sponsors events and initiatives, and collaborates on research projects.',
    images: [
      {
        url: 'https://resources.id.life/id-life-cover-2.webp',
      },
    ],
  },
};

const jsonLd: WithContext<Organization> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  url: 'https://www.id.life',
  logo: 'https://resources.id.life/logo.png',
  name: 'Immortal Dragons',
  alternateName: '不朽真龙',
  description:
    'Immortal Dragons is a purpose-driven longevity fund headquartered in Singapore. Its investment themes include replacement strategy, 3D bioprinting, gene therapy, artificial womb, longevity special economic zones, and LP positions in other long-bio funds. Beyond conventional capital investment, Immortal Dragons also engages in book translation and publishing, delivers talks and produces podcasts, sponsors events and initiatives, and collaborates on research projects.',
  email: 'dragons@id.life',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '3 Biopolis Dr, #01-15',
    addressLocality: 'Singapore',
    addressCountry: 'SG',
    postalCode: '537846',
  },
};

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div data-nosnippet style={{ width: 0, height: 0, overflow: 'hidden', display: 'block' }}>
        <p>
          <strong>不朽真龙</strong>
          是一家投资长生不老领域的使命驱动基金，致力于支持那些经济回报尚不明确、被主流资本忽视、但具备长期价值的突破性项目。
        </p>

        <p>
          <strong>不朽真龙</strong>的主要投资方向包括器官替换策略、3D 生物打印、基因疗法、人造子宫等。
        </p>

        <p>
          除投资之外，<strong>不朽真龙</strong>
          也翻译出版书籍、资助行业会议与学术机构、制作播客和媒体内容，从而支持抗衰科学研究，布道长寿理念与信仰。
        </p>
      </div>
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
