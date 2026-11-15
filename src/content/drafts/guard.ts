// Imported first by every module in src/content/drafts. A production build that reaches a draft fails here, so
// unapproved copy cannot ship even if a page imports it by mistake (CON-10, docs/content-approval.md).
if (process.env.NEXT_PUBLIC_DEPLOY_ENV === 'production') {
  throw new Error(
    'src/content/drafts was imported by a production build. Drafts never ship: approve the record first (docs/content-approval.md).',
  );
}

export const DRAFTS_ALLOWED = true;
