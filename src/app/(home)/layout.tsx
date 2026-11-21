import React, { ReactNode } from 'react';
import ExperienceHeader from '@/components/site/ExperienceHeader';
import HomeProfile from '@/app/(home)/_components/HomeProfile';
import NewsArticle1 from '@/app/news/_components/NewsArticle1';
import Style from '@/app/(home)/_components/Style';
import type { Graph } from 'schema-dts';
import { ORG_DESCRIPTION, ORGANIZATION, WEBSITE } from '@/constants/entity';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { pageMeta } from '@/content/pages';
import PageSEOContent from '@/components/seo/PageSEOContent';
import JsonLd from '@/components/seo/JsonLd';
import HeroPreloads from '@/components/gl/HeroPreloads';

import type ForcedErrorGate from '@/components/common/ForcedErrorGate';

// Non-production test hook: ?force-error=route (src/components/common/ForcedErrorGate.tsx). The compile-time constant
// drops the require from a production build; this layout requires its own client file, so the framework lists it
// with this layout's chunks only.
const HomeErrorGate: typeof ForcedErrorGate | null =
  process.env.NEXT_PUBLIC_DEPLOY_ENV === 'production'
    ? null
    : // eslint-disable-next-line @typescript-eslint/no-require-imports -- a static import would survive into production
      require('@/components/common/forced-error-gate/home').default;

// The home title is the owner's own, "Immortal Dragons 不朽真龙" (question 5i); the description is the one his site serves
// for the home page, whole (question 12g). From the content layer (src/content/pages.ts), shared with llms.txt.
// Chinese intro for crawlers, from the 不朽真龙介绍 profile (previously a hidden 0×0 block).
const HOME_INTRO_CN = [
  '不朽真龙是一家投资激进延寿领域的使命驱动基金，致力于支持那些经济回报尚不明确、被主流资本忽视、但具备长期价值的突破性项目。',
  '不朽真龙的主要投资方向包括器官替换策略、3D 生物打印、基因疗法、人造子宫等。',
  '除投资之外，不朽真龙也翻译出版书籍、资助行业会议与学术机构、制作播客和媒体内容，从而支持抗衰科学研究，布道长寿理念与信仰。',
];

export const metadata: Metadata = buildMetadata(pageMeta('home'));

const jsonLd: Graph = {
  '@context': 'https://schema.org',
  '@graph': [ORGANIZATION, WEBSITE],
};

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* The page's h1 is the hero itself (HeroPoster: the wordmark and its tagline as drawn), so the crawler summary
          below starts at h2. The header, then the experience (whose music player is an early Tab stop). */}
      <ExperienceHeader />
      {HomeErrorGate && <HomeErrorGate where="route" />}
      {children}
      {/* His zero-height block, after the page as his layout places it. */}
      <NewsArticle1 />
      <PageSEOContent
        title="Immortal Dragons 不朽真龙"
        titleAs="h2"
        // His summary's intro, word for word (his three Chinese lines and his description); 12b, which once took the
        // other two lines out, was about a date he never published, not his own hidden text (lead, 2026-11-21).
        intro={[...HOME_INTRO_CN.map((text) => ({ text, lang: 'zh-CN' })), { text: ORG_DESCRIPTION, lang: 'en' }]}
      />
      {/* His hidden bilingual profile, placed where his layout places it (after the summary). */}
      <HomeProfile />
      <HeroPreloads />
      <JsonLd data={jsonLd} />
      <Style />
    </>
  );
}
