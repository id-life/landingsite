import { COMPACT_HEIGHT_QUERY, DESKTOP_TREE_QUERY, PHONE_LAYOUT_UNIT, PHONE_TREE_QUERY } from '@/styles/device-classes';

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
     on the laptop deck layout and text written in rem scale as they did, at every width of the deck (two versions,
     RWD-02; the owner's rule on font sizes).
     Type in the roles is real rem and keeps its floors. */
  @media ${DESKTOP_TREE_QUERY} {
    :root {
      --u: 0.8333vw;
    }
  }


  /* The phone deck: the phone layout in the deck's unit (16 px up to 599 px, then growing with the window); a phone
     in landscape keeps the 12 px unit below. */
  @media ${PHONE_TREE_QUERY} {
    :root {
      --u: ${PHONE_LAYOUT_UNIT};
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
