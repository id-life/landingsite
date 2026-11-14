import { GA_EVENT_NAMES } from '@/constants/ga';
import { STORAGE_KEY } from '@/constants/storage';
import Script from 'next/script';

export function SubscribePopupStorageReporter() {
  const localStorageKey = JSON.stringify(STORAGE_KEY.SUBSCRIBE_POPUP_DISMISSED);
  const eventName = JSON.stringify(GA_EVENT_NAMES.SUBSCRIBE_POPUP_STORAGE);
  // The id is generated in the browser: a server-side id was baked into the static HTML and
  // shared by every visitor of the page.
  const scriptContent = `
(function() {
  function sendGAEvent() { (window.dataLayer??=[]).push(arguments) }
  var visitId = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2);
  sendGAEvent('set', 'user_properties', { visit_id: visitId });
  const popupDismissed = localStorage.getItem(${localStorageKey});
  sendGAEvent('event', ${eventName}, { event_label: popupDismissed ? 'true' : 'false' });
})()`;

  return <Script id="subscribe-popup-storage-reporter">{scriptContent}</Script>;
}
