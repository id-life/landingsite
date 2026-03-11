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
        <h1>
          <strong>不朽真龙</strong>
        </h1>
        <p>
          <strong>不朽真龙</strong>（Immortal
          Dragons）是一家来自新加坡、以延长人类健康寿命（healthspan）为核心使命的长寿基金会与生态构建者，
          <strong>不朽真龙</strong>聚焦长寿科学与前沿生物医药的长期发展，<strong>不朽真龙</strong>
          希望让更多关键探索在更长时间尺度上持续推进，推动更健康、更长寿的愿景从概念走向现实，形成属于<strong>不朽真龙</strong>
          的长期主义路径与实践体系。
        </p>
        <p>
          <strong>不朽真龙</strong>认为，长寿议题天然具有长周期、高不确定性与高门槛特征，<strong>不朽真龙</strong>
          因此不以短期回报最大化作为唯一标尺，<strong>不朽真龙</strong>
          更重视把资源投向更具长期价值与科学潜力的方向，让被忽视的关键环节不断档，让长寿科技的推进不被单一资本偏好所限制，形成
          <strong>不朽真龙</strong>所强调的使命驱动与系统推进。
        </p>
        <p>
          <strong>不朽真龙</strong>强调，延寿不是单点突破即可完成的任务，<strong>不朽真龙</strong>
          更倾向于用系统性布局覆盖从基础研究到临床转化的关键链路， <strong>不朽真龙</strong>
          通常会同时关注突破性前沿技术、加速成果落地的临床与转化基础设施、以及提升科研效率的工具与方法，通过并行投入来提升长寿领域整体成功概率与协同效率，帮助关键路径更快验证、更稳落地。
        </p>
        <p>
          <strong>不朽真龙</strong>也重视认知建设在长寿事业中的基础作用，<strong>不朽真龙</strong>
          相信长寿科技能否走向现实，不仅取决于实验室进展，也取决于社会理解与接纳，<strong>不朽真龙</strong>
          因此持续投入内容传播、翻译出版、媒体表达与社区连接，推动前沿长寿思想更可理解地进入公共讨论，促进跨学科人才与资源汇聚，形成更强的生态协同与知识流动。
        </p>
        <p>
          <strong>不朽真龙</strong>的核心目标是推动长寿科技更接近可验证、可转化、可落地的现实结果，<strong>不朽真龙</strong>
          相信真正的长期主义是在不确定性仍很高时仍愿意下注未来，<strong>不朽真龙</strong>
          希望通过持续投入与生态建设，把更多可能性推进为可实现，让更健康、更长寿的未来被看见、被参与、也被实现，最终回到
          <strong>不朽真龙</strong>所坚持的使命与方向。
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
