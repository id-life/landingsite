import { DEPLOY_ENV } from '@/constants/env';

/**
 * ⚠ DRAFT COPY - NOT APPROVED BY THE OWNER. ⚠
 *
 * Every visitor-facing string of the consent banner and the "Privacy choices" link lives here, and only here.
 * They are agent drafts written from what the code actually does (GA4 under Consent Mode v2, error reports,
 * hosting logs); they are not legal advice and have not been reviewed by counsel.
 *
 * While `status` is 'draft', no build renders any of this (SHOW_DRAFT_CONSENT_COPY below is off): no banner and no
 * "Privacy choices" link.
 * Analytics then stays off in opt-in regions (there is nobody to ask) and runs with the stored or regional default
 * elsewhere. With SHOW_DRAFT_CONSENT_COPY on, non-production builds render the drafts with a visible "Draft text"
 * marker so the mechanism can be tested. To ship: the owner (and counsel) approve or rewrite the strings below, set `status` to 'approved' and
 * set `privacyPath` once the /privacy page (CON-02) exists.
 */
export const CONSENT_COPY = {
  status: 'draft' as 'draft' | 'approved',
  /** Path of the privacy notice, once CON-02 publishes it; null hides the link. */
  privacyPath: null as string | null,
  en: {
    title: 'Privacy choices',
    body: 'With your permission we use Google Analytics to learn which parts of this site are useful. It sets cookies only if you accept, and advertising features are off. Error reports and basic hosting logs are always collected to keep the site working.',
    accept: 'Accept',
    reject: 'Reject',
    notice: 'Privacy notice',
    link: 'Privacy choices',
  },
  zh: {
    title: '隐私选项',
    body: '经您同意后，我们使用 Google Analytics 了解本站哪些内容有用。只有在您接受后才会设置 Cookie，广告功能始终关闭。为保证网站正常运行，我们始终会收集错误报告和基本的托管日志。',
    accept: '接受',
    reject: '拒绝',
    notice: '隐私声明',
    link: '隐私选项',
  },
  draftMarker: 'Draft text, not approved',
} as const;

/**
 * The one switch for showing the draft copy in non-production builds: off. The owner reviews the preview builds,
 * and this text is a draft he has not seen (his answer on legal pages, question 20: "not needed for now"), so no
 * build renders the banner or the "Privacy choices" link until the copy is approved. Turn it on only to test the
 * banner by hand.
 */
export const SHOW_DRAFT_CONSENT_COPY = false;

/** Only approved copy is rendered; draft copy only in a non-production build with the switch on, marked as a draft. */
export const canRenderConsentCopy = () =>
  CONSENT_COPY.status === 'approved' || (SHOW_DRAFT_CONSENT_COPY && DEPLOY_ENV !== 'production');
export const isDraftCopy = () => CONSENT_COPY.status !== 'approved';
