// Typed overrides for id-platform feed items, keyed by the API item id, until the API carries these fields itself
// (docs/id-platform-content-api.md). Empty until the Insights hub (CON-09) needs one. An agent-written summary is a
// draft and belongs in src/content/drafts/ until the owner approves it. Schema: FeedOverride in ./schema.ts.
import type { FeedOverride } from './schema';

export const FEED_OVERRIDES: FeedOverride[] = [];
