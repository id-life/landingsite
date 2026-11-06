import { isMobileFooterContactShowAtom } from '@/atoms/footer';
import { isCNAtom } from '@/atoms/geo';
import { useIsMobile } from '@/hooks/useIsMobile';
import { cn } from '@/utils';
import { useAtom, useAtomValue } from 'jotai';
import { Fragment, useEffect } from 'react';
import { CONNECT_TEXT, END_CONTENT_1, END_CONTENT_2 } from './content';

// New: Single-page mobile layout component
const MobileConnectSinglePage = () => {
  const isContactShow = useAtomValue(isMobileFooterContactShowAtom);

  return (
    <div
      id="mobile-connect-content"
      className={cn(
        'pointer-events-none fixed inset-x-4 top-[80px] z-30 flex flex-col justify-center font-oxanium font-semibold uppercase tracking-[-4%] opacity-0 transition-[bottom] duration-300 ease-out',
        isContactShow ? 'bottom-[310px]' : 'bottom-[80px]',
      )}
    >
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
        <span className="connect-text-en whitespace-nowrap text-[28px]/[46px]">East & West</span>
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
    </div>
  );
};

// Mobile-only decorations keyed by CONNECT_TEXT id; the copy itself lives in ./content.
const MOBILE_SVG_ELEMENTS: Record<string, JSX.Element> = {
  'page-connect-1': (
    <div className="relative z-30 opacity-0" id="connect-1-svg-mobile">
      <h2 className="pointer-events-none fixed inset-x-4 top-[4.625rem] flex flex-col gap-1 whitespace-pre-wrap text-left font-oxanium font-semibold tracking-[-4%]">
        <span className="connect-text-en connect-text-en-1 whitespace-nowrap text-[3.5rem]/[4.625rem] uppercase text-red-500">
          Evangelism
        </span>
        <span className="connect-text-cn connect-text-cn-1 bilingual-font absolute left-0 top-1 text-[3.75rem]/[4.625rem] font-bold text-red-500">
          布道者
        </span>
        <span className="connect-text-en text-[3rem]/[3rem] uppercase">
          OF global
          <br />
          Longevity
          <br />
          awareness
        </span>
      </h2>
      <h2 className="pointer-events-none fixed inset-x-4 bottom-[6.25rem] z-30 flex flex-col whitespace-pre-wrap text-right font-oxanium font-semibold tracking-[-4%]">
        <span className="connect-text-en whitespace-nowrap text-[3.5rem]/[3.5rem] uppercase">East & West</span>
        <span className="connect-text-en connect-text-en-2 whitespace-pre-wrap text-[3.5rem]/[4.625rem] uppercase text-red-500">
          Access
        </span>
        <span className="connect-text-cn connect-text-cn-2 bilingual-font absolute right-0 top-14 text-[3.75rem]/[4.625rem] font-bold text-red-500">
          桥梁
        </span>
        <span className="connect-text-en mt-4 text-xs/4 font-semibold tracking-normal">
          Deep Roots in Both East & West, a Conduit that
          <br />
          Bridges Markets, Capital, Institutions and More
        </span>
      </h2>
    </div>
  ),
  'page-connect-2': (
    <div className="relative z-30 opacity-0" id="connect-2-svg-mobile">
      <h2 className="pointer-events-none fixed inset-x-4 top-[4.625rem] z-30 flex flex-col whitespace-pre-wrap text-left font-oxanium font-semibold tracking-[-4%]">
        <span className="connect-text-en connect-text-en-1 whitespace-nowrap text-[3.5rem]/[4.625rem] uppercase tracking-normal text-red-500">
          MOONSHOT
        </span>
        <span className="connect-text-en connect-text-en-4 whitespace-nowrap text-[3.5rem]/[4.625rem] uppercase tracking-normal">
          VENTURES
        </span>
        <span className="connect-text-cn connect-text-cn-1 absolute left-0 top-0 whitespace-nowrap text-[3.5rem]/[4.625rem] uppercase tracking-normal">
          MOONSHOT
        </span>
        <span className="connect-text-en relative left-1 mt-4 text-xs/4 font-semibold tracking-normal">
          We Stand with Bold Unorthodox Ideas
          <br />
          and Brave Contrarian Founders
        </span>
      </h2>
      <h2 className="pointer-events-none fixed inset-x-4 bottom-[6.25rem] z-30 flex flex-col whitespace-nowrap text-right font-oxanium font-semibold tracking-[-4%]">
        <span className="connect-text-en text-[3rem]/[3rem] uppercase">LIVE</span>
        <span className="connect-text-en connect-text-en-2 text-[3.5rem]/[4.625rem] uppercase text-red-500">LONGER</span>
        <span className="connect-text-en connect-text-en-3 text-[3.5rem]/[4.625rem] uppercase text-red-500">HAPPIER</span>
        <span className="connect-text-cn bilingual-font connect-text-cn-2 absolute right-0 top-14 text-[3.75rem]/[4.625rem] font-bold text-red-500">
          更长久
        </span>
        <span className="connect-text-cn bilingual-font connect-text-cn-3 absolute right-0 top-[8.125rem] text-[3.75rem]/[4.625rem] font-bold text-red-500">
          更健康
        </span>
        <span className="connect-text-en mt-5 text-xs/4 font-semibold tracking-normal">
          Radical Lifespan Extension and Fulfilling Healthspan Extension
          <br />
          Longevity as a Moral Imperative
        </span>
      </h2>
    </div>
  ),
  'page-connect-3': (
    <div
      id="connect-3-svg-mobile"
      className="bilingual-font pointer-events-none fixed inset-x-4 top-[4.625rem] z-30 flex flex-col whitespace-nowrap text-[1.75rem]/[1.75rem] font-semibold uppercase opacity-0"
    >
      <p className="uppercase">
        <span className="text-red-500">Evangelism</span>
        <br />
        OF global Longevity
        <br />
        awareness
      </p>
      <p className="mt-7.5">
        East & West <span className="text-red-500">Access</span>
      </p>
      <p className="mt-2.5 text-xs/4 font-semibold normal-case">
        Deep Roots in Both East & West, a Conduit that
        <br />
        Bridges Markets, Capital, Institutions and More
      </p>
      <p className="mt-7.5">MOONSHOT</p>
      <p className="">VENTURES</p>
      <p className="mt-2.5 text-xs/4 font-semibold normal-case">
        We Stand with Bold Unorthodox Ideas
        <br />
        and Brave Contrarian Founders
      </p>
      <p className="mt-7.5">
        LIVE&nbsp;
        <span className="whitespace-pre-wrap text-red-500">
          LONGER
          <br />
          HAPPIER
        </span>
      </p>
      <p className="mt-2.5 text-xs/4 font-semibold normal-case">
        Radical Lifespan Extension and Fulfilling Healthspan Extension <br />
        Longevity as a Moral Imperative{' '}
      </p>
    </div>
  ),
  'page-connect-4': (
    <h2
      id="connect-4-svg-mobile"
      className="pointer-events-none fixed inset-x-5 bottom-[14.75rem] z-10 flex flex-col gap-1 whitespace-pre-wrap text-center font-oxanium text-[3.125rem]/[3.125rem] font-semibold uppercase opacity-0"
    >
      <span className="connect-text-en whitespace-nowrap text-[3.625rem]/[3.625rem] text-red-500">
        A Virtuous
        <br />
        Cycle
      </span>
      <span className="connect-text-cn bilingual-font absolute inset-x-0 top-8 text-center text-[5rem]/[5rem] font-bold text-red-500">
        良性飞轮
      </span>
      <span className="connect-text-en">
        behind
        <br />
        Audacity
      </span>
    </h2>
  ),
};

