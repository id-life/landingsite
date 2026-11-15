// The newsletter promise next to every subscribe form. Two wordings were live at the baseline; both are kept here so
// the one-string promise the owner approves (src/content/drafts/subscribe.ts, CON-20) is a single edit.
import { live } from './approval';
import type { Copy } from './schema';

export const SUBSCRIBE_PROMISES: Copy[] = [
  // Connect footer (desktop and phone) and the news footer.
  {
    id: 'priority-access',
    text: { en: 'Join our longevity circle for priority access to pioneer research' },
    approval: live(),
  },
  // The experience footer (desktop and phone).
  {
    id: 'latest-insights',
    text: { en: 'Join our Longevity Circle and receive the latest insights & research' },
    approval: live(),
  },
];

const promise = (id: string) => SUBSCRIBE_PROMISES.find((item) => item.id === id)?.text.en ?? '';

export const SUBSCRIBE_PROMISE = {
  priorityAccess: promise('priority-access'),
  latestInsights: promise('latest-insights'),
};
