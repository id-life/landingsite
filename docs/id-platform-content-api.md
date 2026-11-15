# id-platform content API: fields the site needs (CON-16, phase 2)

Status: **specification for the id-platform maintainer** (owner ask). The site cannot change id-platform; nothing here
is implemented on the API side. Written 2026-11-15 from the endpoints as they answer today
(`idlife-audit/runs/2026-1114-1935_no001_baseline-evidence/probes/CON/api-inventory.json`, captured 2026-11-14).

## Why

Slow-changing records (fund facts, themes, companies, grants, books, papers, labs, section copy) now live in the repo
as typed, validated data (`src/content/`, see `src/content/schema.ts`). Feeds that change weekly come from id-platform
and stay there: insights and press, the weekly digest, and the two podcasts. To build the typed Insights hub
(CON-09), English episode pages (CON-17) and the press room (CON-18) without a second hand-kept copy of the feed in
the repo, each feed item needs a few fields the API does not have yet.

## Endpoints today

| Endpoint                                | Items (2026-11-14) | Fields                                                                                                                 |
| --------------------------------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `GET /insights`                         | 65                 | id, title, category, sequence, url, publishDate, imageUrl, isPublished, publisher, isTop, createdAt, updatedAt         |
| `GET /insights/with-geo`                | 65                 | id, title, sequence, contentType, url, imageUrl, publisher, isTop, publishDate                                         |
| `GET /longevity-weekly/list`            | 62                 | id, title, brief, url, publishDate, sequence, publisher                                                                |
| `GET /podcast/list?category=podcast_id` | 19                 | id, category, title, artist, duration, url, xyzLink, podcastLink, spotifyLink, album, description, sequence, createdAt |
| `GET /podcast/list?category=podcast_lt` | 22                 | same as above                                                                                                          |
| `GET /podcast/detail/:id`               | -                  | the list fields plus detailMedia, transcript, keywords                                                                 |
| `GET /geo/list`, `GET /geo/content?id=` | 0                  | id, title, brief, category, createdAt, updatedAt, cover, source / content, description, keyWords                       |

## Fields to add

Add these to every item of `/insights`, `/longevity-weekly/list` and `/podcast/*` (and `/geo/*` if it is kept).
All are optional at first, so the site keeps working while they are filled in.

| Field        | Type                                                           | Meaning                                                                                                                                             | Why the site needs it                                                                                                                                                |
| ------------ | -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`       | enum: `writing`, `press`, `talk`, `weekly`, `paper`, `episode` | What the item is. `writing` = authored by the fund or the founder; `press` = coverage or a release about the fund or a portfolio company.           | One hub with a URL per type (CON-09). Today `category` mixes kinds and `contentType` only says insights or geo.                                                      |
| `lang`       | BCP 47: `en`, `zh-Hans`, `ja`, ...                             | Language of the original (title and target page). 21 of the 65 insights titles are Chinese, 43 English, 1 Japanese.                                 | Language badge and filter; `hreflang` on item pages.                                                                                                                 |
| `summary_en` | string, <= 160 characters                                      | One-sentence English summary, written or approved by a person.                                                                                      | Card text and meta description in English.                                                                                                                           |
| `summary_zh` | string, <= 80 characters                                       | The same in Simplified Chinese.                                                                                                                     | The `/zh` locale (CON-03).                                                                                                                                           |
| `about`      | array of slugs                                                 | What the item is about: `fund`, a company slug from `src/content/companies.ts` (e.g. `frontier-bio`), or a theme slug from `src/content/themes.ts`. | Related press on company pages (CON-08) and theme pages; "covered by" on /about.                                                                                     |
| `slug`       | string, `[a-z0-9-]+`, unique per type                          | Stable path segment.                                                                                                                                | Readable, permanent URLs (`/podcast/long-talk/<slug>`, `/insights/weekly/<slug>`) with 308s from numeric ids.                                                        |
| `visibility` | enum: `public`, `hidden`, `draft`                              | Whether the site may show the item.                                                                                                                 | Replaces `isPublished`; `draft` lets an editor stage an item that the site never renders in production (the same rule the repo enforces for its own drafts, CON-10). |
| `updatedAt`  | ISO 8601                                                       | Last edit of the item (already on `/insights`; add it everywhere).                                                                                  | `lastmod` in the sitemap (SEO-09) and cache revalidation.                                                                                                            |

Podcast items also need:

| Field        | Type                              | Meaning                                                                                       |
| ------------ | --------------------------------- | --------------------------------------------------------------------------------------------- |
| `show`       | `immortal-dragons` or `long-talk` | Replaces `category` values `podcast_id` / `podcast_lt` as a stable slug.                      |
| `number`     | integer                           | Episode number within its show (both shows restart at E01).                                   |
| `title_en`   | string                            | English title, written or approved by a person.                                               |
| `guests`     | array of `{ name, role }`         | Guests with roles, names spelled as the show spells them.                                     |
| `releasedAt` | ISO 8601                          | Release date from the hosted feed (today the site only has `createdAt`, the CMS insert time). |

## Delivery and caching

- Keep the list endpoints; return the new fields on them so one request still fills a page.
- Send `Cache-Control: public, max-age=60, stale-while-revalidate=86400` and an `ETag` on list endpoints, and gzip or
  brotli JSON (today a cold playlist request is 1.35 MB uncompressed; PERF-07 asked for the same).
- On publish or edit, call the site's revalidation endpoint with the item's type (planned with SEO-04's IndexNow
  ping); the site fetches feeds in Server Components with cache tags per type (`insights`, `weekly`, `podcast`).

## Until the API has these fields

The site keeps typed overrides in the repo, keyed by the API item id, validated like every other record
(`FeedOverride` in `src/content/overrides.ts`; the list is empty until CON-09 needs it). An override sets `type`,
`lang`, `summary_en`, `summary_zh`, `about` or `slug` for one item. Overrides follow the same approval rule as all
copy: a summary written by an agent is a draft until the owner approves it. When the API ships a field, delete the
overrides for it.

## Not asked for

No third-party CMS (the plan's recommendation). Fund facts, companies, themes and section copy stay in the repo,
where every change is reviewed in a pull request and validated at build time.
