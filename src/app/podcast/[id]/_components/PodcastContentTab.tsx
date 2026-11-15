'use client';

import React, { MouseEvent, ReactNode, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { clsx } from 'clsx';
import { eventBus } from '@/components/event-bus/eventBus';
import { MessageType } from '@/components/event-bus/messageType';
import { useGA } from '@/hooks/useGA';
import { GA_EVENT_LABELS, GA_EVENT_NAMES } from '@/constants/ga';

// Comments are fetched from the API in the browser; their code and request wait until the tab is opened.
const PodcastComments = dynamic(() => import('@/app/podcast/[id]/_components/PodcastComments'), { ssr: false });

const TABS = ['时间轴', '评论'] as const;

type PodcastContentTabProps = {
  /** Episode id, for the comments request. */
  id: string;
  /** `<show>_<title>`, the episode label of the GA events. */
  episode: string;
  /** The transcript, rendered to markup on the server (src/app/podcast/[id]/page.tsx). */
  children: ReactNode;
};

/**
 * The transcript and comments tabs. The transcript markdown is rendered on the server; the only script it needs
 * is one delegated click handler for its @[timeline](mm:ss) markers (span.custom-timeline), which seek the
 * player. It used to run react-markdown and its plugins in the browser.
 */
export default function PodcastContentTab({ id, episode, children }: PodcastContentTabProps) {
  const { trackEvent } = useGA();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [commentsOpened, setCommentsOpened] = useState(false);
  // The comments load the first time their tab is shown; set while rendering, not in an effect.
  if (activeTab === 1 && !commentsOpened) setCommentsOpened(true);

  const handleTranscriptClick = (event: MouseEvent<HTMLDivElement>) => {
    const marker = (event.target as Element).closest?.('[data-custom-type]');
    if (!marker) return;
    const type = marker.getAttribute('data-custom-type');
    const param = marker.getAttribute('data-custom-param');
    if (type !== 'timeline' || !param) return;
    trackEvent({ name: GA_EVENT_NAMES.TIMELINE_JUMP, label: param, podcast_episode: episode });
    eventBus.next({ type: MessageType.PODCAST_DURATION, payload: param });
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
          <div className="markdown-body" onClick={handleTranscriptClick}>
            {children}
          </div>
        </div>
        <div className={clsx(activeTab === 1 ? 'block' : 'hidden')}>{commentsOpened && <PodcastComments id={id} />}</div>
      </div>
    </div>
  );
}
