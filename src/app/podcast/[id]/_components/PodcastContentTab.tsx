'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { clsx } from 'clsx';
import PodcastComments from '@/app/podcast/[id]/_components/PodcastComments';
import Markdown, { Components } from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import '@/styles/components/markdown-timeline.css';
import { PodcastItem } from '@/apis/types';
import { eventBus } from '@/components/event-bus/eventBus';
import { MessageType } from '@/components/event-bus/messageType';
import { useGA } from '@/hooks/useGA';
import { GA_EVENT_LABELS, GA_EVENT_NAMES } from '@/constants/ga';

const TABS = ['时间轴', '评论'] as const;

type PodcastContentTabProps = {
  data: PodcastItem;
};

export default function PodcastContentTab({ data }: PodcastContentTabProps) {
  const { trackEvent } = useGA();
  const [activeTab, setActiveTab] = useState<number>(0);
  const episode = useMemo(() => `${data.category.split('_')[1]}_${data.title}`, [data]);

  const processedContent = data.transcript?.replace(/@\[(\w+)]\(([^)]+)\)/g, (match, type, param) => {
    return `<span data-custom-type="${type}" data-custom-param="${param}" class="custom-timeline">${param}</span>`;
  });

  const handleCustomElementClick = (type: string, param: string) => {
    if (type === 'timeline') {
      trackEvent({ name: GA_EVENT_NAMES.TIMELINE_JUMP, label: param, podcast_episode: episode });
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

  useEffect(() => {
    const label = activeTab === 0 ? GA_EVENT_LABELS.SECTION_VIEW.DETAIL : GA_EVENT_LABELS.SECTION_VIEW.COMMENT;
    trackEvent({ name: GA_EVENT_NAMES.SECTION_VIEW, label, podcast_episode: episode });
  }, [activeTab, episode, trackEvent]);

  return (
    <div>
      <div className="flex gap-4">
        {TABS.map((tab, index) => (
          <div
            key={index}
            onClick={() => setActiveTab(index)}
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
            <Markdown components={components} rehypePlugins={[rehypeRaw, remarkGfm]}>
              {processedContent}
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
