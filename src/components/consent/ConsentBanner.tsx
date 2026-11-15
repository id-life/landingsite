'use client';

import { useAtomValue } from 'jotai';
import { useEffect, useId, useRef, useSyncExternalStore } from 'react';
import { isSubscribeShowAtom } from '@/atoms/footer';
import { ANALYTICS_ENABLED } from '@/lib/analytics/config';
import { canRenderConsentCopy, CONSENT_COPY, isDraftCopy } from '@/lib/analytics/consent-copy';
import {
  chooseConsent,
  closePrivacyChoices,
  getConsentState,
  openPrivacyChoices,
  subscribeConsent,
} from '@/lib/analytics/consent';

// Sizes are in px: the experience scales its rem with the viewport (a rem-based 14 px rendered at 6 px on an 820 px
// tablet), and the choice must stay legible and at least 44 px tall everywhere. Accept and Reject share one class,
// so they are always the same size and weight.
const BUTTON =
  'min-h-[44px] flex-1 border-2 border-white px-4 py-2 text-[14px]/[20px] font-semibold transition-colors hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

/**
 * The consent banner (DATA-01): a compact floating panel, bilingual, with Accept and Reject of equal weight. It opens by
 * itself only for visitors in opt-in regions without an answer, and from any "Privacy choices" link. It sits above the
 * 3D loader (z-index 500), so a visitor can answer while the experience loads, and it floats between the header and
 * the bottom control band (START, the section arrows, SCROLL, the music player and the phone Connect chip all sit in
 * the lowest 70 px), so nothing the visitor needs is under it while it is unanswered. It steps aside
 * while the newsletter popup is open, so the two are never stacked. Production renders nothing while its text is a
 * draft (./consent-copy.ts).
 */
export default function ConsentBanner() {
  const consent = useSyncExternalStore(subscribeConsent, getConsentState, getConsentState);
  const subscribeOpen = useAtomValue(isSubscribeShowAtom);
  const titleId = useId();
  const firstButton = useRef<HTMLButtonElement>(null);
  const open = consent.bannerOpen && !subscribeOpen && canRenderConsentCopy();
  const reopened = consent.reason === 'stored' || consent.analytics === 'granted';

  useEffect(() => {
    if (open && reopened) firstButton.current?.focus({ preventScroll: true });
  }, [open, reopened]);

  if (!open) return null;
  const { en, zh } = CONSENT_COPY;
  return (
    <section
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      data-consent-banner=""
      className="fixed inset-x-3 bottom-[92px] z-[510] mx-auto max-w-[760px] border-2 border-white bg-black/85 px-4 py-3 text-white backdrop-blur-md notMobile:bottom-[96px] notMobile:px-6 notMobile:py-4"
    >
      <div className="flex flex-col gap-3 notMobile:flex-row notMobile:items-center notMobile:gap-6">
        <div className="flex-1 text-[12px]/[18px]">
          <h2 id={titleId} className="font-oxanium text-[14px]/[20px] font-bold">
            {en.title} · {zh.title}
            {isDraftCopy() && (
              <span className="ml-2 border border-yellow-300 px-1 align-middle text-[10px] font-semibold text-yellow-300">
                {CONSENT_COPY.draftMarker}
              </span>
            )}
          </h2>
          <p className="mt-1">{en.body}</p>
          <p lang="zh-CN" className="mt-1">
            {zh.body}
          </p>
          {CONSENT_COPY.privacyPath && (
            <a href={CONSENT_COPY.privacyPath} className="mt-1 inline-block underline">
              {en.notice} · {zh.notice}
            </a>
          )}
        </div>
        <div className="flex gap-3 notMobile:w-[320px]">
          <button ref={firstButton} type="button" className={BUTTON} onClick={() => chooseConsent('granted')}>
            {en.accept} · {zh.accept}
          </button>
          <button type="button" className={BUTTON} onClick={() => chooseConsent('denied')}>
            {en.reject} · {zh.reject}
          </button>
        </div>
        {reopened && (
          <button type="button" className="sr-only focus:not-sr-only" onClick={closePrivacyChoices}>
            Close
          </button>
        )}
      </div>
    </section>
  );
}

/** "Privacy choices" link for the footers: reopens the banner. Renders nothing while its text may not be shown. */
export function PrivacyChoicesLink({ className }: { className?: string }) {
  if (!ANALYTICS_ENABLED || !canRenderConsentCopy()) return null;
  return (
    <button type="button" className={className ?? 'underline opacity-70 hover:opacity-100'} onClick={openPrivacyChoices}>
      {CONSENT_COPY.en.link} · {CONSENT_COPY.zh.link}
    </button>
  );
}
