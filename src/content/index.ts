// The content layer (CON-16): typed, validated records that pages, JSON-LD, llms.txt and the sitemap read.
// ./validate.ts checks every record with its zod schema while `next build` prerenders, so the build fails on a
// missing or malformed field.
// Drafts are NOT exported here: they live in ./drafts and only the preview review page may import them (CON-10).
export * from './approval';
export { COMPANIES, PORTFOLIO_COUNT } from './companies';
export { CONNECT_CRITERIA, CONNECT_STRENGTHS, CONNECT_VALUES } from './connect';
export { FUND, FUND_ADDRESS_LINE } from './fund';
export { GRANTS, PROFILE_GRANTS, SPECTRUM_GRANTS } from './grants';
// Typed overrides for id-platform feed items (empty until CON-09; docs/id-platform-content-api.md).
export { FEED_OVERRIDES } from './overrides';
export { BOOKS, LABS, PAPERS, SPECTRUM_GROUPS } from './initiatives';
export { PAGES, pageMeta } from './pages';
export { PEOPLE, personBySlug } from './people';
export { FUND_PRESS, PORTFOLIO_PRESS, PRESS } from './press';
export { LLMS_CHINESE_SUMMARY, LLMS_HEADER, LLMS_SECTIONS, keyFactLines, llmsIntro, llmsSection } from './profile';
export { SLOGANS } from './slogans';
export { SUBSCRIBE_PROMISE } from './subscribe';
export { THEMES } from './themes';
export { TWIN_FEATURES, TWIN_FEATURES_CN, TWIN_ONTOLOGY } from './twin';
