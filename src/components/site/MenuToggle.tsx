'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';

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
}: {
  className?: string;
  openIcon: ReactNode;
  closeIcon: ReactNode;
  currentId: string | null;
  inExperience?: boolean;
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

  return (
    <>
      <button
        type="button"
        aria-label="Menu"
        aria-expanded={open}
        aria-controls="mobile-nav-menu"
        onClick={() => setOpen(!open)}
        className={className}
      >
        {open ? closeIcon : openIcon}
      </button>
      {wanted && <SiteMenu open={open} onOpenChange={setOpen} currentId={currentId} inExperience={inExperience} />}
    </>
  );
}
