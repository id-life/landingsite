import { useEffect, useRef } from 'react';
import { horizontalLoop } from '../../utils/gsap'; // 导入 horizontalLoop 函数
import SoundLineSVG from '../svg/SoundLineSVG';
import { cn } from '@/utils';
import { useAtom } from 'jotai';
import { soundOffAtom } from '@/atoms';
// 创建一个新的组件来封装 <li> 和 <SoundLineSVG />
function SoundLineItem() {
  return (
    <li>
      <SoundLineSVG />
    </li>
  );
}

export default function ToggleSoundButton({ className }: { className?: string }) {
  const list1Ref = useRef<HTMLUListElement>(null);
  const list2Ref = useRef<HTMLUListElement>(null);
  const tl1Ref = useRef<GSAPTimeline | null>(null);
  const tl2Ref = useRef<GSAPTimeline | null>(null);
  const [soundOff, setSoundOff] = useAtom(soundOffAtom);

  useEffect(() => {
    if (soundOff) {
      tl1Ref?.current && tl1Ref.current?.pause();
      tl2Ref?.current && tl2Ref.current?.pause();
      return;
    } else if (tl1Ref?.current && tl2Ref?.current) {
      tl1Ref.current?.resume();
      tl2Ref.current?.resume();
      return;
    }

    const listEle = list1Ref.current;
    if (listEle) {
      tl1Ref.current = horizontalLoop(listEle.childNodes, {
        repeat: -1, // 无限循环
        speed: 0.1,
        reversed: true,
      });
    }
    const list2Ele = list2Ref.current;
    if (list2Ele) {
      tl2Ref.current = horizontalLoop(list2Ele.childNodes, {
        repeat: -1, // 无限循环
        speed: 0.2,
      });
    }
  }, [soundOff]);

  return (
    <div
      className={cn(
        'group flex cursor-pointer items-center gap-0.5 rounded-full bg-foreground px-2 py-1 transition duration-300 hover:scale-110',
        className,
      )}
      onMouseEnter={() => {
        tl1Ref?.current && tl1Ref.current?.pause();
        tl2Ref?.current && tl2Ref.current?.pause();
      }} // 鼠标悬停时播放动画
      onMouseLeave={() => {
        tl1Ref?.current && tl1Ref.current?.resume();
        tl2Ref?.current && tl2Ref.current?.resume();
      }} // 鼠标离开时暂停动画
      onClick={() => {
        setSoundOff((pre) => !pre);
      }}
    >
      <div className="relative flex h-5 w-10 items-center overflow-hidden">
        <SoundLineSVG className={cn('hidden h-2 w-full', { block: soundOff })} isOff />
        <ul className={cn('flex items-center', { hidden: soundOff })} ref={list1Ref}>
          <SoundLineItem />
          <SoundLineItem />
          <SoundLineItem />
          <SoundLineItem />
        </ul>
        <ul
          className={cn('absolute inset-0 flex translate-y-0.5 rotate-180 items-center opacity-50', { hidden: soundOff })}
          ref={list2Ref}
        >
          <SoundLineItem />
          <SoundLineItem />
          <SoundLineItem />
          <SoundLineItem />
        </ul>
      </div>
      <p className="w-6 font-poppins text-xs/3.5 font-semibold uppercase text-background">{soundOff ? 'off' : 'on'}</p>
    </div>
  );
}
