import { spectrumBaseData } from '@/app/spectrum/_components/spectrumData';
import { isInternalHref } from '@/constants/site';
import type { OUTBOUND_LINK_TYPES } from './events';
import { trackOutbound } from './outbound';
import { slugId } from './track';

type LinkType = (typeof OUTBOUND_LINK_TYPES)[number];

/** Spectrum groups by what their links lead to. */
const GROUP_LINK_TYPE: Record<string, LinkType> = {
  'Translation & Publishing': 'book',
  Evangelism: 'talk',
  'Digital Twin': 'other',
  'Peer Reviews': 'research',
  'Proudly Supporting': 'sponsor',
};

const typeByLabel = new Map<string, LinkType>();
for (const group of spectrumBaseData) {
  for (const link of group.links) typeByLabel.set(link.label, GROUP_LINK_TYPE[group.title] ?? 'other');
}

/**
 * A Spectrum link was activated (DATA-03): external links send outbound_click typed by their group; links to a
 * section of this site send nothing (the section change is its own page_view).
 */
export function trackSpectrumLink(item: { key?: string; label: string; link?: string }, fallback: LinkType = 'other') {
  if (!item.link || isInternalHref(item.link)) return;
  trackOutbound(item.link, 'outbound_click', {
    link_type: typeByLabel.get(item.label) ?? fallback,
    item_id: slugId(item.key ?? item.label),
    placement: 'spectrum',
  });
}
