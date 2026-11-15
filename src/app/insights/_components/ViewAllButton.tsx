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

// A real link: it can be previewed, copied, middle-clicked and Cmd-clicked into a new tab.
export default function ViewAllButton({ href, external = false, onClick, isMobile = false }: ViewAllButtonProps) {
  const className = cn(
    // The label is the label role (RWD-01) and the frame grows with it: at least 1.7 times the label's size, so the
    // label never runs out of the frame where the scaled 2rem is shorter than the text (18 px at 820 px). The ::before
    // pseudo-element extends the hit area at least 10 px above and below, so it is 44 px tall or more (NAV-09, RWD-06).
    'group relative flex h-[max(2rem,1.7em)] cursor-pointer items-center justify-center gap-1 whitespace-nowrap py-0.5 pl-2 pr-1 font-text text-label font-semibold before:absolute before:inset-x-0 before:-inset-y-[max(0.375rem,10px)] before:content-[""] hover:opacity-80',
    isMobile && 'h-8 min-w-24',
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
        className={cn('relative -mt-px size-[max(1rem,0.9em)]', isMobile && 'size-3')}
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
