'use client';

import NewsHeader from './_components/NewsHeader';
import NewsFooter from './_components/NewsFooter';

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto max-w-screen-xl">
      <NewsHeader />
      {children}
      <NewsFooter />
    </div>
  );
}
