'use client';

import { noteInnerPage, registerInnerPage } from '@/motion/innerPages';
import { type RefObject, useEffect } from 'react';
import type { Swiper as SwiperType } from 'swiper';

const SECTION = 'insights_page';

/** An Insights row moved to another page: kept in the history entry (NAV-02). */
export const noteRowPage = () => noteInnerPage(SECTION);

// A waiting restore is tried again when a row's Swiper is created or its slides arrive (the cards load after the page).
const slidesChanged = new Set<() => void>();
const fireSlidesChanged = () => slidesChanged.forEach((onChange) => onChange());
/** Called by each row's Swiper as it is created (onBeforeInit). */
export function rowSwiperCreated(swiper: SwiperType) {
  swiper.on('afterInit', fireSlidesChanged);
  swiper.on('slidesLengthChange', fireSlidesChanged);
}

/**
 * Keeps the page an Insights row shows (its Swiper's active slide) in the history entry, and puts it back when Back,
 * Forward or a reload brings the entry back (NAV-02). The first page is the start, so it is not kept. A row whose
 * cards have not arrived yet is not ready: the restore waits for its Swiper to report its slides (rowSwiperCreated).
 */
export function useKeptRowPage(key: string, ref: RefObject<SwiperType | undefined>, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    return registerInnerPage(
      SECTION,
      key,
      () => {
        const swiper = ref.current;
        if (!swiper || swiper.destroyed) return undefined;
        return swiper.activeIndex > 0 ? swiper.activeIndex : undefined;
      },
      (value) => {
        const swiper = ref.current;
        if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) return true;
        if (!swiper || swiper.destroyed || swiper.slides.length <= value) return false;
        swiper.slideTo(value, 0);
        return true;
      },
      0,
      (onChange) => {
        slidesChanged.add(onChange);
        return () => slidesChanged.delete(onChange);
      },
    );
  }, [key, ref, enabled]);
}
