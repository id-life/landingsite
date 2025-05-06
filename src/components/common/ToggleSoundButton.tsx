import { mobileNavOpenAtom } from '@/atoms';
import { STORAGE_KEY } from '@/constants/storage';
import { useIsMounted } from '@/hooks/useIsMounted';
import { cn } from '@/utils';
import { useAtomValue } from 'jotai';
import { useCallback, useEffect, useRef, useState } from 'react';
import { isSafari } from 'react-device-detect';
import { useLocalStorage } from 'react-use';
import { horizontalLoop } from '../../utils/gsap'; // 导入 horizontalLoop 函数
import SoundLineSVG from '../svg/SoundLineSVG';

function SoundLineItem() {
  return (
    <li>
      <SoundLineSVG />
    </li>
  );
}

export default function ToggleSoundButton({ className }: { className?: string }) {
  const mobileNavOpen = useAtomValue(mobileNavOpenAtom);

  const list1Ref = useRef<HTMLUListElement>(null);
  const list2Ref = useRef<HTMLUListElement>(null);
  const tl1Ref = useRef<GSAPTimeline | null>(null);
  const tl2Ref = useRef<GSAPTimeline | null>(null);
  const [soundOff, setSoundOff] = useLocalStorage(STORAGE_KEY.SOUND_OFF, false);
  const isMounted = useIsMounted();

  const audioRef = useRef<HTMLAudioElement>(null);
  const [canAutoPlay, setCanAutoPlay] = useState(true);

  const handleUserInteraction = useCallback(() => {
    if (!audioRef.current || canAutoPlay) return;
    audioRef.current.volume = 0.3;
    audioRef.current?.play().then();
    window.removeEventListener('click', handleUserInteraction);
  }, [canAutoPlay]);

  useEffect(() => {
    if (!isMounted || soundOff) return;

    try {
      audioRef.current?.play().catch(() => {
        setCanAutoPlay(false);
        console.log('autoplay error');
      });
    } catch (error) {
      console.log('播放操作异常', error);
    }

    window.addEventListener('click', handleUserInteraction);

    return () => {
      window.removeEventListener('click', handleUserInteraction);
    };
  }, [handleUserInteraction, isMounted, soundOff]);

  useEffect(() => {
    if (audioRef.current) {
      soundOff ? audioRef.current.pause() : isSafari ? null : audioRef.current?.play();
    }
    // button animation
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
    <>
      <div
        className={cn(
          'sound-button group flex cursor-pointer items-center gap-0.5 rounded-full bg-foreground px-2 py-1 transition duration-300 hover:scale-110',
          mobileNavOpen && 'bg-white',
          className,
        )}
        onClick={() => {
          setSoundOff(!soundOff);
        }}
        style={
          {
            '--background': mobileNavOpen ? 'black' : undefined,
          } as React.CSSProperties
        }
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
      <audio
        ref={audioRef}
        className="bottom-0-0 invisible fixed left-0 size-0.5"
        src="https://cdn.id.life/id-bgm-01.mp3"
        // autoPlay
        loop
      />
    </>
  );
}
