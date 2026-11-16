/**
 * Type roles for rendered Markdown (articles and episode transcripts, RWD-01): the body role on the container and the
 * headings' roles. The doubled `&&` outranks the Markdown stylesheets' own sizes (github-markdown-css sets
 * `.markdown-body { font-size: 16px }`, and `.markdown-body h2 { font-size: 1.5em }`), so every size comes from a role.
 */
export const MARKDOWN_HEADING_ROLES =
  '[&&]:text-body [&&_h1]:text-title [&&_h2]:text-title-sm [&&_h3]:text-lead [&&_h4]:text-body [&&_h5]:text-body-sm [&&_h6]:text-body-sm';
