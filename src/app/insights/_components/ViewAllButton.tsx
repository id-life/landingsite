import Link from 'next/link';
import { cn } from '@/utils';

import { color } from '@/styles/tokens';

interface ViewAllButtonProps {
  href: string;
  /** Opens href in a new tab (an external site). */
  external?: boolean;
  /** Side effects only (analytics, the return-page marker); the link itself navigates. */
  onClick?: () => void;
  isMobile?: boolean;
}

// A real link: it can be previewed, copied, middle-clicked and Cmd-clicked into a new tab.
export default function ViewAllButton({ href, external = false, onClick, isMobile = false }: ViewAllButtonProps) {
  const className = cn(
    // The 32 px pill has a 44 px tall touch target through its ::before pseudo-element (NAV-09).
    'group relative flex h-8 cursor-pointer items-center justify-center gap-1 py-0.5 pl-2 pr-1 font-text text-base/5 font-semibold before:absolute before:inset-x-0 before:-inset-y-1.5 before:content-[""] hover:opacity-80',
    isMobile && 'h-8 w-24 text-sm',
  );
  const content = (
    <>
      {/* Border SVG with top-left cut corner */}
      <svg aria-hidden="true" className="absolute inset-0" viewBox="0 0 111 36" fill="none" preserveAspectRatio="none">
        <path d="M10 1H110V35H1V10L10 1Z" stroke={color.accent} strokeWidth="2" />
      </svg>
      <span className="relative text-sm/5 text-accent">VIEW ALL</span>
      {/* Right chevron arrow */}
      <svg aria-hidden="true" className={cn('relative -mt-px size-4', isMobile && 'size-3')} viewBox="0 0 16 16" fill="none">
        <path d="M6 4L10 8L6 12" stroke={color.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </>
  );

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={className}>
      {content}
    </a>
  ) : (
    <Link href={href} onClick={onClick} className={className}>
      {content}
    </Link>
  );
}
