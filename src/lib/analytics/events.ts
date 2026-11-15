/**
 * The analytics event contract: every event the site may send to GA4, with its parameters.
 *
 * This catalog is the single source of truth. track() (./track.ts) only accepts names listed here and the
 * parameters their entry declares (TypeScript checks both, see test/analytics-contract.type-test.ts), ./EVENTS.md and
 * ./events.json are generated from it (npm test fails when they are stale), and the Playwright contract tests
 * read the JSON export.
 *
 * Rules: snake_case names of at most 40 characters; stable ids instead of titles; numbers as numbers (flags
 * are 0 or 1); no event_label; no user identifiers. Shared context (layout, section_id, page_load_id and
 * traffic_type) is added by track(), not by callers.
 */

type StringParam<V extends string = string> = {
  readonly t: 'string';
  readonly required: boolean;
  readonly values?: readonly V[];
  readonly doc: string;
};
type NumberParam = { readonly t: 'number'; readonly required: boolean; readonly doc: string; readonly unit?: string };
type ParamDesc = StringParam | NumberParam;

type Req<O> = O extends true ? false : true;
const str = <O extends boolean = false>(doc: string, opts?: { optional?: O }) =>
  ({ t: 'string', required: !opts?.optional, doc }) as {
    readonly t: 'string';
    readonly required: Req<O>;
    readonly doc: string;
  };
const oneOf = <const V extends string, O extends boolean = false>(values: readonly V[], doc: string, opts?: { optional?: O }) =>
  ({ t: 'string', required: !opts?.optional, values, doc }) as {
    readonly t: 'string';
    readonly required: Req<O>;
    readonly values: readonly V[];
    readonly doc: string;
  };
const num = <O extends boolean = false>(doc: string, opts?: { optional?: O; unit?: string }) =>
  ({ t: 'number', required: !opts?.optional, doc, ...(opts?.unit ? { unit: opts.unit } : {}) }) as {
    readonly t: 'number';
    readonly required: Req<O>;
    readonly doc: string;
    readonly unit?: string;
  };
const flag = (doc: string) => num(`${doc} (1 = yes, 0 = no)`);

type EventDesc = {
  readonly when: string;
  /** A key event in GA4 (marked by the owner in GA4 Admin). */
  readonly key?: boolean;
  readonly params: Readonly<Record<string, ParamDesc>>;
};
const ev = <const P extends Record<string, ParamDesc>>(when: string, params: P, opts: { key?: boolean } = {}) =>
  ({ when, params, ...opts }) as const;

export const LAYOUTS = ['desktop', 'mobile'] as const;
export type Layout = (typeof LAYOUTS)[number];

export const SECTION_IDS = [
  'vision_page',
  'portfolio_page',
  'insights_page',
  'spectrum_page',
  'engagement_page',
  'twin_page',
  'connect_page',
] as const;

export const NEWSLETTER_PLACEMENTS = ['nav', 'content', 'connect', 'footer'] as const;
export const NEWSLETTER_ERROR_CODES = [
  'already_subscribed',
  'invalid_email',
  'rate_limited',
  'spam_check',
  'upstream_error',
  'timeout',
  'error',
] as const;
export const OUTBOUND_LINK_TYPES = [
  'press',
  'talk',
  'sponsor',
  'initiative',
  'social',
  'podcast_platform',
  'book',
  'research',
  'video',
  'other',
] as const;
export const EXPERIENCE_ERROR_KINDS = [
  'webgl_unavailable',
  'webgl_context_lost',
  'webgl_context_restored',
  'webgl_render',
  'asset_failed',
  'loader_timeout',
] as const;

const placement = str('Where on the site the control sits (e.g. footer, connect, portfolio_grid, insights_news)');

