import type { Metadata } from 'next';
import ErrorState from '@/components/common/ErrorState';
import { NAV_LIST } from '@/components/nav/nav';

export const metadata: Metadata = {
  title: { absolute: 'Page not found | Immortal Dragons' },
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
      <ErrorState
        code="404"
        title="Page not found"
        message="页面不存在或已移动。The page you asked for does not exist or has moved."
        links={[...NAV_LIST.map((item) => ({ href: item.href, label: item.title })), ...MORE_LINKS]}
      />
    </>
  );
}
