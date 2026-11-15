import { track } from '@/lib/analytics/track';

/** Opening one of the Connect section's inner pages: one item_inspect per page per page load (DATA-11). */
export function useConnectShowEvent() {
  const sendValueShowEvent = (index: number, action: 'click' | 'scroll') => {
    if (action !== 'click') return;
    const itemId = `connect_${index}`;
    track('item_inspect', { item_id: itemId, section_id: 'connect_page' }, { once: `inspect:connect_page:${itemId}` });
  };

  return { sendValueShowEvent };
}