const CONNECT_CONTENT = CONNECT_TEXT.map((item) => ({ ...item, mobileSVGElement: MOBILE_SVG_ELEMENTS[item.id] }));

export default function FixedConnect() {
  const isMobile = useIsMobile();
  const [isCN, setIsCN] = useAtom(isCNAtom);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsCN((prev) => !prev);
    }, 8000);

    return () => clearInterval(timer);
  }, [setIsCN]);

  return (
    <>
      {/* New: Single-page mobile layout (replaces old 3-page scroll system) */}
      {isMobile && <MobileConnectSinglePage />}

      {CONNECT_CONTENT.map((item) => (
        <Fragment key={item.id}>
          {/* Removed old mobile scroll elements: {isMobile && item.mobileSVGElement} */}
          <div
            id={item.id}
            className={cn(
              'page-connect-item bilingual-font-poppins pointer-events-none fixed bottom-[6.25rem] right-20 z-10 opacity-0 mobile:inset-x-5 mobile:bottom-[6.625rem]',
              item?.className,
            )}
          >
            <h3 className="text-xl/6 font-semibold mobile:text-sm/3.5">{item.title}</h3>
            <p className="bilingual-font-poppins mt-4 w-[31rem] whitespace-pre-wrap text-base font-medium mobile:mt-2.5 mobile:w-full mobile:text-xs/4.5">
              {item.content}
            </p>
          </div>
        </Fragment>
      ))}
      <div
        id="connect-end-1"
        className="bilingual-font invisible fixed left-10 top-1/2 z-10 w-[28.125rem] -translate-y-1/2 opacity-0 mobile:inset-x-5 mobile:top-[6.25rem] mobile:w-full mobile:transform-none"
      >
        <h2 className="text-3xl font-bold uppercase mobile:text-sm/4">
          {isCN ? END_CONTENT_1.cn.title : END_CONTENT_1.en.title}
        </h2>
        <ul className="list-mark-red-disc mt-9 flex flex-col gap-7.5 text-xl/5 font-bold uppercase mobile:mt-3 mobile:gap-2.5 mobile:text-xs/3.5">
          {(isCN ? END_CONTENT_1.cn.items : END_CONTENT_1.en.items).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
      <ul
        id="connect-end-2"
        className={cn(
          'list-mark-red-disc bilingual-font invisible fixed right-10 top-1/2 z-10 flex w-105 -translate-y-1/2 flex-col gap-12 whitespace-pre-wrap font-oxanium text-xl/6 font-bold uppercase opacity-0 mobile:inset-x-5 mobile:bottom-[6.625rem] mobile:top-auto mobile:w-auto mobile:transform-none mobile:gap-3.5 mobile:text-xs/3.5',
          { 'w-auto': isCN },
        )}
      >
        {isCN
          ? END_CONTENT_2.cn.map((item, index) => (
              <li key={index}>
                {item.title}
                <span className="mt-5 inline-block text-base/5 font-semibold mobile:mt-1 mobile:text-[.625rem]/3">
                  {isMobile ? (item?.mobileContent ?? item.content) : item.content}
                </span>
              </li>
            ))
          : END_CONTENT_2.en.map((item, index) => (
              <li key={index}>
                {item.title}
                <span className="mt-5 inline-block text-base/5 font-semibold mobile:mt-1 mobile:text-[.625rem]/3">
                  {item.content}
                </span>
              </li>
            ))}
      </ul>
    </>
  );
}
