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
     on the desktop tree layout written in rem scales as it did from 1440 px up, with a fixed 12 px unit below it.
     Type in the roles is real rem and keeps its floors. */
  @media ${DESKTOP_TREE_QUERY} {
    :root {
      --u: max(12px, 0.8333vw);
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
