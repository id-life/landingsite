import { DESKTOP_TREE_QUERY, PHONE_TREE_QUERY } from '@/styles/device-classes';
import 'swiper/css';
import '@/styles/webgl.css';
import '@/styles/loading.css';

// Page-level rules, as a plain <style> built from the device classes (RWD-02): the phone and desktop rules follow the
// tree queries (src/styles/device-classes.ts), the same queries that decide which experience is mounted.
// No characters React would escape (<, >, &, quotes) may appear in CSS.
const CSS = `
  /* RWD-01: a fixed root (100 %: 16 px, or the setting the visitor chose) on every route and width. */
  :root {
    font-size: 100%;
  }

  body {
    overscroll-behavior: none;
    background: var(--background);
  }

  /* The layout unit: what the root used to be (0.8333vw above the phone tree), so layout and text in rem draw as
     before (scripts/postcss-layout-unit.js). */
  @media ${DESKTOP_TREE_QUERY} {
    :root {
      --u: 0.8333vw;
    }
  }

  /* The tablet tiers (desktop experience below 1200 px): text at the original's 1440 px size, a 12 px type unit,
     while the layout keeps scaling (the owner's rule on font sizes). From 1200 px text follows the layout unit, as
     in the original. */
  @media ${DESKTOP_TREE_QUERY} and (max-width: 1199.98px) {
    :root {
      --t: 12px;
    }
  }

  @media ${PHONE_TREE_QUERY} {
    body {
      height: 100%;
      overflow: hidden;
    }
  }
    `;

export default function Style() {
  return <style>{CSS}</style>;
}
