'use client';

import MenuCloseSVG from '@/../public/svgs/menu-close.svg?component';
import SubscribeBorderSVG from '@/../public/svgs/subscribe-border.svg?component';
import BilingualText from '@/components/common/BilingualText';
import Dialog from '@/components/dialog';
import { NAV_LIST } from '@/components/nav/nav';
import { STORAGE_KEY } from '@/constants/storage';
import { track } from '@/lib/analytics/track';
import { playMenuItems } from '@/motion/menu';
import { getSectionState, goToSection } from '@/motion/sectionController';
import { useRouter } from 'next/navigation';
import { useEffect, type MouseEvent } from 'react';
import { isPlainClick, isSection, SITE_NAV } from './site-nav';
import SubscribeTrigger from './SubscribeTrigger';

const ITEM = 'flex-center mobile-nav-item relative py-6 text-white opacity-0 [@media(max-height:740px)]:py-4';

/**
 * The phone menu sheet of the site header (NAV-04), the same on every route: the seven sections, then News, Podcast
 * and About, with the current one marked (aria-current). Inside the experience a section tap moves through the
 * section controller; elsewhere every item is a same-tab navigation. Loaded on the first open.
 */
export default function SiteMenu({
  open,
  onOpenChange: setOpen,
  currentId,
  inExperience,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentId: string | null;
  inExperience: boolean;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => playMenuItems('.mobile-nav-item', true), 300);
    return () => clearTimeout(id);
  }, [open]);

  // Navigation starts on the tap; the menu's exit animation runs at the same time (it used to wait 600 ms, and a
  // tap during a theme transition was dropped).
  const onItem = (event: MouseEvent<HTMLAnchorElement>, item: (typeof SITE_NAV)[number]) => {
    if (!isPlainClick(event)) return;
    event.preventDefault();
    playMenuItems('.mobile-nav-item', false);
    setOpen(false);
    if (isSection(item)) track('nav_click', { target_section: item.id, source: 'mobile_menu' });
    if (inExperience && isSection(item)) {
      goToSection(item.id, 'menu');
      return;
    }
    // Leaving the experience for a content page: Back returns to the section the visitor left.
    if (inExperience) sessionStorage.setItem(STORAGE_KEY.MOBILE_RETURN_PAGE, NAV_LIST[getSectionState().index].id);
    router.push(item.href);
  };

  const sections = SITE_NAV.filter(isSection);

  return (
    <Dialog
      anim="slide"
      isDismiss
      // Focus starts on the first menu item, inside the sheet (its Subscribe and Close come first in the tab order).
      initialFocus={2}
      showCloseButton={false}
      overlayClassName="bg-black/60 backdrop-blur-sm"
      open={open}
      onOpenChange={setOpen}
      contentClassName="absolute left-0 top-0 w-full"
      render={({ close }) => (
        // Scrolls when ten items do not fit (short phones); items are tighter below 740 px of height.
        <div id="mobile-nav-menu" className="flex max-h-[100svh] w-full flex-col overflow-y-auto">
          <div className="flex flex-1 items-center justify-end gap-5 p-5">
            {/* One modal at a time: the menu closes, then the SUBSCRIBE dialog opens. */}
            <SubscribeTrigger
              onBeforeOpen={close}
              className="group relative flex h-10 w-33 cursor-pointer items-center justify-center text-label font-semibold uppercase text-white duration-300 tap data-[open=true]:text-accent mobile:h-8 mobile:w-24 mobile:text-caption"
            >
              <SubscribeBorderSVG className="absolute left-0 top-0 size-full stroke-white duration-300 group-data-[open=true]:stroke-accent" />
              Subscribe
            </SubscribeTrigger>
            <button
              type="button"
              aria-label="Close menu"
              onClick={close}
              className="flex items-center justify-center tap mobile:min-h-[2.75rem] mobile:min-w-[2.75rem]"
            >
              <MenuCloseSVG aria-hidden="true" className="size-10 cursor-pointer" />
            </button>
          </div>
          {/* The seven sections only, as the original phone menus listed (no News, Podcast or About). */}
          <nav aria-label="Sections" className="mt-16 font-menu">
            {sections.map((item) => (
              <MenuLink key={item.id} item={item} current={currentId === item.id} onClick={onItem} />
            ))}
          </nav>
        </div>
      )}
    />
  );
}

function MenuLink({
  item,
  current,
  onClick,
}: {
  item: (typeof SITE_NAV)[number];
  current: boolean;
  onClick: (event: MouseEvent<HTMLAnchorElement>, item: (typeof SITE_NAV)[number]) => void;
}) {
  return (
    <a href={item.href} aria-current={current ? 'page' : undefined} onClick={(event) => onClick(event, item)} className={ITEM}>
      <span className="relative w-fit text-center text-label font-semibold uppercase">
        <BilingualText text={item.title} />
        {current && <span className="absolute -bottom-2.5 left-1/2 h-0.5 w-1/2 -translate-x-1/2 bg-white" />}
      </span>
    </a>
  );
}
