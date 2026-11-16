/**
 * Type roles for rendered Markdown (articles and episode transcripts, RWD-01): the body role on the container and the
 * headings' roles. The doubled `&&` outranks the Markdown stylesheets' own sizes (github-markdown-css sets
 * `.markdown-body { font-size: 16px }`, and `.markdown-body h2 { font-size: 1.5em }`), so every size comes from a role.
 * On phones a section heading is title (28 px): the original's 24 px heading stood well above the article text, and
 * title-sm (20) flattened it.
 */
export const MARKDOWN_HEADING_ROLES =
  '[&&]:text-body [&&_h1]:text-title [&&_h2]:text-title-sm mobile:[&&_h2]:text-title [&&_h3]:text-lead [&&_h4]:text-body [&&_h5]:text-body-sm [&&_h6]:text-body-sm';
