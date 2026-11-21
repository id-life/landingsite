# Analytics events

Generated from `src/lib/analytics/events.ts` (`UPDATE_ANALYTICS_DOCS=1 npm test` rewrites this file; `npm test` fails
while it is stale). Send events only with `track()` from `src/lib/analytics/track.ts`.

What the podcast pages and the player sent before, and the event that carries each fact now: [BEFORE-AND-NOW.md](./BEFORE-AND-NOW.md).

Key events (mark them in GA4 Admin): `newsletter_subscribe`, `contact_intent`, `portfolio_outbound_click`, `podcast_play`.

## Context added to every event

| parameter | meaning |
|---|---|
| `layout` | desktop or mobile tree |
| `section_id` | Section of the experience the URL points at (web_vital: the landing URL; absent on content pages) |
| `page_load_id` | Random id of this page load (joins the events of one load; not stored anywhere) |
| `traffic_type` | "internal" while the ?internal=1 flag is set (GA4 internal-traffic filter) |

## Events

### `newsletter_view`

The subscribe popup is opened on request

| parameter | type | required | meaning |
|---|---|---|---|
| `placement` | `nav` \| `content` \| `connect` \| `footer` \| `auto` | yes | Which control opened it |
| `previously_dismissed` | number | yes | The visitor had explicitly dismissed the prompt before (1 = yes, 0 = no) |

### `newsletter_close`

The open popup is closed

| parameter | type | required | meaning |
|---|---|---|---|
| `placement` | `nav` \| `content` \| `connect` \| `footer` \| `auto` | yes | Which control had opened it |
| `method` | `x` \| `escape` \| `outside` \| `scroll` \| `toggle` | yes | How it was closed |

### `newsletter_submit`

A subscribe form is submitted with a well-formed address

| parameter | type | required | meaning |
|---|---|---|---|
| `placement` | `nav` \| `content` \| `connect` \| `footer` \| `auto` | yes | Which form |

### `newsletter_subscribe` (key event)

The subscribe route confirmed a new address (subscribed, or pending under double opt-in)

| parameter | type | required | meaning |
|---|---|---|---|
| `placement` | `nav` \| `content` \| `connect` \| `footer` \| `auto` | yes | Which form |
| `status` | `subscribed` \| `pending` | yes | Mailchimp status of the new member |

### `newsletter_error`

A submit did not add a new address

| parameter | type | required | meaning |
|---|---|---|---|
| `placement` | `nav` \| `content` \| `connect` \| `footer` \| `auto` | yes | Which form |
| `error_code` | `already_subscribed` \| `invalid_email` \| `rate_limited` \| `spam_check` \| `upstream_error` \| `timeout` \| `error` | yes | Typed result of the subscribe route |

### `contact_intent` (key event)

The visitor clicks the contact email link or copies the address

| parameter | type | required | meaning |
|---|---|---|---|
| `method` | `mailto` \| `copy_email` | yes | Link or copy button |
| `placement` | string | yes | Where on the site the control sits (e.g. footer, connect, portfolio_grid, insights_news) |

### `portfolio_outbound_click` (key event)

The visitor opens a portfolio company's website

| parameter | type | required | meaning |
|---|---|---|---|
| `company_id` | string | yes | Stable id of the company (slug of its name) |
| `link_domain` | string | yes | Host of the destination |
| `placement` | string | yes | Where on the site the control sits (e.g. footer, connect, portfolio_grid, insights_news) |

### `outbound_click`

The visitor opens an external link (press, talk, sponsor, initiative, social, podcast)

| parameter | type | required | meaning |
|---|---|---|---|
| `link_type` | `press` \| `talk` \| `sponsor` \| `initiative` \| `social` \| `podcast_platform` \| `book` \| `research` \| `video` \| `other` | yes | What kind of destination |
| `item_id` | string | yes | Stable id of the item (slug, episode id or platform name) |
| `link_domain` | string | yes | Host of the destination |
| `placement` | string | yes | Where on the site the control sits (e.g. footer, connect, portfolio_grid, insights_news) |
| `platform` | `xiaoyuzhou` \| `spotify` \| `apple_podcasts` | no | podcast_platform only: which listening platform |
| `episode_id` | string | no | podcast_platform only: the episode the link is for (absent for a whole show) |

