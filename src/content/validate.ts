// Runtime validation of every content record with its zod schema (CON-16). The records are plain typed data, so
// TypeScript already rejects a missing field; this adds what types cannot check (slug and URL formats, dates, the
// approval rules of CON-10). Imported for its side effect by the root layout (a server component), so it runs while
// `next build` prerenders and never ships to a browser. test/content-layer.test.mjs runs it too.
import { z } from 'zod';
import { COMPANIES } from './companies';
import { CONNECT_CRITERIA, CONNECT_STRENGTHS, CONNECT_VALUES } from './connect';
import { FUND } from './fund';
import { GRANTS } from './grants';
import { BOOKS, LABS, PAPERS, SPECTRUM_GROUPS } from './initiatives';
import { FEED_OVERRIDES } from './overrides';
import { PAGES } from './pages';
import { PEOPLE } from './people';
import { PRESS } from './press';
import { PROFILE_TEXT } from './profile';
import {
  Book,
  Company,
  Copy,
  CopyList,
  FeedOverride,
  FundFacts,
  Grant,
  Lab,
  PageMeta,
  Paper,
  Person,
  PressItem,
  Slogan,
  Theme,
  TwinCopy,
  defineContent,
} from './schema';
import { SLOGANS } from './slogans';
import { SUBSCRIBE_PROMISES } from './subscribe';
import { THEMES } from './themes';
import { TWIN } from './twin';

export type ContentEntry = [name: string, schema: z.ZodTypeAny, data: unknown];

export const CONTENT_ENTRIES: ContentEntry[] = [
  ['content/fund.ts', FundFacts, FUND],
  ['content/people.ts', z.array(Person), PEOPLE],
  ['content/themes.ts', z.array(Theme), THEMES],
  ['content/companies.ts', z.array(Company), COMPANIES],
  ['content/press.ts', z.array(PressItem), PRESS],
  ['content/grants.ts', z.array(Grant), GRANTS],
  ['content/initiatives.ts#groups', z.array(Copy), SPECTRUM_GROUPS],
  ['content/initiatives.ts#books', z.array(Book), BOOKS],
  ['content/initiatives.ts#labs', z.array(Lab), LABS],
  ['content/initiatives.ts#papers', z.array(Paper), PAPERS],
  ['content/profile.ts', z.array(Copy), PROFILE_TEXT],
  ['content/pages.ts', z.array(PageMeta), PAGES],
  ['content/slogans.ts', z.array(Slogan), SLOGANS],
  ['content/connect.ts#values', z.array(Copy), CONNECT_VALUES],
  ['content/connect.ts#criteria', CopyList, CONNECT_CRITERIA],
  ['content/connect.ts#strengths', z.array(Copy), CONNECT_STRENGTHS],
  ['content/twin.ts', TwinCopy, TWIN],
  ['content/subscribe.ts', z.array(Copy), SUBSCRIBE_PROMISES],
  ['content/overrides.ts', z.array(FeedOverride), FEED_OVERRIDES],
];

/** Validate every collection; throws on the first invalid one with the file and the field. */
export function validateContent(entries: ContentEntry[] = CONTENT_ENTRIES) {
  for (const [name, schema, data] of entries) defineContent(name, schema, data);
  return entries.length;
}

validateContent();
