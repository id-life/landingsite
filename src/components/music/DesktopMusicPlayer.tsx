import React, { useState } from 'react';
import { clsx } from 'clsx';
import * as Popover from '@radix-ui/react-popover';
import PlaySVG from '@/../public/svgs/player/play.svg?component';
import PauseSVG from '@/../public/svgs/player/pause.svg?component';
import DesktopMusicContent from './DesktopMusicContent';

function DesktopMusicPlayer({ className }: { className?: string }) {
  const [playStatus, setPlayStatus] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleChangePlayStatus = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setPlayStatus(!playStatus);
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <div
          onClick={() => setIsOpen((v) => !v)}
          className={clsx(
            'flex w-71 cursor-pointer gap-2.5 rounded-full bg-foreground px-2 py-1 transition duration-300 hover:scale-110',
            className,
          )}
        >
          <div className="flex-1"></div>
          <div className="w-37 truncate text-xs/3.5 font-semibold text-background">我们为何投资 Whole Body Replacement</div>
          <div onClick={handleChangePlayStatus} className="size-4">
            {playStatus ? <PlaySVG className="w-full fill-background" /> : <PauseSVG className="w-full fill-background" />}
          </div>
        </div>
      </Popover.Trigger>
      <Popover.Anchor className={clsx('pointer-events-none h-6.5 w-71', className)} />
      <Popover.Portal>
        <Popover.Content align="end" sideOffset={16} className="z-10 w-100 rounded-lg border-2 border-white bg-[#cbd6ea] p-5">
          <DesktopMusicContent />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export default React.memo(DesktopMusicPlayer);