export const EVENTS = {
  // Newsletter funnel (one event per step; newsletter_subscribe only on a confirmed new address).
  newsletter_view: ev('The subscribe popup is opened on request', {
    placement: oneOf(NEWSLETTER_PLACEMENTS, 'Which control opened it'),
    previously_dismissed: flag('The visitor had explicitly dismissed the prompt before'),
  }),
  newsletter_close: ev('The open popup is closed', {
    placement: oneOf(NEWSLETTER_PLACEMENTS, 'Which control had opened it'),
    method: oneOf(['x', 'escape', 'outside', 'scroll', 'toggle'], 'How it was closed'),
  }),
  newsletter_submit: ev('A subscribe form is submitted with a well-formed address', {
    placement: oneOf(NEWSLETTER_PLACEMENTS, 'Which form'),
  }),
  newsletter_subscribe: ev(
    'The subscribe route confirmed a new address (subscribed, or pending under double opt-in)',
    {
      placement: oneOf(NEWSLETTER_PLACEMENTS, 'Which form'),
      status: oneOf(['subscribed', 'pending'], 'Mailchimp status of the new member'),
    },
    { key: true },
  ),
  newsletter_error: ev('A submit did not add a new address', {
    placement: oneOf(NEWSLETTER_PLACEMENTS, 'Which form'),
    error_code: oneOf(NEWSLETTER_ERROR_CODES, 'Typed result of the subscribe route'),
  }),

  // Key business events.
  contact_intent: ev(
    'The visitor clicks the contact email link or copies the address',
    { method: oneOf(['mailto', 'copy_email'], 'Link or copy button'), placement },
    { key: true },
  ),
  portfolio_outbound_click: ev(
    "The visitor opens a portfolio company's website",
    {
      company_id: str('Stable id of the company (slug of its name)'),
      link_domain: str('Host of the destination'),
      placement,
    },
    { key: true },
  ),

  // Supporting engagement events.
  outbound_click: ev('The visitor opens an external link (press, talk, sponsor, initiative, social, podcast)', {
    link_type: oneOf(OUTBOUND_LINK_TYPES, 'What kind of destination'),
    item_id: str('Stable id of the item (slug, episode id or platform name)'),
    link_domain: str('Host of the destination'),
    placement,
  }),
  nav_click: ev('The visitor uses the section navigation', {
    target_section: str('Section id or route the control leads to'),
    source: oneOf(['nav', 'mobile_menu', 'logo'], 'Which control'),
  }),
  news_item_click: ev('The visitor opens a news card', {
    item_id: str('News id or slug'),
    lang: str('Language of the item when known', { optional: true }),
    placement,
  }),
  video_open: ev('A video player opens (modal or new tab)', {
    video_id: str('YouTube id or slug of the video'),
    placement,
  }),
  video_progress: ev('An embedded YouTube video passes 25, 50, 75 or 100 percent', {
    video_id: str('YouTube id'),
    percent: num('Share of the video watched', { unit: 'percent' }),
  }),
  item_inspect: ev('The visitor inspects an item: 600 ms of mouse dwell, or a tap that opens its detail', {
    item_id: str('Stable id of the item'),
    section_id: str('Section the item belongs to'),
  }),
  read_depth: ev('A content page (news article, podcast episode) is scrolled to 50 or 90 percent', {
    percent: num('Depth reached', { unit: 'percent' }),
    item_id: str('News or episode id'),
  }),
  tab_select: ev('The visitor switches a content tab', {
    tab: str('Tab id'),
    item_id: str('Episode or item id'),
  }),
  file_download: ev('Not sent by code: GA4 enhanced measurement records clicks on PDF and CSV links', {}),

  // Podcast and music (DATA-podcast replaces these with media-element analytics in wave 2).
  episode_play: ev('Play or pause on the episode page player', {
    episode_id: str('Episode id'),
    action: oneOf(['start', 'pause'], 'Button pressed'),
  }),
  episode_end: ev('The episode audio ends', { episode_id: str('Episode id') }),
  timeline_jump: ev('A timestamp in the show notes is clicked', {
    episode_id: str('Episode id'),
    position_s: num('Target position', { unit: 'seconds' }),
  }),
  episode_item_click: ev('An episode is opened from the podcast list', {
    episode_id: str('Episode id'),
    channel: str('Podcast channel'),
  }),
  music_play: ev('The visitor starts the site player', {
    track_id: str('Track id or title slug'),
    trigger: oneOf(['user'], 'Who started it'),
  }),
  player_control: ev('A control of the site player is used', {
    control: oneOf(['playlist', 'podcast_channel', 'play_mode', 'track'], 'Which control'),
    value: str('New value (list, channel, mode or track id)'),
  }),

  // Digital twin and influence network.
  twin_interaction: ev('A Digital Twin control is used', {
    control: oneOf(['model', 'skin', 'anatomy_camera', 'report'], 'Which control'),
    value: str('New value'),
    model: str('Prediction model shown', { optional: true }),
  }),
  twin_model_ready: ev('A Digital Twin model finished loading after a switch', {
    model: str('Model or view id'),
    view: str('skin or anatomy'),
    load_ms: num('Time from the switch to the loaded model', { unit: 'ms' }),
  }),
  relation_form_open: ev('The influence-network form is opened', {}),
  relation_submit: ev('The influence-network API accepted a submission', {}),

  // Experience health.
  experience_ready: ev('The 3D experience loader hides (once per document)', {
    load_ms: num('Time from navigation start to the loader hiding', { unit: 'ms' }),
    assets_ms: num('Time the loader waited for the hero assets', { unit: 'ms' }),
    layout: oneOf(LAYOUTS, 'Tree that was shown'),
    cache_state: oneOf(['warm', 'cold', 'unknown'], 'Hero model came from the HTTP cache (warm) or the network'),
    fail_open: flag('The loader gave up waiting (15 s or an asset error) and revealed the UI'),
  }),
  experience_error: ev('A 3D failure, once per kind per document (asset_failed once per file)', {
    kind: oneOf(EXPERIENCE_ERROR_KINDS, 'What failed'),
    detail: str('Canvas name or file name', { optional: true }),
  }),
  layout_change: ev('The page swapped between the desktop and the mobile tree (a resize across 768 px)', {
    from: oneOf(LAYOUTS, 'Previous tree'),
    to: oneOf(LAYOUTS, 'New tree'),
  }),
  visibility_summary: ev('On pagehide, once per page load, when the tab was hidden at least once', {
    hidden_ms: num('Time hidden', { unit: 'ms' }),
    visible_ms: num('Time visible', { unit: 'ms' }),
    changes: num('Number of visibility changes'),
  }),
  web_vital: ev('A Core Web Vital is reported (web-vitals attribution build; skipped when Speed Insights is on)', {
    metric_name: oneOf(['CLS', 'FCP', 'INP', 'LCP', 'TTFB'], 'Metric'),
    metric_value: num('Value (CLS x 1000, others in ms)'),
    metric_delta: num('Change since the last report of this metric (same units)'),
    metric_rating: oneOf(['good', 'needs-improvement', 'poor'], 'Rating'),
    metric_id: str('web-vitals id of this metric instance, to sum deltas'),
    navigation_type: str('navigate, reload, back-forward, ...'),
    debug_target: str('Selector of the LCP element, INP target or largest CLS shift; (none) when nothing to attribute', {
      optional: true,
    }),
    page_location: str('The landing URL of the document the vital belongs to'),
    interaction_type: str('INP only: pointer or keyboard', { optional: true }),
    load_state: str('INP only: load state at the interaction', { optional: true }),
  }),
} as const satisfies Record<string, EventDesc>;

