import { isMobileFooterContactShowAtom } from '@/atoms/footer';
import { CONNECT_BRIDGE_CN, CONNECT_EVANGELISM_CN } from '@/constants/display-strings';
import { useIsMobile } from '@/hooks/useIsMobile';
import { cn } from '@/utils';
import { useAtomValue } from 'jotai';

// New: Single-page mobile layout component
const MobileConnectSinglePage = () => {
  const isContactShow = useAtomValue(isMobileFooterContactShowAtom);

  return (
    // Scrolls on its own (a swipe past its end changes section): the headlines and their lines in normal flow. Two
    // spacers place them where the original does, centred between the header and 310 px above the window's bottom
    // (his box ended there with the contact panel open), while this box ends at the panel itself: the top spacer starts
    // at the difference and both grow, so with room to spare the block sits where his does; with less, the top spacer
    // gives way first and the block's last line stays above the panel (his ran under it on a 667 px screen); with too
    // little, both are 0 and the box scrolls from the top (justify-content: center would push the overflow above the
    // scroll origin).
    <div
      id="mobile-connect-content"
      // Focusable, so keyboard users can scroll it too (axe scrollable-region-focusable).
      tabIndex={0}
      role="region"
      aria-label="Connect"
      className={cn(
        // invisible until Connect is entered (ConnectGL on the phone deck sets visibility), so this scroll box never catches
        // taps meant for the other sections.
        'invisible fixed inset-x-0 top-[5rem] z-30 flex flex-col overflow-y-auto overscroll-contain px-4 opacity-0 transition-[bottom] duration-300 ease-out',
        // With the contact panel open the box ends at the panel and scrolls: its lower edge fades, so the line it
        // clips reads as more text below rather than text under the panel.
        isContactShow
          ? 'bottom-[calc(var(--connect-panel-h,310px)+0.5rem)] [mask-image:linear-gradient(to_bottom,black_calc(100%_-_2.5rem),transparent)]'
          : 'bottom-[5rem]',
      )}
    >
      <div
        aria-hidden
        className={cn(
          'shrink grow',
          isContactShow ? 'basis-[max(0px,calc(var(--connect-panel-h,19.375rem)_+_0.5rem_-_19.375rem))]' : 'basis-0',
        )}
      />
      <div className="shrink-0 font-display font-semibold uppercase tracking-[-4%]">
        {/* Section 1: EVANGELISM */}
        <div className="relative text-left">
          <span className="connect-text-en whitespace-nowrap text-[1.75rem]/[1.75rem] text-accent">Evangelism</span>
          <span className="connect-text-cn bilingual-font absolute -top-5 left-0 text-[2.5rem]/[3.75rem] font-bold text-accent opacity-0">
            {CONNECT_EVANGELISM_CN}
          </span>
          <div className="connect-text-en text-[1.75rem]/[1.75rem]">
            OF GLOBAL LONGEVITY
            <br />
            AWARENESS
          </div>
        </div>

        {/* Section 2: EAST & WEST ACCESS */}
        <div className="relative mt-4 text-left">
          <span className="connect-text-en whitespace-nowrap text-[1.75rem]/[2.875rem]">East & West</span>
          <span className="connect-text-en whitespace-pre-wrap text-[1.75rem]/[2.875rem] text-accent">Access</span>
          <span className="connect-text-cn bilingual-font absolute -top-3 left-[11.875rem] text-[2.5rem]/[3.75rem] font-bold text-accent opacity-0">
            {CONNECT_BRIDGE_CN}
          </span>
          <p className="connect-text-en text-xs/4 font-semibold normal-case tracking-normal">
            Deep Roots in Both East & West, a Conduit that Bridges
            <br />
            Markets, Capital, Institutions and More
          </p>
        </div>

        {/* Section 3: MOONSHOT VENTURES */}
        <div className="relative mt-4 text-left">
          <span className="connect-text-en whitespace-nowrap text-[1.75rem]/[2.875rem] tracking-normal text-accent">
            MOONSHOT
          </span>
          <span className="connect-text-cn absolute left-0 top-0 whitespace-nowrap text-[1.75rem]/[2.875rem] tracking-normal opacity-0">
            MOONSHOT
          </span>
          <span className="connect-text-en ml-3 whitespace-nowrap text-[1.75rem]/[2.875rem] tracking-normal">VENTURES</span>
          <p className="connect-text-en relative left-1 text-xs/4 font-semibold normal-case tracking-normal">
            We Stand with Bold Unorthodox Ideas and Brave Contrarian Founders
          </p>
        </div>
      </div>
      <div aria-hidden className="shrink grow basis-0" />
    </div>
  );
};

export default function FixedConnect() {
  const isMobile = useIsMobile();

  // Phones only (FixedUI, phone deck). The language timer is gone (CON-12), and so are the fixed, opacity-0 value and
  // criteria blocks: MobileConnectSinglePage renders that text in flow.
  return <>{isMobile && <MobileConnectSinglePage />}</>;
}
