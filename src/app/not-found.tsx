import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { NAV_LIST } from '@/components/nav/nav';

export const metadata: Metadata = {
  title: { absolute: 'Page not found | Immortal Dragons 不朽真龙' },
  robots: { index: false, follow: true },
};

const MORE_LINKS = [
  { href: '/news', label: 'News 新闻' },
  { href: '/podcast', label: 'Podcast 播客' },
];

// Shown for unknown URLs and for podcast or news items that do not exist (HTTP 404).
export default function NotFound() {
  return (
    <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-6 py-16 text-center text-black">
      <Link href="/" aria-label="Immortal Dragons home" className="mb-10 block">
        <Image src="/imgs/id-logo-large.png" alt="Immortal Dragons 不朽真龙" width={108} height={100} unoptimized />
      </Link>
      <p className="font-oxanium text-sm font-bold uppercase tracking-widest text-red-600">404</p>
      <h1 className="mt-3 font-oxanium text-3xl font-bold uppercase mobile:text-2xl">Page not found</h1>
      <p className="mt-2 font-poppins text-base text-black/60">
        页面不存在或已移动。The page you asked for does not exist or has moved.
      </p>
      <nav aria-label="Site sections" className="mt-10 w-full max-w-xl">
        <ul className="grid grid-cols-2 gap-3 font-poppins text-sm font-semibold uppercase mobile:grid-cols-1">
          {[...NAV_LIST.map((item) => ({ href: item.href, label: item.title })), ...MORE_LINKS].map((link) => (
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