export type EventName = keyof typeof EVENTS;

type ParamType<D> = D extends { t: 'number' } ? number : D extends { values: readonly (infer V)[] } ? V : string;
type Spec<K extends EventName> = (typeof EVENTS)[K]['params'];
type RequiredKeys<S> = { [P in keyof S]: S[P] extends { required: true } ? P : never }[keyof S];
type OptionalKeys<S> = Exclude<keyof S, RequiredKeys<S>>;
type Simplify<T> = { [P in keyof T]: T[P] };

/** The parameters of event K: required ones must be present, nothing undeclared is allowed. */
export type EventParams<K extends EventName> = Simplify<
  { [P in RequiredKeys<Spec<K>>]: ParamType<Spec<K>[P]> } & { [P in OptionalKeys<Spec<K>>]?: ParamType<Spec<K>[P]> }
>;

/** Key events (marked in GA4 Admin by the owner). */
export const KEY_EVENTS = (Object.keys(EVENTS) as EventName[]).filter((name) => (EVENTS[name] as EventDesc).key === true);

/** Context track() adds to every event. */
export const CONTEXT_PARAMS = {
  layout: 'desktop or mobile tree',
  section_id: 'Section of the experience the URL points at (absent on content pages)',
  page_load_id: 'Random id of this page load (joins the events of one load; not stored anywhere)',
  traffic_type: '"internal" while the ?internal=1 flag is set (GA4 internal-traffic filter)',
} as const;
