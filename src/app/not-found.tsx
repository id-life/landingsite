import type { Metadata } from 'next';
import ErrorState from '@/components/common/ErrorState';
import { NAV_LIST } from '@/components/nav/nav';
import { NOT_FOUND_TITLE } from '@/lib/seo/metadata';

export const metadata: Metadata = {
  // His site's title for an unknown address (question 5i); og:title stays the site default, as on his site.
  title: { absolute: NOT_FOUND_TITLE },
  robots: { index: false, follow: true },
};

const MORE_LINKS = [
  { href: '/news', label: 'News 新闻' },
  { href: '/podcast', label: 'Podcast 播客' },
];

// Shown for unknown URLs and for podcast or news items that do not exist (HTTP 404).
export default function NotFound() {
  return (
    <>
      {/* The skip link's target (this page has no site header). */}
      <span id="content-start" tabIndex={-1} className="sr-only" />
      <ErrorState
        code="404"
        title="Page not found"
        message="页面不存在或已移动。The page you asked for does not exist or has moved."
        links={[...NAV_LIST.map((item) => ({ href: item.href, label: item.title })), ...MORE_LINKS]}
      />
    </>
  );
}
