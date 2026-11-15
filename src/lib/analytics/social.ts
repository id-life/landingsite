import { trackOutbound } from './outbound';

const PODCAST_PLATFORMS = ['spotify', 'podcast', 'xyz', 'xiaoyuzhou'];

/** A footer or contact-block link to one of the fund's channels (it was medium_click with a label). */
export function trackChannelLink(type: string, href: string, placement: string) {
  trackOutbound(href, 'outbound_click', {
    link_type: PODCAST_PLATFORMS.includes(type) ? 'podcast_platform' : type === 'media' ? 'press' : 'social',
    item_id: type,
    placement,
  });
}
