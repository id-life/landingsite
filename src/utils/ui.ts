import gsap from 'gsap';

/**
 * Ensures mobile UI elements (nav and fixed UI) are visible.
 * Used to fix UI visibility issues after browser navigation (e.g., back button).
 */
export function ensureMobileUIVisible() {
  const mobileNav = document.querySelector('#mobile-nav');
  const mobileFixedUI = document.querySelector('#mobile-fixed-ui');
  if (mobileNav) gsap.set(mobileNav, { opacity: 1 });
  if (mobileFixedUI) gsap.set(mobileFixedUI, { opacity: 1 });
}

/**
 * Ensures desktop UI elements (nav and fixed UI) are visible.
 * Used to fix UI visibility issues after browser navigation (e.g., back button).
 */
export function ensureDesktopUIVisible() {
  const nav = document.querySelector('#nav');
  const pcFixedUI = document.querySelector('#pc-fixed-ui');
  if (nav) gsap.set(nav, { opacity: 1 });
  if (pcFixedUI) gsap.set(pcFixedUI, { opacity: 1 });
}

/**
 * Ensures UI elements are visible based on platform.
 * Only sets opacity if currently hidden (opacity: 0).
 */
export function ensureUIVisibleIfHidden(isMobile: boolean) {
  if (isMobile) {
    const mobileFixedUI = document.querySelector('#mobile-fixed-ui');
    const currentOpacity = mobileFixedUI ? window.getComputedStyle(mobileFixedUI).opacity : '0';
    if (currentOpacity === '0') {
      ensureMobileUIVisible();
    }
  } else {
    const pcFixedUI = document.querySelector('#pc-fixed-ui');
    const currentOpacity = pcFixedUI ? window.getComputedStyle(pcFixedUI).opacity : '0';
    if (currentOpacity === '0') {
      ensureDesktopUIVisible();
    }
  }
}
