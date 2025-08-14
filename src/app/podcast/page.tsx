import React, { useMemo } from 'react';
import PodcastList from '@/app/podcast/_components/PodcastList';
import PodcastCover from '@/app/podcast/_components/PodcastCover';
import { PODCAST_METADATA, PODCAST_NAV_LIST, PodcastCategory } from '@/app/podcast/_components/constant';
import { PodcastSeries, WithContext } from 'schema-dts';
import type { Metadata } from 'next';

export const revalidate = 300; // 5min

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const { c } = searchParams;
  const id = c ?? PODCAST_NAV_LIST[0].id;
  return { ...PODCAST_METADATA[id] };
}

type SearchParams = { [key: string]: PodcastCategory | undefined };

const jsonLd: WithContext<PodcastSeries> = {
  '@context': 'https://schema.org',
  '@type': 'PodcastSeries',
  name: 'Immortal Dragons Podcast',
  description: 'Immortal Dragons is a purpose-driven longevity fund headquartered in Biopolis, Singapore.',
  url: 'https://www.id.life/podcast',
  image: 'https://cdn.id.life/audio/idfm_logo@small.webp',
  publisher: {
    '@type': 'Organization',
    name: 'Immortal Dragons',
  },
  hasPart: [
    {
      '@type': 'PodcastEpisode',
      episodeNumber: 1,
      name: 'E01 我们为何投资 Whole Body Replacement (1): 从克隆说起',
      url: 'https://www.id.life/podcast/6',
      datePublished: '2025/05/17',
      timeRequired: 'PT46M',
      associatedMedia: {
        '@type': 'MediaObject',
        contentUrl: 'https://cdn.id.life/audio/podcast/id_ep01.mp3',
      },
      description:
        '近期，不朽真龙 Immortal Dragons 完成了对一家 Whole Body Replacement 领域的公司的投资。Whole Body Replacement，可以称为全身替换。这也符合不朽真龙的一个投资主题：修复不如替换（Replace Not Repair）。那么全身替换怎么做？技术有何可行性？这一系列节目跟大家讨论这几个话题。',
    },
    {
      '@type': 'PodcastEpisode',
      episodeNumber: 2,
      name: 'E02 你的衰老时钟一刻不停，但或许可以跑赢时间♾️ Brian Kennedy: 我们对长寿探索已走到何处 | 他山之石',
      url: 'https://www.id.life/podcast/7',
      datePublished: '2025/05/18',
      timeRequired: 'PT29M',
      associatedMedia: {
        '@type': 'MediaObject',
        contentUrl: 'https://cdn.id.life/audio/podcast/id_ep02.mp3',
      },
      description:
        '你的身体比实际年龄更衰老还是更年轻？在与时间赛跑的过程中，你的「生物学年龄」不一定是你身份证上的实际年龄！而前者才能更准确地预测你的真实衰老速度。本期是长寿专家 Brian Kennedy 在 2024 年的经典演讲，通过对比不同类型生物时钟的准确性，Brian Kennedy 教授提供了临床评估干预措施有效性的全新视角，对于人类能否真正逆转衰老，他也给出了对未来乐观但谨慎的预测。',
    },
    {
      '@type': 'PodcastEpisode',
      episodeNumber: 3,
      name: 'E03 当今在世者中将有大批人活到1000岁♾️ Aubrey de Grey: 终结衰老的路线图 | 他山之石',
      url: 'https://www.id.life/podcast/8',
      datePublished: '2025/05/19',
      timeRequired: 'PT24M',
      associatedMedia: {
        '@type': 'MediaObject',
        contentUrl: 'https://cdn.id.life/audio/podcast/id_ep03.mp3',
      },
      description:
        '我们常把「长命百岁」作为一句真挚的祝福，但如果有人告诉你，当今在世的人群中，将有相当一部分能活到1000岁，你会相信吗？本期他山之石的嘉宾是抗衰老研究先驱 Aubrey de Grey，他提出的「七大衰老损伤」理论已成为长寿研究的经典框架。，早在18年前，他就大胆预测，人类的技术发展将在几十年内追赶上长寿逃逸速度，甚至达到"无限寿命"的突破。',
    },
    {
      '@type': 'PodcastEpisode',
      episodeNumber: 4,
      name: 'E04 如果进化能创造永生基因，为什么却选择了衰老 ♾️ Peter Lidsky: 寻找衰老的统一理论范式 | 他山之石',
      url: 'https://www.id.life/podcast/7',
      datePublished: '2025/06/01',
      timeRequired: 'PT52M',
      associatedMedia: {
        '@type': 'MediaObject',
        contentUrl: 'https://cdn.id.life/audio/podcast/id_ep04.mp3',
      },
      description:
        '如果在医学会议上，你问一群顶尖专家"什么是癌症"或"什么是糖尿病"，他们却给出了截然不同的答案，这是不是很荒谬？但这正是衰老研究领域的现状。面对"什么是衰老"这个根本问题，每位专家的回答都不相同。本期他山之石，Peter Lidsky 博士将为我们展示一个颠覆性的观点：衰老可能不是随机损伤的积累，而是一套精密设计的"病原体控制程序"。',
    },
  ],
};

export default async function PodcastPage({ searchParams }: { searchParams: SearchParams }) {
  const { c } = searchParams;
  const category = useMemo(() => c ?? PODCAST_NAV_LIST[0].id, [c]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mt-2">
        <PodcastCover category={category} />
        <div className="mt-8.5 h-px bg-gray-950/20 mobile:mt-7.5" />
        <div className="my-15 mobile:my-9">
          <PodcastList category={category} />
        </div>
      </div>
    </>
  );
}
