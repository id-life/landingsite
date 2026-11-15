import { ORG_COVER, ORG_REF, breadcrumbJsonLd } from '@/constants/entity';
import { absoluteUrl } from '@/constants/site';
import React, { cache } from 'react';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import dayjs from 'dayjs';
import Markdown from 'react-markdown';
import { markdownRehypePlugins, markdownRemarkPlugins } from '@/utils/markdown';
import relativeTime from 'dayjs/plugin/relativeTime';
import { fetchNewsContent } from '@/apis';
import { isApiNotFound } from '@/apis/request';
import 'github-markdown-css/github-markdown-light.css';
import '@/styles/markdown.css';
import { notFound } from 'next/navigation';
import { NewsArticle, WithContext } from 'schema-dts';
import JsonLd from '@/components/seo/JsonLd';
import ReadDepth from '@/lib/analytics/ReadDepth';
import Breadcrumb from '@/components/site/Breadcrumb';

dayjs.extend(relativeTime);

export const revalidate = 300; // 5min
export const dynamicParams = true;
export const dynamic = 'force-static';

const getCacheNewsContent = cache(async (id: string) => {
  try {
    const res = await fetchNewsContent(id);
    return res.code == 200 ? res.data : undefined;
  } catch (error) {
    // The API rejects a malformed or unknown id with 400/404: render the not-found page, not a 500.
    // Anything else (API down) still throws, so ISR keeps serving the last good version.
    if (isApiNotFound(error)) return undefined;
    throw error;
  }
});

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const params = await props.params;
  const { id } = params;
  const data = await getCacheNewsContent(id);
  if (!data) return { title: { absolute: 'Article not found | Immortal Dragons' } };
  return buildMetadata({
    path: `/news/${id}`,
    title: data.title,
    description: data.description || data.content.slice(0, 200),
    type: 'article',
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const data = await getCacheNewsContent(id);

  if (!data || data.status === 'UNPUBLISH') {
    return notFound();
  }

  const jsonLd: WithContext<NewsArticle> = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: data.title,
    url: absoluteUrl(`/news/${id}`),
    mainEntityOfPage: absoluteUrl(`/news/${id}`),
    author: ORG_REF,
    datePublished: data.createdAt,
    dateModified: data.updatedAt || data.createdAt,
    image: ORG_COVER,
    description: data.description || data.content.slice(0, 50),
    publisher: ORG_REF,
  };
  const breadcrumb = breadcrumbJsonLd([
    { name: 'News', path: '/news' },
    { name: data.title, path: `/news/${id}` },
  ]);

  return (
    <>
      <JsonLd data={[jsonLd, breadcrumb]} />
      <ReadDepth itemId={String(id)} />
      <div>
        <Breadcrumb className="mt-5 mobile:mt-3.5" items={[{ label: 'News', href: '/news' }, { label: 'Article' }]} />
        <div className="mt-10 rounded-3xl bg-white p-20 mobile:mt-3 mobile:rounded-lg mobile:p-3">
          <div className="flex items-center justify-center gap-2 text-sm/5 font-semibold">
            <img src="/imgs/news/article_logo.webp" className="size-7" alt="" />
            Immortal Dragons
          </div>
          <h1 className="mt-5 text-center text-[2.375rem]/[3.75rem] font-semibold mobile:mt-3 mobile:text-lg">{data.title}</h1>
          <div className="mx-auto mb-15 mt-10 max-w-80 border-b border-dashed border-black mobile:mb-10 mobile:mt-7.5" />
          <div className="article-body markdown-body">
            <Markdown remarkPlugins={markdownRemarkPlugins} rehypePlugins={markdownRehypePlugins}>
              {data.content}
            </Markdown>
          </div>
        </div>
      </div>
    </>
  );
}
