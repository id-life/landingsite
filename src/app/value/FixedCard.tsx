'use client';

import { clsx } from 'clsx';
import { useMemo, CSSProperties } from 'react';

type CardItemProps = {
  cover?: string;
  title?: string;
  desc?: string;
  createTime?: string;
  className?: string;
  style?: CSSProperties;
};

function CardItem({ cover, title, desc, createTime, className, style }: CardItemProps) {
  return (
    <div
      style={style}
      className={clsx('page-value-card-item clip-box relative w-[23.125rem] shadow-lg backdrop-blur', className)}
    >
      <div className="h-[13.5rem] w-full">
        <img src={cover} className="h-full object-cover" alt="cover" />
      </div>
      <div className="p-6">
        <p className="text-base/4 font-semibold text-white">{title}</p>
        <p className="mt-2.5 line-clamp-2 text-sm/4 text-white">{desc}</p>
        <p className="mt-4 text-xs/3 text-white/60">{createTime}</p>
      </div>
    </div>
  );
}

export default function FixedCard() {
  const content = useMemo(
    () => [
      {
        cover: '/imgs/tracking-01.webp',
        title: 'Super Mario 3D World',
        desc: 'Ambrus Studio was founded by Johnson, ex-CEO of Asia, Riot Games. First Ga...',
        createTime: 'Aug 16, 2022',
      },
      {
        cover: '/imgs/tracking-01.webp',
        title: 'Super Mario 3D World',
        desc: 'Ambrus Studio was founded by Johnson, ex-CEO of Asia, Riot Games. First Ga...',
        createTime: 'Aug 16, 2022',
      },
      {
        cover: '/imgs/tracking-01.webp',
        title: 'Super Mario 3D World',
        desc: 'Ambrus Studio was founded by Johnson, ex-CEO of Asia, Riot Games. First Ga...',
        createTime: 'Aug 16, 2022',
      },
      {
        cover: '/imgs/tracking-01.webp',
        title: 'Super Mario 3D World',
        desc: 'Ambrus Studio was founded by Johnson, ex-CEO of Asia, Riot Games. First Ga...',
        createTime: 'Aug 16, 2022',
      },
      {
        cover: '/imgs/tracking-01.webp',
        title: 'Super Mario 3D World',
        desc: 'Ambrus Studio was founded by Johnson, ex-CEO of Asia, Riot Games. First Ga...',
        createTime: 'Aug 16, 2022',
      },
      {
        cover: '/imgs/tracking-01.webp',
        title: 'Super Mario 3D Wforld',
        desc: 'Ambrus Studio was founded by Johnson, ex-CEO of Asia, Riot Games. First Ga...',
        createTime: 'Aug 16, 2022',
      },
    ],
    [],
  );
  return (
    <div className="page-value-card fixed top-1/3 z-20 flex gap-8">
      {content.map((item, index) => (
        <CardItem key={index} cover={item.cover} title={item.title} desc={item.desc} createTime={item.createTime} />
      ))}
    </div>
  );
}
