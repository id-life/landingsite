import { isCNAtom } from '@/atoms/geo';
import CnBtnSVG from '@/components/svg/CnBtnSVG';
import EnBtnSVG from '@/components/svg/EnBtnSVG';
import { useIsMobile } from '@/hooks/useIsMobile';
import { cn } from '@/utils';
import { useAtom } from 'jotai';
import { Fragment, useState, useEffect } from 'react';

type ConnectContentItem = {
  id: string;
  title: string;
  content: string;
  cn?: {
    title: string;
    content: string;
  };
  mobileSVGElement: JSX.Element;
  className?: string;
  buttonClass?: string;
};
const CONNECT_CONTENT: ConnectContentItem[] = [
  {
    id: 'page-connect-1',
    title: 'A New Dawn 曙光',
    content:
      'Our dedication is a world where emerging breakthroughs in science and medicine enable flourishing lifespans for all.\n我们的使命是通过前沿科技与医学突破，为全人类开启璀璨生命新纪元',
    mobileSVGElement: (
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
  },
  {
    id: 'page-connect-2',
    title: 'As an Evangelist 传播与共识',
    content:
      'We help the world come to a better understanding of life extension technologies, galvanizing global consciousness, talents & resources in the process.\n我们致力于成为生命延长技术的布道者，在促进全球共识、汇聚全球智慧与资源方面发挥关键作用',
    className: 'text-right mobile:text-left',
    buttonClass: 'ml-auto',
    mobileSVGElement: (
      <div className="relative z-30 opacity-0" id="connect-2-svg-mobile">
        <h2 className="pointer-events-none fixed inset-x-4 top-[4.625rem] z-30 flex flex-col whitespace-pre-wrap text-left font-oxanium font-semibold tracking-[-4%]">
          <span className="connect-text-en connect-text-en-1 whitespace-nowrap text-[3.5rem]/[4.625rem] uppercase tracking-normal text-red-500">
            MOONSHOT
          </span>
          <span className="connect-text-en connect-text-en-4 whitespace-nowrap text-[3.5rem]/[4.625rem] uppercase tracking-normal">
            VENTURES
          </span>
          <span className="connect-text-cn connect-text-cn-1 bilingual-font absolute left-0 top-10 text-[3.75rem]/[4.625rem] font-bold text-red-500">
            登月计划
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
  },
  {
    id: 'page-connect-3',
    title: 'A Moral Endeavor 卓越的道德探索',
    content:
      'We pursue longer, healthier lives and less suffering from age-related ailments, endeavoring all our might to bring this vision to reality.\n我们矢志追求生命的延展与健康的永驻，化解年龄相关疾病带来的苦痛，全力以赴实现这一崇高愿景',
    mobileSVGElement: (
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
        <p className="mt-7.5 text-red-500">MOONSHOT</p>
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
  },
  {
    id: 'page-connect-4',
    title: 'A Virtuous Cycle 胆量与发展并进',
    content:
      'We stand with bold early investments, where breakthroughs accelerate the cause, bringing further talents, supporters and resources.\n我们坚持前瞻性的大胆投资，每一次突破都将加速推进事业，吸引更多英才、支持者与资源汇聚',
    // cn: {
    //   title: '',
    //   content: '',
    // },
    className: 'text-right mobile:text-left',
    buttonClass: 'ml-auto',
    mobileSVGElement: (
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
  },
];

const END_CONTENT_1 = {
  en: {
    title: 'Promising Early-Stage Ventures',
    items: [
      'Partnering with Pre-Seed to Series-A startups under $100m valuations.',
      'Prioritizing talents, bold visions and impactful human benefits.',
    ],
  },
  cn: {
    title: '聚焦早期企业投资',
    items: ['与估值1亿美元以下的种子轮至A轮企业合作', '重点关注优秀人才、远大愿景和积极的社会影响'],
  },
};

const END_CONTENT_2: {
  en: {
    title: string;
    content: string;
  }[];
  cn: {
    title: string;
    content: string;
    mobileContent?: string;
  }[];
} = {
  en: [
    {
      title: 'East & West Access',
      content: 'Deep Roots in Both East & West, a Conduit that Bridges Markets, Capital, Institutions and More',
    },
    {
      title: 'Industry Expertise',
      content: 'Sole focus on longevity biotech, linking partners with experts, top talent, and essential support.',
    },
    {
      title: 'Founder Focused',
      content: "Strategic partners, prioritizing founders' visions and long-term societal impact.",
    },
  ],
  cn: [
    {
      title: '贯通东西:\n',
      content: '立足东西方市场，打通市场、资本、\n机构等多维资源',
      mobileContent: '立足东西方市场，打通市场、资本、机构等多维资源',
    },
    {
      title: '专注领域:\n',
      content: '聚焦长寿生物科技，链接专家、人才\n及核心支持',
      mobileContent: '聚焦长寿生物科技，链接专家、人才及核心支持',
    },
    {
      title: '以创始人为本:\n',
      content: '携手创业者，共创长期社会价值',
    },
  ],
};

export default function FixedConnect() {
  const isMobile = useIsMobile();
  const [isCN, setIsCN] = useAtom(isCNAtom);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsCN((prev) => !prev);
    }, 8000);

    return () => clearInterval(timer);
  }, [isCN, setIsCN]);

  return (
    <>
      {CONNECT_CONTENT.map((item) => (
        <Fragment key={item.id}>
          {isMobile && item.mobileSVGElement}
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
