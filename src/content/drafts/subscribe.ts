// One subscribe promise per locale (CON-20, CON-21). Two promises are live today (src/content/subscribe.ts).
import { defineDrafts } from './define';

export const SUBSCRIBE_DRAFTS = defineDrafts('subscribe.ts', [
  {
    id: 'subscribe-promise',
    item: 'CON-20',
    title: 'Subscribe: one promise next to every form',
    body: {
      en: 'Get news from Immortal Dragons by email: portfolio updates, new podcast episodes and our longevity digest.',
    },
    approval: {
      status: 'draft',
      replaces:
        'Join our longevity circle for priority access to pioneer research / Join our Longevity Circle and receive the latest insights & research',
      sources: [
        { ref: 'src/content/subscribe.ts (both live promises)' },
        { ref: 'id-platform /longevity-weekly/list (62 weekly digest issues), /podcast/list (41 episodes)' },
      ],
      questions: [
        'What does a subscriber receive today, how often, and in which language? The promise must state content, cadence and language (CON-21); it will be completed with your answer.',
        'If nothing is sent yet, the promise should say when the first issue goes out instead (CON-21).',
      ],
    },
  },
]);
