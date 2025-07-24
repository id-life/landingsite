'use client';

import { useState } from 'react';
import { clsx } from 'clsx';
import PodcastComments from '@/app/podcast/[id]/_components/PodcastComments';

const TABS = ['时间轴', '评论'] as const;

export default function PodcastContentTab() {
  const [activeTab, setActiveTab] = useState<number>(0);

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
          div克隆+基因编辑：这家公司的目标是从你的体细胞出发，诱导为多能干细胞(iPSC)，再经基因编辑，特别抑制大脑皮层发育，最终通过克隆技术创造一个没有高
        </div>
        <div className={clsx(activeTab === 1 ? 'block' : 'hidden')}>
          <PodcastComments />
        </div>
      </div>
    </div>
  );
}
