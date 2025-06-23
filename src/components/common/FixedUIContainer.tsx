'use client';

import React from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import Logo from '@/components/nav/Logo';
import SubscribeBorderSVG from '@/../public/svgs/subscribe-border.svg?component';
import { useGA } from '@/hooks/useGA';
import { GA_EVENT_LABELS, GA_EVENT_NAMES } from '@/constants/ga';
import Dialog from '../dialog';
import SubscribeDialog from '../dialog/SubscribeDialog';
import { useState } from 'react';
import { useAtom } from 'jotai';
import { mobileNavOpenAtom } from '@/atoms';
import MenuOpenSVG from '../svg/MenuOpenSVG';
import MobileNavDialog from '../dialog/MobileNavDialog';
import BorderSVG from '@/../public/svgs/border.svg?component';
import YoutubeSVG from '@/../public/svgs/youtube.svg?component';
import LinkedinSVG from '@/../public/svgs/linkedin.svg?component';
import MediaSVG from '@/../public/svgs/media.svg?component';
import { MediaLinkType, MediaLinkTypeKey } from '../layout/footer/FooterContact';
import DesktopAudioPlayer from '../audio/DesktopAudioPlayer';
import MobileAudioPlayer from '../audio/MobileAudioPlayer';
import FixedParticles from './FixedParticles';

const DesktopHeader = ({ onSubscribeClick, children }: { onSubscribeClick: () => void; children?: React.ReactNode }) => (
  <div id="overlay-nav" className="fixed left-0 top-0 z-[70] flex w-full items-center p-10 text-white">
    <Logo />
    {children}
    <div className="flex h-12 flex-1 justify-end">
      <div
        onClick={onSubscribeClick}
        className="group relative flex h-12 w-51.5 cursor-pointer items-center justify-center text-sm font-semibold uppercase duration-300 hover:stroke-red-600 hover:text-red-600"
      >
        <SubscribeBorderSVG className="absolute left-0 top-0 size-full stroke-white duration-300 group-hover:stroke-red-600" />
        Subscribe
      </div>
    </div>
  </div>
);

const MobileHeader = ({
  onSubscribeClick,
  showMenuButton = false,
}: {
  onSubscribeClick: () => void;
  showMenuButton?: boolean;
}) => {
  const [menuOpen, setMenuOpen] = useAtom(mobileNavOpenAtom);
  return (
    <div id="mobile-overlay-nav" className="fixed left-0 top-0 z-[70] flex w-full items-center p-5 text-white">
      <Logo />
      <div className="flex h-auto flex-1 items-center justify-end">
        <div
          onClick={onSubscribeClick}
          className="group relative flex h-8 w-24 cursor-pointer items-center justify-center text-xs/5 font-semibold uppercase duration-300"
        >
          <SubscribeBorderSVG className="absolute left-0 top-0 size-full stroke-white duration-300" />
          Subscribe
        </div>
        {showMenuButton && (
          <div className="ml-5" onClick={() => setMenuOpen(true)}>
            <MenuOpenSVG className="h-10" />
          </div>
        )}
      </div>
      {showMenuButton && <MobileNavDialog />}
    </div>
  );
};

const BottomUI = ({ onMediaClick }: { onMediaClick: (type: MediaLinkTypeKey) => void }) => {
  const isMobile = useIsMobile();
  return isMobile ? (
    <div className="fixed bottom-5 right-5 z-[70]">
      <MobileAudioPlayer />
    </div>
  ) : (
    <>
      <div className="fixed bottom-9 left-10 z-[70]">
        <div className="flex gap-4">
          <div
            onClick={() => onMediaClick(MediaLinkType.Youtube)}
            className="flex-center group relative h-10 w-10 cursor-pointer"
          >
            <BorderSVG className="absolute left-0 top-0 h-full w-full stroke-white group-hover:stroke-red-600" />
            <YoutubeSVG className="size-6 fill-white group-hover:fill-red-600" />
          </div>
          <div
            onClick={() => onMediaClick(MediaLinkType.Linkedin)}
            className="flex-center group relative h-10 w-10 cursor-pointer"
          >
            <BorderSVG className="absolute left-0 top-0 h-full w-full stroke-white group-hover:stroke-red-600" />
            <LinkedinSVG className="size-6 fill-white group-hover:fill-red-600" />
          </div>
          <div
            onClick={() => onMediaClick(MediaLinkType.Media)}
            className="flex-center group relative h-10 w-10 cursor-pointer"
          >
            <BorderSVG className="absolute left-0 top-0 h-full w-full stroke-white group-hover:stroke-red-600" />
            <MediaSVG className="size-6 fill-white group-hover:fill-red-600" />
          </div>
        </div>
      </div>
      <div className="fixed bottom-9 right-10 z-[70]">
        <DesktopAudioPlayer />
      </div>
    </>
  );
};

export default function FixedUIContainer({
  children,
  showNavLinks = false,
}: {
  children?: React.ReactNode;
  showNavLinks?: boolean;
}) {
  const isMobile = useIsMobile();
  const [isSubscribeDialogOpen, setIsSubscribeDialogOpen] = useState(false);
  const { trackEvent } = useGA();

  const onSubscribeClick = () => {
    trackEvent({ name: GA_EVENT_NAMES.SUBSCRIBE_LETTER, label: GA_EVENT_LABELS.SUBSCRIBE_LETTER.NAV });
    setIsSubscribeDialogOpen(true);
  };

  const onMediaClick = (type: MediaLinkTypeKey) => {
    trackEvent({
      name: GA_EVENT_NAMES.MEDIUM_CLICK,
      label: GA_EVENT_LABELS.MEDIUM_CLICK[type.toUpperCase() as Uppercase<MediaLinkTypeKey>],
    });
    if (type === MediaLinkType.Youtube) window.open('https://www.youtube.com/@Immortal-Dragons', '__blank');
    if (type === MediaLinkType.Linkedin) window.open('https://www.linkedin.com/company/immortaldragons/', '__blank');
    if (type === MediaLinkType.Media)
      window.open('https://drive.google.com/drive/folders/1vajrjCq-nAX1LVSzJ_fETL2GKI0-ckrG', '__blank');
  };

  return (
    <>
      <FixedParticles />
      {isMobile ? (
        <MobileHeader onSubscribeClick={onSubscribeClick} showMenuButton={showNavLinks} />
      ) : (
        <DesktopHeader onSubscribeClick={onSubscribeClick}>{showNavLinks && children}</DesktopHeader>
      )}
      <BottomUI onMediaClick={onMediaClick} />
      <Dialog
        open={isSubscribeDialogOpen}
        onOpenChange={setIsSubscribeDialogOpen}
        render={({ close }) => <SubscribeDialog handleSubmit={close} />}
        isDismiss
      />
    </>
  );
}
