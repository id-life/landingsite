import Markdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { isInternalHref } from '@/constants/site';

// Markdown for visually hidden (sr-only) crawler text. External links render as plain text: hidden
// outbound links read as link spam, and the visible pages already link out where it matters.
// Internal links stay, out of the keyboard tab order since the layer never becomes visible.
const components: Components = {
  a: ({ node: _node, href, children, ...props }) =>
    isInternalHref(href) ? (
      <a {...props} href={href} tabIndex={-1}>
        {children}
      </a>
    ) : (
      <>{children}</>
    ),
};

export default function HiddenMarkdown({ children }: { children: string }) {
  return (
    <Markdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </Markdown>
  );
}
