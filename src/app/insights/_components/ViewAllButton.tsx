import { cn } from '@/utils';
import Link from 'next/link';

interface ViewAllButtonProps {
  href: string;
  /** Runs before the link navigates (it must not prevent it). */
  onClick?: () => void;
  isMobile?: boolean;
  /** Open in a new tab (external pages on desktop). */
  newTab?: boolean;
}

/**
 * A real link (it was a div with a click handler): keyboard reachable, announced as a link, opens in a new tab
 * on middle click. The 32 px pill has a 44 px tall touch target through its ::before pseudo-element.
 */
export default function ViewAllButton({ href, onClick, isMobile = false, newTab = false }: ViewAllButtonProps) {
  const external = /^https?:\/\//.test(href);
  const className = cn(
    'group relative flex h-8 cursor-pointer items-center justify-center gap-1 py-0.5 pl-2 pr-1 font-poppins text-base/5 font-semibold before:absolute before:inset-x-0 before:-inset-y-1.5 before:content-[""] hover:opacity-80',
    isMobile && 'h-8 w-24 text-sm',
  );
  const content = (
    <>
      {/* Border SVG with top-left cut corner */}
      <svg aria-hidden="true" className="absolute inset-0" viewBox="0 0 111 36" fill="none" preserveAspectRatio="none">
        <path d="M10 1H110V35H1V10L10 1Z" stroke="#C11111" strokeWidth="2" />
      </svg>
      <span className="relative text-sm/5 text-red-600">VIEW ALL</span>
      {/* Right chevron arrow */}
      <svg aria-hidden="true" className={cn('relative -mt-px size-4', isMobile && 'size-3')} viewBox="0 0 16 16" fill="none">
        <path d="M6 4L10 8L6 12" stroke="#C11111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </>
  );
  if (external) {
    return (
      <a
        href={href}
        onClick={onClick}
        className={className}
        {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {content}
      </a>
    );
  }
  return (
    <Link href={href} onClick={onClick} className={className}>
      {content}
    </Link>
  );
}
