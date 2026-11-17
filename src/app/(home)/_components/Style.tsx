import { DESKTOP_TREE_QUERY, PHONE_LAYOUT_UNIT, PHONE_SCALED_QUERY, PHONE_TREE_QUERY } from '@/styles/device-classes';
import { roleSizePx, typeRoles } from '@/styles/tokens';

// The type roles on the phone deck follow its unit above phone width (RWD-02; the owner's rule on font sizes: his
// sizes on the phone, scaled): each role is its size at 600 px times the deck's factor, continuous at 600 px. The
// laptop deck keeps the roles as they are: each text there must have the size the original draws at the same window
// (some of its texts scale with the window, some are fixed), which the roles already give. Content pages do not load
// this style.
const roleRules = (reference: number, unitAtReference: number) =>
  (Object.keys(typeRoles) as (keyof typeof typeRoles)[])
    .map((role) => `--type-${role}: calc(var(--t) * ${(roleSizePx(role, reference) / unitAtReference).toFixed(5)});`)
    .join(' ');
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

  /* The layout unit (scripts/postcss-layout-unit.js), one per deck (RWD-02, two versions only). The laptop deck
     scales with the window as the original does: his sizes at 1440 px, proportionally at every other width, a tablet
     on its side included (text follows: --t is --u). */
  @media ${DESKTOP_TREE_QUERY} {
    :root {
      --u: 0.8333vw;
    }
  }

  /* The phone deck: 16 px at phone widths; above, proportionally larger with the window (PHONE_LAYOUT_UNIT), so an
     upright tablet shows the phone version at its size. */
  @media ${PHONE_TREE_QUERY} {
    :root {
      --u: ${PHONE_LAYOUT_UNIT};
    }
    body {
      height: 100%;
      overflow: hidden;
    }
  }

  @media ${PHONE_SCALED_QUERY} {
    :root {
      ${roleRules(600, 16)}
    }
  }
    `;

export default function Style() {
  return <style>{CSS}</style>;
}
