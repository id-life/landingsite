import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

export type ErrorStateLink = { href: string; label: string };

/** Where to go from an error page: Home, News, Podcast and Connect. */
export const ERROR_LINKS: ErrorStateLink[] = [
  { href: '/', label: 'Home 首页' },
  { href: '/news', label: 'News 新闻' },
  { href: '/podcast', label: 'Podcast 播客' },
  { href: '/connect', label: 'Connect 联结' },
];

/** One sentence for every error page. */
export const ERROR_MESSAGE = '页面加载出错。Something went wrong while loading this page.';

type ErrorStateProps = {
  /** The small red line above the heading: '404', 'Error'. */
  code: string;
  title: string;
  message: string;
  links: ErrorStateLink[];
  /** A recovery control under the message (Try again). */
  action?: ReactNode;
};

/**
 * The frame shared by the 404 page and the error pages (wave 0's designed not-found layout): the logo
 * linking home, a code, one sentence and links back into the site. No hooks, so the server-rendered 404 and
 * the client error boundaries all use it.
 */
export default function ErrorState({ code, title, message, links, action }: ErrorStateProps) {
  return (
    <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-6 py-16 text-center text-black">
      <Link href="/" aria-label="Immortal Dragons home" className="mb-10 block">
        <Image src="/imgs/id-logo-large.png" alt="Immortal Dragons 不朽真龙" width={108} height={100} unoptimized />
      </Link>
      <p className="font-oxanium text-sm font-bold uppercase tracking-widest text-red-600">{code}</p>
      <h1 className="mt-3 font-oxanium text-3xl font-bold uppercase mobile:text-2xl">{title}</h1>
      <p className="mt-2 font-poppins text-base text-black/60">{message}</p>
      {action ? <div className="mt-8">{action}</div> : null}
      <nav aria-label="Site sections" className="mt-10 w-full max-w-xl">
        <ul className="grid grid-cols-2 gap-3 font-poppins text-sm font-semibold uppercase mobile:grid-cols-1">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block border border-black/15 bg-white/60 px-4 py-3 backdrop-blur-sm transition-colors hover:border-red-600 hover:text-red-600"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

/** The recovery button of the error pages. */
export function TryAgainButton({ onClick, label = 'Try again 重试' }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-current px-6 py-2 font-poppins text-sm font-semibold uppercase transition-colors hover:border-red-600 hover:text-red-600"
    >
      {label}
    </button>
  );
}
