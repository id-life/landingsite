import { GA_EVENT_NAMES } from '@/constants/ga';
import { trackEvent } from '@/hooks/useGA';
import jsonp from '@/utils/jsonp';

const MAILCHIMP_ENDPOINT = 'https://life.us11.list-manage.com/subscribe/post-json';

type SubscribeResult = 'success' | 'already_subscribed' | 'error' | 'timeout';

function resultOf(response: { result?: string; msg?: string } | undefined): SubscribeResult {
  if (response?.result === 'success') return 'success';
  return /already subscribed/i.test(response?.msg ?? '') ? 'already_subscribed' : 'error';
}

/**
 * Send a newsletter sign-up to Mailchimp and record how it ended.
 *
 * `subscribe_letter` fires when the form is submitted, whatever happens next, so on its own it
 * overstates sign-ups. `subscribe_result` says whether Mailchimp accepted the address.
 * The returned promise behaves exactly like the underlying JSONP request.
 */
export function postSubscribe(querystring: string, source: string): Promise<any> {
  const request = jsonp(`${MAILCHIMP_ENDPOINT}?${querystring}`);
  const track = (result: SubscribeResult) => trackEvent({ name: GA_EVENT_NAMES.SUBSCRIBE_RESULT, label: source, result });
  request.then(
    (response) => track(resultOf(response)),
    () => track('timeout'),
  );
  return request;
}
