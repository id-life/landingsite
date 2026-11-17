import Link from 'next/link';
import { cn } from '@/utils';

interface ViewAllButtonProps {
  href: string;
  /** Opens href in a new tab (an external site). */
  external?: boolean;
  /** Side effects only (analytics, the return-page marker); the link itself navigates. */
  onClick?: () => void;
  isMobile?: boolean;
}

/** The Insights row headings (NEWS & TALKS, PODCAST, 长生周报) at the original's size. */
export const HEADING = 'font-display text-[1.625rem]/9 font-semibold uppercase';
export const HEADING_PHONE = 'text-[1.625rem] leading-9';

// A real link: it can be previewed, copied, middle-clicked and Cmd-clicked into a new tab.
export default function ViewAllButton({ href, external = false, onClick, isMobile = false }: ViewAllButtonProps) {
  const className = cn(
    // The original's size (a 2-unit frame, a 14-unit label). The ::before pseudo-element extends the hit area at least
    // 10 px above and below, so it is 44 px tall or more (NAV-09, RWD-06) without a bigger frame.
    'group relative flex h-8 cursor-pointer items-center justify-center gap-1 whitespace-nowrap py-0.5 pl-2 pr-1 font-text text-sm/5 font-semibold before:absolute before:inset-x-0 before:-inset-y-[max(0.375rem,10px)] before:content-[""] hover:opacity-80',
    isMobile && 'h-8 w-24 text-sm',
  );
  const content = (
    <>
      {/* Border SVG with top-left cut corner */}
      <svg aria-hidden="true" className="absolute inset-0" viewBox="0 0 111 36" fill="none" preserveAspectRatio="none">
        <path d="M10 1H110V35H1V10L10 1Z" fill="var(--color-white)" stroke="var(--color-accent)" strokeWidth="2" />
      </svg>
      <span className="relative text-accent">VIEW ALL</span>
      {/* Right chevron arrow */}
      <svg aria-hidden="true" className={cn('relative -mt-px size-4', isMobile && 'size-3')} viewBox="0 0 16 16" fill="none">
        <path d="M6 4L10 8L6 12" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
