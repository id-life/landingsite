// Typed overrides for id-platform feed items, keyed by the API item id, until the API carries these fields itself
// (docs/id-platform-content-api.md). Empty until the Insights hub (CON-09) needs one. An agent-written summary is a
// draft and belongs in src/content/drafts/ until the owner approves it.
import { ShippableApproval, Text, defineContent } from './schema';
import { z } from 'zod';

export const FeedOverride = z.object({
  feed: z.enum(['insights', 'weekly', 'podcast']),
  id: z.number().int(),
  type: z.enum(['writing', 'press', 'talk', 'weekly', 'paper', 'episode']).optional(),
  lang: z.string().optional(),
  summary: Text.optional(),
  about: z.array(z.string()).optional(),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    .optional(),
  approval: ShippableApproval,
});
export type FeedOverride = z.infer<typeof FeedOverride>;

export const FEED_OVERRIDES = defineContent('content/overrides.ts', z.array(FeedOverride), []);
