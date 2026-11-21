'use client';

import React, { KeyboardEvent, MouseEvent, ReactNode, useState } from 'react';
import dynamic from 'next/dynamic';
import { clsx } from 'clsx';
import { eventBus } from '@/components/event-bus/eventBus';
import { MessageType } from '@/components/event-bus/messageType';
import { track } from '@/lib/analytics/track';

// Comments are fetched from the API in the browser; their code and request wait until the tab is opened.
const PodcastComments = dynamic(() => import('@/app/podcast/[id]/_components/PodcastComments'), { ssr: false });

const TABS = ['时间轴', '评论'] as const;

type PodcastContentTabProps = {
  /** Episode id, for the comments request and the analytics events. */
  id: string;
  /** The transcript, rendered to markup on the server (src/app/podcast/[id]/page.tsx). */
  children: ReactNode;
  /** The transcript's language when it is not the page's (ENG-03: zh-CN for a Chinese transcript). */
  transcriptLang?: string;
};

/** "mm:ss" or "h:mm:ss" in seconds. */
const toSeconds = (param: string) => param.split(':').reduce((total, part) => total * 60 + (Number(part) || 0), 0);

/**
 * The transcript and comments tabs. The transcript markdown is rendered on the server; the only script it needs
 * is one delegated click handler for its @[timeline](mm:ss) markers (span.custom-timeline), which seek the
 * player. It used to run react-markdown and its plugins in the browser.
 */
export default function PodcastContentTab({ id, children, transcriptLang }: PodcastContentTabProps) {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [commentsOpened, setCommentsOpened] = useState(false);
  // The comments load the first time their tab is shown; set while rendering, not in an effect.
  if (activeTab === 1 && !commentsOpened) setCommentsOpened(true);

  const handleTranscriptClick = (event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) => {
    const marker = (event.target as Element).closest?.('[data-custom-type]');
    if (!marker) return;
    const type = marker.getAttribute('data-custom-type');
    const param = marker.getAttribute('data-custom-param');
    if (type !== 'timeline' || !param) return;
    track('timeline_jump', { episode_id: id, position_s: toSeconds(param) });
    eventBus.next({ type: MessageType.PODCAST_DURATION, payload: param });
  };

  // A focused marker (role button) acts on Enter and Space, as a button does.
  const handleTranscriptKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    if (!(event.target as Element).closest?.('[data-custom-type]')) return;
    event.preventDefault();
    handleTranscriptClick(event);
  };

  // tab_select only for a real switch (DATA-11: the load-time section_view is gone).
  const selectTab = (index: number) => {
    if (index !== activeTab) track('tab_select', { tab: index === 0 ? 'detail' : 'comment', item_id: id });
    setActiveTab(index);
  };

  return (
    <div>
      {/* Two tabs: buttons (a Tab stop each, Enter and Space), named by their own text. */}
      <div className="flex gap-4" role="tablist">
        {TABS.map((tab, index) => (
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === index}
            key={index}
            onClick={() => selectTab(index)}
            className={clsx('podcast-tab-item relative flex cursor-pointer text-sm/3.5 font-bold', {
              'podcast-tab-active': activeTab === index,
            })}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="mt-7.5">
        <div className={clsx(activeTab === 0 ? 'block' : 'hidden')}>
          {/* One delegated handler for the markers (each a role="button" Tab stop): the box itself is not a control. */}
          <div
            role="presentation"
            lang={transcriptLang}
            className="markdown-body text-[0.875rem]/5 mobile:text-[0.75rem]/[1.125rem]"
            onClick={handleTranscriptClick}
            onKeyDown={handleTranscriptKey}
          >
            {children}
          </div>
        </div>
        <div className={clsx(activeTab === 1 ? 'block' : 'hidden')}>{commentsOpened && <PodcastComments id={id} />}</div>
      </div>
    </div>
  );
}