### `nav_click`

The visitor uses the section navigation

| parameter | type | required | meaning |
|---|---|---|---|
| `target_section` | string | yes | Section id or route the control leads to |
| `source` | `nav` \| `mobile_menu` \| `logo` | yes | Which control |

### `news_item_click`

The visitor opens a news card

| parameter | type | required | meaning |
|---|---|---|---|
| `item_id` | string | yes | News id or slug |
| `lang` | string | no | Language of the item when known |
| `placement` | string | yes | Where on the site the control sits (e.g. footer, connect, portfolio_grid, insights_news) |

### `video_open`

A video player opens (modal or new tab)

| parameter | type | required | meaning |
|---|---|---|---|
| `video_id` | string | yes | YouTube id or slug of the video |
| `placement` | string | yes | Where on the site the control sits (e.g. footer, connect, portfolio_grid, insights_news) |

### `video_progress`

An embedded YouTube video passes 25, 50, 75 or 100 percent

| parameter | type | required | meaning |
|---|---|---|---|
| `video_id` | string | yes | YouTube id |
| `percent` | number (percent) | yes | Share of the video watched |

### `item_inspect`

The visitor inspects an item: 600 ms of mouse dwell, or a tap that opens its detail

| parameter | type | required | meaning |
|---|---|---|---|
| `item_id` | string | yes | Stable id of the item |
| `section_id` | string | yes | Section the item belongs to |

### `read_depth`

A content page (news article, podcast episode) is scrolled to 50 or 90 percent

| parameter | type | required | meaning |
|---|---|---|---|
| `percent` | number (percent) | yes | Depth reached |
| `item_id` | string | yes | News or episode id |

### `tab_select`

The visitor switches a content tab

| parameter | type | required | meaning |
|---|---|---|---|
| `tab` | string | yes | Tab id |
| `item_id` | string | yes | Episode or item id |

### `file_download`

Not sent by code: GA4 enhanced measurement records clicks on PDF and CSV links

No parameters.

### `podcast_play` (key event)

An episode has played for 30 s (seeks do not count); once per episode per page

| parameter | type | required | meaning |
|---|---|---|---|
| `episode_id` | string | yes | Episode id |
| `show` | string | yes | Show id (the episode category: podcast_id or podcast_lt) |
| `source` | `episode_page` \| `site_player` | yes | Which player: the episode page or the site player |

### `podcast_progress`

Playback of an episode reaches 25, 50 or 75 percent; each once per episode per page

| parameter | type | required | meaning |
|---|---|---|---|
| `episode_id` | string | yes | Episode id |
| `show` | string | yes | Show id |
| `source` | `episode_page` \| `site_player` | yes | Which player |
| `percent` | number (percent) | yes | Share of the episode reached |

### `podcast_complete`

An episode plays to its end; once per episode per page

| parameter | type | required | meaning |
|---|---|---|---|
| `episode_id` | string | yes | Episode id |
| `show` | string | yes | Show id |
| `source` | `episode_page` \| `site_player` | yes | Which player |

### `timeline_jump`

A timestamp in the show notes is clicked

| parameter | type | required | meaning |
|---|---|---|---|
| `episode_id` | string | yes | Episode id |
| `position_s` | number (seconds) | yes | Target position |

### `episode_item_click`

An episode is opened from the podcast list

| parameter | type | required | meaning |
|---|---|---|---|
| `episode_id` | string | yes | Episode id |
| `channel` | string | yes | Podcast channel |

### `music_play`

The visitor starts the site player

| parameter | type | required | meaning |
|---|---|---|---|
| `track_id` | string | yes | Track id or title slug |
| `trigger` | `user` | yes | Who started it |

### `player_control`

A control of the site player is used

