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

/**
 * The Insights row headings (NEWS & TALKS, PODCAST, 长生周报): the original's 26-unit heading on the desktop deck
 * from 1200 px and 26 px on phones; the title-sm role on tablets.
 */
export const HEADING = 'font-display text-[1.625rem]/9 font-semibold uppercase medium:text-title-sm expanded:text-title-sm';
export const HEADING_PHONE = 'text-[26px] leading-9';

// A real link: it can be previewed, copied, middle-clicked and Cmd-clicked into a new tab.
export default function ViewAllButton({ href, external = false, onClick, isMobile = false }: ViewAllButtonProps) {
  const className = cn(
    // The original's size on phones and from 1200 px (a 2-unit frame, a 14-unit label never under 12 px). On tablets
    // the label is the label role and the frame grows with it (at least 1.7 times the label), so the label never runs
    // out of the frame where 2 units are shorter than the text. The ::before pseudo-element extends the hit area at
    // least 10 px above and below, so it is 44 px tall or more (NAV-09, RWD-06) without a bigger frame.
    'group relative flex h-8 cursor-pointer items-center justify-center gap-1 whitespace-nowrap py-0.5 pl-2 pr-1 font-text text-sm/5 font-semibold before:absolute before:inset-x-0 before:-inset-y-[max(0.375rem,10px)] before:content-[""] hover:opacity-80',
    'medium:h-[max(2rem,1.7em)] medium:text-label expanded:h-[max(2rem,1.7em)] expanded:text-label',
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
      <svg
        aria-hidden="true"
        className={cn(
          'relative -mt-px size-4 medium:size-[max(1rem,0.9em)] expanded:size-[max(1rem,0.9em)]',
          isMobile && 'size-3',
        )}
        viewBox="0 0 16 16"
        fill="none"
      >
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
