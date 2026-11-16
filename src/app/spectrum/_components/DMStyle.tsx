import { COMPACT_HEIGHT_QUERY, DESKTOP_TREE_QUERY, PHONE_TREE_QUERY } from '@/styles/device-classes';

// Page-level rules, as a plain <style> built from the device classes (RWD-02): the phone and desktop rules follow the
// tree queries (src/styles/device-classes.ts), the same queries that decide which experience is mounted.
// No characters React would escape (<, >, &, quotes) may appear in CSS.
const CSS = `
  html,
  body {
    height: 100%;
  }

  /* RWD-01: a fixed root (100 %: 16 px, or the setting the visitor chose) on every route and width. */
  :root {
    font-size: 100%;
  }

  /* The layout unit (RWD-01): the original drew these pages at a root of 0.8333vw (12 px at 1440, 16 at 1920), so
     on the desktop tree layout and text written in rem scale as they did from 1200 px up (the owner's rule on font
     sizes), with a fixed 12 px unit (the original's 1440 size) below 1200.
     Type in the roles is real rem and keeps its floors. */
  @media ${DESKTOP_TREE_QUERY} {
    :root {
      --u: 0.8333vw;
    }
  }

  /* Below 1200 px (the tablet tier) the unit holds the original's 1440 size: 12 px. */
  @media ${DESKTOP_TREE_QUERY} and (max-width: 1199.98px) {
    :root {
      --u: 12px;
    }
  }

  /* A phone in landscape: the same fixed 12 px unit as a small laptop window, so the picture and table are drawn at
     the laptop's scale, not the portrait phone's. */
  @media ${COMPACT_HEIGHT_QUERY} {
    :root {
      --u: 12px;
    }
  }

  @media ${PHONE_TREE_QUERY} {
    body {
      height: 100%;
      overflow: hidden;
    }
  }

  .base-background2 {
    opacity: 0;
  }

  .disease-management-content {
    opacity: 1;
  }
    `;

export default function DMStyle() {
  return <style>{CSS}</style>;
}
