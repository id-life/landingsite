'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { loadBrandFace, whenIdleAfterLoad } from '@/lib/brand-fonts';
import { PHONE_TREE_QUERY } from '@/styles/device-classes';

// The phone menu sheet (GSAP stagger, the section controller) loads on its first open, on every route.
const SiteMenu = dynamic(() => import('./SiteMenu'), { ssr: false });

/**
 * The phone menu button of the site header and the sheet it opens. Icons are server-rendered children. While the
 * sheet is open <html data-menu-open> is set, so the phone deck's swipe handler leaves the sheet alone.
 */
export default function MenuToggle({
  className,
  openIcon,
  closeIcon,
  currentId,
  inExperience = false,
  experiencePage = false,
}: {
  className?: string;
  openIcon: ReactNode;
  closeIcon: ReactNode;
  currentId: string | null;
  inExperience?: boolean;
  /** The 3D pages' header (overlay): the menu face waits for the experience to be ready. */
  experiencePage?: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpenState] = useState(false);
  const [wanted, setWanted] = useState(false);
  const setOpen = (next: boolean) => {
    setOpenState(next);
    if (next) setWanted(true);
    if (next) document.documentElement.dataset.menuOpen = 'true';
    else delete document.documentElement.dataset.menuOpen;
  };
  // The sheet closes when the route changes (set while rendering, not in an effect).
  const [path, setPath] = useState(pathname);
  if (path !== pathname) {
    setPath(pathname);
    if (open) {
      setOpenState(false);
      if (typeof document !== 'undefined') delete document.documentElement.dataset.menuOpen;
    }
  }

  // The sheet is set in TT Lakes: request the face ahead of its first opening (the phone tree only, where this button
  // shows), so the sheet is not drawn in the fallback first: when the page is idle after load, and on the 3D pages only
  // once the experience is ready (not to share the link with what the loader waits for); at the latest when a finger
  // lands on the button.
  useEffect(() => {
    if (!window.matchMedia(PHONE_TREE_QUERY).matches) return;
    let cancel = () => {};
    const start = () => (cancel = whenIdleAfterLoad(() => loadBrandFace('--font-tt')));
    if (!experiencePage || performance.getEntriesByName('experience_ready').length) start();
    else window.addEventListener('idl:experience_ready', start, { once: true });
    return () => {
      window.removeEventListener('idl:experience_ready', start);
      cancel();
    };
  }, [experiencePage]);

  return (
    <>
      <button
        type="button"
        aria-label="Menu"
        aria-expanded={open}
        aria-controls="mobile-nav-menu"
        onPointerDown={() => loadBrandFace('--font-tt')}
        onClick={() => setOpen(!open)}
        className={className}
      >
        {open ? closeIcon : openIcon}
      </button>
      {wanted && <SiteMenu open={open} onOpenChange={setOpen} currentId={currentId} inExperience={inExperience} />}
    </>
  );
}
