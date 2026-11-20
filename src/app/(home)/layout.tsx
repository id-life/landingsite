import React, { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import ExperienceHeader from '@/components/site/ExperienceHeader';
import Style from '@/app/(home)/_components/Style';
import type { Graph } from 'schema-dts';
import { ORG_DESCRIPTION, ORGANIZATION, WEBSITE } from '@/constants/entity';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { pageMeta } from '@/content/pages';
import PageSEOContent from '@/components/seo/PageSEOContent';
import JsonLd from '@/components/seo/JsonLd';
import HeroPreloads from '@/components/gl/HeroPreloads';

// Non-production test hook: ?force-error=route (src/components/common/ForcedError.tsx). A production build drops
// this branch and its import while compiling, so no byte of the hook ships (the build's chunks are checked for it).
const ForcedError =
  process.env.NEXT_PUBLIC_DEPLOY_ENV === 'production' ? null : dynamic(() => import('@/components/common/ForcedError'));

// The home title is the owner's own, "Immortal Dragons 不朽真龙" (question 5i); the description is the one his site serves
// for the home page, whole (question 12g). From the content layer (src/content/pages.ts), shared with llms.txt.
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
      {ForcedError && <ForcedError where="route" />}
      {children}
      <PageSEOContent
        title="Immortal Dragons 不朽真龙"
        titleAs="h2"
        // Only the two focus statements his site serves in this summary, word for word ("Don't change the text regarding
        // this", question 12g). The rest of the Chinese intro his site served here (the fund's mission, its advocacy)
        // the home page does not show, so it comes out ("if I never put it in the website, then you shouldn't put it
        // in", question 12b).
        intro={[
          { text: '不朽真龙的主要投资方向包括器官替换策略、3D 生物打印、基因疗法、人造子宫等。', lang: 'zh-CN' },
          { text: ORG_DESCRIPTION, lang: 'en' },
        ]}
      />
      <HeroPreloads />
      <JsonLd data={jsonLd} />
      <Style />
    </>
  );
}
