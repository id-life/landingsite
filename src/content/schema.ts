// Schemas of the content layer (CON-16). Import this module with `import type` from record modules (shipped to the
// browser); only ./validate.ts and the drafts import it at runtime. Records are data only: ids, { en, zh } text, URLs, image paths and
// dates. No JSX, no Tailwind classes, no positions in an array that another array depends on: presentation
// (logo sizes, particle images, map positions) lives in the component that draws it, keyed by the record's slug.
//
// Every record carries an `approval` (CON-10). Records in src/content/*.ts must be shippable (`legacy` or
// `approved`); drafts live only in src/content/drafts/ and never reach a production build. docs/content-approval.md
// explains the three states and how the owner approves a draft.
import { z } from 'zod';

const isoDate = z.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$/, 'expected YYYY, YYYY-MM or YYYY-MM-DD');
const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'expected a lower-case slug');
const url = z.string().regex(/^(https:\/\/|\/)/, 'expected an https:// URL or a root-relative path');

/** Bilingual text. English is required; Chinese is added where the site already has it. */
export const Text = z.object({ en: z.string().min(1), zh: z.string().min(1).optional() });
export type Text = z.infer<typeof Text>;

/** Where a statement comes from: a repository file:line, a URL, or an id-platform API path. */
export const Source = z.object({ ref: z.string().min(1), note: z.string().optional() });
export type Source = z.infer<typeof Source>;

/**
 * Live on www.id.life at the audit baseline (main @ 6a90671, 2026-11-14) and carried over verbatim. Shipping it is
 * not new copy. `pendingRuling` marks a fact the owner has been asked to rule on (CON-11): it keeps rendering where
 * it already rendered, but new placements (the About page, the home statement) must not show it until the ruling.
 */
export const LegacyApproval = z.object({
  status: z.literal('legacy'),
  liveAt: z.string().min(1),
  pendingRuling: z.string().optional(),
  sources: z.array(Source).optional(),
});

/** Approved by the owner: who and when. Approval of a draft = moving it out of drafts/ with these two fields. */
export const ApprovedApproval = z.object({
  status: z.literal('approved'),
  approvedBy: z.string().min(1),
  approvedAt: isoDate,
  sources: z.array(Source).optional(),
});

/** Written by an agent from published sources; never rendered by a production build. */
export const DraftApproval = z.object({
  status: z.literal('draft'),
  sources: z.array(Source).min(1),
  questions: z.array(z.string()).optional(),
  replaces: z.string().optional(),
});

export const ShippableApproval = z.discriminatedUnion('status', [LegacyApproval, ApprovedApproval]);
export const AnyApproval = z.discriminatedUnion('status', [LegacyApproval, ApprovedApproval, DraftApproval]);
export type ShippableApproval = z.infer<typeof ShippableApproval>;
export type DraftApproval = z.infer<typeof DraftApproval>;

const shippable = { approval: ShippableApproval };

/** A dated value: a figure is never shown without the date it was true on. */
export const DatedText = z.object({ text: Text, asOf: isoDate, source: Source });

// ---- The 17 record types of figure CON-content-model ---------------------------------------------------------

/** One fact about the fund, with its label. */
export const Fact = z.object({ label: Text, value: Text, asOf: isoDate.optional(), ...shippable });
export type Fact = z.infer<typeof Fact>;

export const FundFacts = z.object({
  name: Text,
  legalName: Fact,
  email: z.string().email(),
  website: url,
  address: z.object({
    streetAddress: z.string(),
    addressLocality: z.string(),
    postalCode: z.string(),
    addressCountry: z.string().length(2),
    area: z.string(),
  }),
  founder: slug,
  fundSize: Fact,
  geography: Fact,
  lpPositions: Fact,
  /** The owner's own wording of the investment count ('15+'); the computed count comes from the portfolio. */
  statedInvestments: Fact,
  // The Fund I launch month has no single published value (2025-07-16 release vs August 2025 in the milestones
  // article): it exists only as a draft (src/content/drafts/fund.ts) until the owner rules (CON-11 #1).
  /** Organization description used by metadata and JSON-LD (six areas; ruling pending on four themes vs six). */
  description: z.object({ text: Text, ...shippable }),
  /** One sentence that says what the fund is (the home page description). */
  statement: z.object({ text: Text, ...shippable }),
  ...shippable,
});
export type FundFacts = z.infer<typeof FundFacts>;

export const Theme = z.object({ slug, name: Text, order: z.number().int(), ...shippable });
export type Theme = z.infer<typeof Theme>;

export const Company = z.object({
  slug,
  name: z.string().min(1),
  tagline: Text,
  url: url.optional(),
  logo: url,
  logoAlt: z.string().min(1),
  ...shippable,
});
export type Company = z.infer<typeof Company>;

export const Person = z.object({
  slug,
  name: Text,
  role: Text,
  alumniOf: z.array(z.string()),
  ...shippable,
});
export type Person = z.infer<typeof Person>;

export const Faq = z.object({ id: slug, question: Text, answer: Text, ...shippable });
export const LegalPage = z.object({ slug, title: Text, body: Text, updatedAt: isoDate, ...shippable });

/** Original writing published on the site (feeds come from id-platform; see docs/id-platform-content-api.md). */
export const Post = z.object({ slug, title: Text, summary: Text, publishedAt: isoDate, url, ...shippable });

/** Coverage about the fund or its portfolio companies. */
export const PressItem = z.object({
  title: z.string().min(1),
  source: z.string().min(1),
  url,
  date: isoDate.optional(),
  subject: z.enum(['fund', 'portfolio']),
  ...shippable,
});
export type PressItem = z.infer<typeof PressItem>;

