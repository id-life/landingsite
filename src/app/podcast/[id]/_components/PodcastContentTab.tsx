'use client';

import React, { useState } from 'react';
import { clsx } from 'clsx';
import PodcastComments from '@/app/podcast/[id]/_components/PodcastComments';
import Markdown, { Components } from 'react-markdown';
import { markdownRehypePlugins, markdownRemarkPlugins, remarkTimeline } from '@/utils/markdown';
import '@/styles/components/markdown-timeline.css';
import { PodcastItem } from '@/apis/types';
import { eventBus } from '@/components/event-bus/eventBus';
import { MessageType } from '@/components/event-bus/messageType';
import { track } from '@/lib/analytics/track';

const TABS = ['时间轴', '评论'] as const;
// @[timeline](mm:ss) markers become clickable spans as syntax-tree nodes (remarkTimeline), then the shared
// sanitiser runs: transcript markup can no longer add script, handlers or attributes.
const transcriptRemarkPlugins = [...markdownRemarkPlugins, remarkTimeline];

type PodcastContentTabProps = {
  data: PodcastItem;
};

export default function PodcastContentTab({ data }: PodcastContentTabProps) {
  const [activeTab, setActiveTab] = useState<number>(0);

  const handleCustomElementClick = (type: string, param: string) => {
    if (type === 'timeline') {
      const positionS = String(param)
        .split(':')
        .reduce((total, part) => total * 60 + (Number(part) || 0), 0);
      track('timeline_jump', { episode_id: String(data.id), position_s: positionS });
      eventBus.next({ type: MessageType.PODCAST_DURATION, payload: param });
    }
  };

  const components: Components = {
    span: ({ node, ...props }) => {
      if (props.className === 'custom-timeline') {
        const type = (props as any)['data-custom-type'];
        const param = (props as any)['data-custom-param'];

        return (
          <span onClick={() => handleCustomElementClick(type, param)} {...props}>
            {param}
          </span>
        );
      }
      return <span {...props} />;
    },
  };

  // tab_select only for a real switch (DATA-05: the load-time section_view is gone).
  const selectTab = (index: number) => {
    if (index !== activeTab) track('tab_select', { tab: index === 0 ? 'detail' : 'comment', item_id: String(data.id) });
    setActiveTab(index);
  };

  return (
    <div>
      <div className="flex gap-4">
        {TABS.map((tab, index) => (
          <div
            key={index}
            onClick={() => selectTab(index)}
            className={clsx('podcast-tab-item relative flex cursor-pointer text-sm/3.5 font-bold', {
              'podcast-tab-active': activeTab === index,
            })}
          >
            {tab}
          </div>
        ))}
      </div>
      <div className="mt-7.5">
        <div className={clsx(activeTab === 0 ? 'block' : 'hidden')}>
          <div className="markdown-body">
            <Markdown components={components} remarkPlugins={transcriptRemarkPlugins} rehypePlugins={markdownRehypePlugins}>
              {data.transcript}
            </Markdown>
          </div>
        </div>
        <div className={clsx(activeTab === 1 ? 'block' : 'hidden')}>
          <PodcastComments id={data.id.toString()} />
        </div>
      </div>
    </div>
  );
}
