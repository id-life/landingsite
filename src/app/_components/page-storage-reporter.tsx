import { GA_EVENT_NAMES } from '@/constants/ga';
import { STORAGE_KEY } from '@/constants/storage';
import Script from 'next/script';

export function SubscribePopupStorageReporter() {
  const localStorageKey = JSON.stringify(STORAGE_KEY.SUBSCRIBE_POPUP_DISMISSED);
  const eventName = JSON.stringify(GA_EVENT_NAMES.SUBSCRIBE_POPUP_STORAGE);
  const scriptContent = `
(function() {
  function sendGAEvent() { (window.dataLayer??=[]).push(arguments) }
  sendGAEvent('set', { visit_id: crypto.randomUUID() });
  const popupDismissed = localStorage.getItem(${localStorageKey});
  sendGAEvent('event', ${eventName}, { event_label: popupDismissed ? 'true' : 'false' });
})()`;
  return <Script id="subscribe-popup-storage-reporter">{scriptContent}</Script>;
}
