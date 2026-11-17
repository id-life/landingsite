import type { Swiper as SwiperType } from 'swiper';

/**
 * Keyboard rule for the Insights rows (NEWS & TALKS, PODCAST, 长生周报), on both decks: only the cards of the page in
 * view are keyboard stops; the cards of the other pages are inert, and the arrows (which are stops) change the page.
 *
 * The cards are real links, so without this a Tab or Shift+Tab could focus a card on another page and the browser
 * scrolled the row's clipped box sideways to show it, behind the carousel's back: cards cut in half, an empty half, a
 * page count that no longer matched, arrows that could not repair it. Letting the carousel follow the focus instead
 * would walk a keyboard user through every card of every page (167 stops on the laptop) and still race the browser's
 * own scroll; the original's cards were no stops at all, so its arrows were the way through the pages.
 *
 * Spread onto each row's <Swiper>. The inert marks are set on the slides' own elements (React does not render them),
 * after every settle, resize and change of slides.
 */
function syncInert(swiper: SwiperType) {
  for (const slide of swiper.slides) {
    const inView = slide.classList.contains('swiper-slide-fully-visible');
    slide.inert = !inView;
  }
}

/** The row's clipped box never scrolls itself: Swiper moves its pages by transform, so any scroll is a stray one. */
function pinScroll(swiper: SwiperType) {
  const el = swiper.el;
  if (!el || el.dataset.scrollPinned) return;
  el.dataset.scrollPinned = '';
  el.addEventListener('scroll', () => {
    if (el.scrollLeft !== 0) el.scrollLeft = 0;
    if (el.scrollTop !== 0) el.scrollTop = 0;
  });
}

export const rowKeyboardProps = {
  watchSlidesProgress: true,
  onAfterInit: (swiper: SwiperType) => {
    pinScroll(swiper);
    syncInert(swiper);
  },
  onSlideChangeTransitionEnd: syncInert,
  onTransitionEnd: syncInert,
  onResize: syncInert,
  onSlidesUpdated: syncInert,
};
