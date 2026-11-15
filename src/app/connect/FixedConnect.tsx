import { isMobileFooterContactShowAtom } from '@/atoms/footer';
import { useIsMobile } from '@/hooks/useIsMobile';
import { cn } from '@/utils';
import { useAtomValue } from 'jotai';
import { ConnectCriteria, ConnectValues } from './ConnectDetails';

// New: Single-page mobile layout component
const MobileConnectSinglePage = () => {
  const isContactShow = useAtomValue(isMobileFooterContactShowAtom);

  return (
    // Scrolls on its own (a swipe past its end changes section): the criteria and values follow the headlines
    // in normal flow. The inner my-auto wrapper centres the content when it fits and starts it at the top when
    // it does not (justify-content: center would push the overflow above the scroll origin).
    <div
      id="mobile-connect-content"
      // Focusable, so keyboard users can scroll it too (axe scrollable-region-focusable).
      tabIndex={0}
      role="region"
      aria-label="Connect"
      className={cn(
        // invisible until Connect is entered (MobileConnectGL sets visibility), so this scroll box never catches
        // taps meant for the other sections.
        'invisible fixed inset-x-0 top-[80px] z-30 flex flex-col overflow-y-auto overscroll-contain px-4 opacity-0 transition-[bottom] duration-300 ease-out',
        isContactShow ? 'bottom-[calc(var(--connect-panel-h,310px)+0.5rem)]' : 'bottom-[80px]',
      )}
    >
      <div className="my-auto font-oxanium font-semibold uppercase tracking-[-4%]">
        {/* Section 1: EVANGELISM */}
        <div className="relative text-left">
          <span className="connect-text-en whitespace-nowrap text-[28px]/[28px] text-red-500">Evangelism</span>
          <span className="connect-text-cn bilingual-font absolute -top-5 left-0 text-[40px]/[60px] font-bold text-red-500 opacity-0">
            布道者
          </span>
          <div className="connect-text-en text-[1.75rem]/[1.75rem]">
            OF GLOBAL LONGEVITY
            <br />
            AWARENESS
          </div>
        </div>

        {/* Section 2: EAST & WEST ACCESS */}
        <div className="relative mt-4 text-left">
          <span className="connect-text-en whitespace-nowrap text-[28px]/[46px]">East & West</span>{' '}
          <span className="connect-text-en whitespace-pre-wrap text-[28px]/[46px] text-red-500">Access</span>
          <span className="connect-text-cn bilingual-font absolute -top-3 left-[190px] text-[40px]/[60px] font-bold text-red-500 opacity-0">
            桥梁
          </span>
          <p className="connect-text-en text-xs/4 font-semibold normal-case tracking-normal">
            Deep Roots in Both East & West, a Conduit that Bridges
            <br />
            Markets, Capital, Institutions and More
          </p>
        </div>

        {/* Section 3: MOONSHOT VENTURES */}
        <div className="relative mt-4 text-left">
          <span className="connect-text-en whitespace-nowrap text-[1.75rem]/[2.875rem] tracking-normal text-red-500">
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

        {/* Investment criteria and values: visible live text in one language. They used to be fixed blocks at
          opacity 0 (.page-connect-item, #connect-end-1, #connect-end-2) that overlapped if faded in. */}
        <ConnectCriteria
          className="mt-8 normal-case tracking-normal"
          titleClassName="text-base/5"
          listClassName="mt-2 gap-1.5 font-poppins text-xs/4.5 font-semibold"
        />
        <ConnectValues
          className="mt-6 flex flex-col gap-4 pb-2 normal-case tracking-normal"
          titleClassName="text-sm/5"
          textClassName="mt-0.5 font-poppins text-xs/4.5 font-medium"
        />
      </div>
    </div>
  );
};

export default function FixedConnect() {
  const isMobile = useIsMobile();

  // Phones only (MobileFixedUI). The language timer is gone (CON-12), and so are the fixed, opacity-0 value and
  // criteria blocks: MobileConnectSinglePage renders that text in flow.
  return <>{isMobile && <MobileConnectSinglePage />}</>;
}