export const Talk = z.object({
  slug,
  title: Text,
  event: z.string(),
  date: isoDate.optional(),
  url: url.optional(),
  ...shippable,
});

/** A published paper. `citations` (a count read from Crossref, see scripts/paper-citations.mjs) orders the Spectrum list. */
export const Paper = z.object({
  slug,
  title: z.string().min(1),
  url,
  doi: z
    .string()
    .regex(/^10\.\d{4,9}\/\S+$/)
    .optional(),
  citations: z.number().int().nonnegative().optional(),
  ...shippable,
});
export type Paper = z.infer<typeof Paper>;

export const WeeklyIssue = z.object({ id: z.string(), title: Text, publishedAt: isoDate, url, ...shippable });
export const PodcastShow = z.object({ slug, title: Text, description: Text, url, ...shippable });
export const PodcastEpisode = z.object({ id: z.string(), show: slug, title: Text, summary: Text, url, ...shippable });

/** A place on the Presence map (events, partners, community). Migrated with the Presence components. */
export const Event = z.object({ slug, name: Text, city: z.string().optional(), url: url.optional(), ...shippable });

/** A sponsored body or funded project. `inProfile` and `onSpectrum` record today's two lists (ruling pending). */
export const Grant = z.object({
  slug,
  name: z.string().min(1),
  description: Text.optional(),
  url: url.optional(),
  spectrumLabel: z.string().optional(),
  inProfile: z.boolean(),
  onSpectrum: z.boolean(),
  ...shippable,
});
export type Grant = z.infer<typeof Grant>;

export const Book = z.object({ slug, title: z.string().min(1), url, ...shippable });
export type Book = z.infer<typeof Book>;

/** A data tool published under Spectrum (influence network, disease management, trend radar). */
export const Lab = z.object({ slug, title: z.string().min(1), url, routeKey: z.string().optional(), ...shippable });
export type Lab = z.infer<typeof Lab>;

/** A hero slogan. English and Chinese slogans are separate lines, not translations of each other. */
export const Slogan = z.object({ id: slug, locale: z.enum(['en', 'zh']), text: z.string().min(1), ...shippable });
export type Slogan = z.infer<typeof Slogan>;

/** A piece of interface or section copy (slogans, value statements, subscribe promise). */
export const Copy = z.object({ id: slug, text: Text, title: Text.optional(), ...shippable });
export type Copy = z.infer<typeof Copy>;

/** The Digital Twin section's copy. */
export const TwinCopy = z.object({
  features: z.array(Text).min(1),
  ontology: z.object({ title: Text, text: Text }),
  approval: ShippableApproval,
});
export type TwinCopy = z.infer<typeof TwinCopy>;

/** A typed override for one id-platform feed item (docs/id-platform-content-api.md). */
export const FeedOverride = z.object({
  feed: z.enum(['insights', 'weekly', 'podcast']),
  id: z.number().int(),
  type: z.enum(['writing', 'press', 'talk', 'weekly', 'paper', 'episode']).optional(),
  lang: z.string().optional(),
  summary: Text.optional(),
  about: z.array(z.string()).optional(),
  slug: slug.optional(),
  approval: ShippableApproval,
});
export type FeedOverride = z.infer<typeof FeedOverride>;

/**
 * A route's metadata: the topic of its <title> (src/lib/seo/metadata.ts adds the brand) and its meta description,
 * which the layout, its JSON-LD and the Pages list of llms.txt all read, so the copies cannot drift.
 */
export const PageMeta = z.object({
  id: slug,
  /** The canonical path, e.g. '/portfolio'. */
  path: z.string().regex(/^\/[a-z0-9/-]*$/, 'expected a root-relative path'),
  title: z.string().min(1),
  /** The browser tab title (and og:title) exactly as the owner's site has it (question 5i, 2026-11-18). */
  tabTitle: z.string().min(1),
  description: z.string().min(1),
  /** The link text of the route in llms.txt's Pages list; absent leaves the route out of that list. */
  llmsLabel: z.string().min(1).optional(),
  ...shippable,
});
export type PageMeta = z.infer<typeof PageMeta>;

/** A titled list (the Connect criteria). */
export const CopyList = z.object({ id: slug, title: Text, items: z.array(Text).min(1), ...shippable });
export type CopyList = z.infer<typeof CopyList>;

/**
 * A draft for the owner (CON-10): text written from published sources only, with every source and the questions only
 * the owner can answer. Lives in src/content/drafts/ and is never rendered by a production build.
 */
export const DraftRecord = z.object({
  id: slug,
  /** The plan item that needs it (CON-01, CON-15, ...). */
  item: z.string().regex(/^[A-Z]{2,4}-\d{2}$/),
  /** What it is, for the review page ("About: founder section"). */
  title: z.string().min(1),
  /** The text as it would ship. Lines starting with "- " render as a list on the review page. */
  body: Text,
  approval: DraftApproval,
});
export type DraftRecord = z.infer<typeof DraftRecord>;

/**
 * Parse a record or a collection and throw a message that names the file and the field. Server and tests only: the
 * records themselves are plain typed data, so zod never reaches a browser bundle; ./validate.ts runs every check from
 * the root layout, which makes `next build` fail on invalid content.
 */
export function defineContent<S extends z.ZodTypeAny>(name: string, schema: S, data: z.input<S>): z.output<S> {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues.map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`);
    throw new Error(`Invalid content in ${name}:\n  ${issues.join('\n  ')}`);
  }
  return result.data;
}