| parameter | type | required | meaning |
|---|---|---|---|
| `control` | `playlist` \| `podcast_channel` \| `play_mode` \| `track` | yes | Which control |
| `value` | string | yes | New value (list, channel, mode or track id) |

### `twin_interaction`

A Digital Twin control is used

| parameter | type | required | meaning |
|---|---|---|---|
| `control` | `model` \| `skin` \| `anatomy_camera` \| `report` | yes | Which control |
| `value` | string | yes | New value |
| `model` | string | no | Prediction model shown |

### `twin_model_ready`

A Digital Twin model finished loading after a switch

| parameter | type | required | meaning |
|---|---|---|---|
| `model` | string | yes | Model or view id |
| `view` | string | yes | skin or anatomy |
| `load_ms` | number (ms) | yes | Time from the switch to the loaded model |

### `relation_form_open`

The influence-network form is opened

No parameters.

### `relation_submit`

The influence-network API accepted a submission

No parameters.

### `experience_ready`

The 3D experience loader hides (once per document)

| parameter | type | required | meaning |
|---|---|---|---|
| `load_ms` | number (ms) | yes | Time from navigation start to the loader hiding |
| `assets_ms` | number (ms) | yes | Time the loader waited for the hero assets |
| `layout` | `desktop` \| `mobile` | yes | Tree that was shown |
| `cache_state` | `warm` \| `cold` \| `unknown` | yes | Hero model came from the HTTP cache (warm) or the network |
| `fail_open` | number | yes | The loader gave up waiting (15 s or an asset error) and revealed the UI (1 = yes, 0 = no) |
| `gpu_tier` | `low` \| `mid` \| `high` \| `none` | no | GPU quality tier the 3D ran at (MOT-06); none: no WebGL |

### `experience_error`

A 3D failure, once per kind per document (asset_failed once per file)

| parameter | type | required | meaning |
|---|---|---|---|
| `kind` | `webgl_unavailable` \| `webgl_context_lost` \| `webgl_context_restored` \| `webgl_render` \| `asset_failed` \| `loader_timeout` | yes | What failed |
| `detail` | string | no | Canvas name or file name |

### `layout_change`

The page swapped between the desktop and the mobile tree (a resize or rotation across the phone tree query)

| parameter | type | required | meaning |
|---|---|---|---|
| `from` | `desktop` \| `mobile` | yes | Previous tree |
| `to` | `desktop` \| `mobile` | yes | New tree |

### `visibility_summary`

On pagehide, once per page load, when the tab was hidden at least once

| parameter | type | required | meaning |
|---|---|---|---|
| `hidden_ms` | number (ms) | yes | Time hidden |
| `visible_ms` | number (ms) | yes | Time visible |
| `changes` | number | yes | Number of visibility changes |

### `web_vital`

A Core Web Vital is reported (web-vitals attribution build; skipped when Speed Insights is on)

| parameter | type | required | meaning |
|---|---|---|---|
| `metric_name` | `CLS` \| `FCP` \| `INP` \| `LCP` \| `TTFB` | yes | Metric |
| `metric_value` | number | yes | Value (CLS x 1000, others in ms) |
| `metric_delta` | number | yes | Change since the last report of this metric (same units) |
| `metric_rating` | `good` \| `needs-improvement` \| `poor` | yes | Rating |
| `metric_id` | string | yes | web-vitals id of this metric instance, to sum deltas |
| `navigation_type` | string | yes | navigate, reload, back-forward, ... |
| `debug_target` | string | no | Selector of the LCP element, INP target or largest CLS shift; (none) when nothing to attribute |
| `page_location` | string | yes | The landing URL of the document the vital belongs to |
| `interaction_type` | string | no | INP only: pointer or keyboard |
| `load_state` | string | no | INP only: load state at the interaction |

## Owner: GA4 Admin

Register every parameter above as an event-scoped custom dimension (limit 50), `load_ms` and the other `ms`
parameters as custom metrics in milliseconds, and mark the key events listed at the top.
