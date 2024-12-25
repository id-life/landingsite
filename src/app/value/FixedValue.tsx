import { isCNAtom } from '@/atoms/geo';
import CnBtnSVG from '@/components/svg/CnBtnSVG';
import EnBtnSVG from '@/components/svg/EnBtnSVG';
import { useIsMobile } from '@/hooks/useIsMobile';
import { cn } from '@/utils';
import { useAtom } from 'jotai';
import { Fragment, useState, useEffect } from 'react';
type ValueContentItem = {
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
const VALUE_CONTENT: ValueContentItem[] = [
  {
    id: 'page-value-1',
    title: 'A New Dawn 曙光',
    content:
      'Our dedication is a world where emerging breakthroughs in science and medicine enable flourishing lifespans for all.\n我们的使命是通过前沿科技与医学突破，为全人类开启璀璨生命新纪元',
    mobileSVGElement: (
      <h2
        id="value-1-svg-mobile"
        className="pointer-events-none fixed inset-x-5 top-[6.25rem] z-10 flex flex-col gap-1 whitespace-pre-wrap font-oxanium font-semibold uppercase opacity-0"
      >
        <span className="value-text-en whitespace-pre-wrap text-[3.625rem]/[3.625rem] text-red-500">
          A purpose-
          <br />
          driven
        </span>
        <span className="value-text-cn bilingual-font absolute left-0 top-8 text-[5rem]/[5rem] font-bold text-red-500">
          使命驱动
        </span>
        <span className="value-text-en text-[3.125rem]/[3.125rem]">longevity fund</span>
      </h2>
    ),
  },
  {
    id: 'page-value-2',
    title: 'As an Evangelist 传播与共识',
    content:
      'We help the world come to a better understanding of life extension technologies, galvanizing global consciousness, talents & resources in the process.\n我们致力于成为生命延长技术的布道者，在促进全球共识、汇聚全球智慧与资源方面发挥关键作用',
    // cn: {
    //   title: '',
    //   content: '',
    // },
    className: 'text-right mobile:text-left',
    buttonClass: 'ml-auto',
    mobileSVGElement: (
      <h2
        id="value-2-svg-mobile"
        className="pointer-events-none fixed inset-x-5 top-1/2 z-10 flex -translate-y-1/3 flex-col gap-1 whitespace-pre-wrap font-oxanium text-[3.125rem]/[3.125rem] font-semibold uppercase opacity-0"
      >
        <span className="value-text-en">Discovering</span>
        <span className="value-text-en mt-5 text-[3.625rem]/[3.625rem] tracking-tight text-red-500">Champions</span>
        <span className="value-text-cn bilingual-font absolute left-0 top-18 text-[5rem]/[5rem] font-bold text-red-500">
          领军
        </span>
        <span className="value-text-en mt-5 whitespace-pre-wrap">
          in
          <br />
          Longevity Biotech
        </span>
      </h2>
    ),
  },
  {
    id: 'page-value-3',
    title: 'A Moral Endeavor 卓越的道德探索',
    content:
      'We pursue longer, healthier lives and less suffering from age-related ailments, endeavoring all our might to bring this vision to reality.\n我们矢志追求生命的延展与健康的永驻，化解年龄相关疾病带来的苦痛，全力以赴实现这一崇高愿景',
    // cn: {
    //   title: '',
    //   content: '',
    // },
    mobileSVGElement: (
      <h2
        id="value-3-svg-mobile"
        className="pointer-events-none fixed inset-x-5 top-[6.25rem] z-10 flex flex-col gap-1 whitespace-pre-wrap font-oxanium text-[3.125rem]/[3.125rem] font-semibold uppercase opacity-0"
      >
        <span className="value-text-en">
          Longevity
          <br />
          Biotech
          <br />
          Is A
        </span>
        <span className="value-text-en text-[3.625rem]/[3.625rem] text-red-500">{'Moral\nImperative'}</span>
        <span className="value-text-cn bilingual-font absolute left-0 top-40 text-[5rem]/[5rem] font-bold text-red-500">
          必然
        </span>
      </h2>
    ),
  },
  {
    id: 'page-value-4',
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
        id="value-4-svg-mobile"
        className="pointer-events-none fixed inset-x-5 top-1/2 z-10 flex -translate-y-1/4 flex-col gap-1 whitespace-pre-wrap text-center font-oxanium text-[3.125rem]/[3.125rem] font-semibold uppercase opacity-0"
      >
        <span className="value-text-en text-[3.625rem]/[3.625rem] text-red-500">
          A Virtuous
          <br />
          Cycle
        </span>
        <span className="value-text-cn bilingual-font absolute inset-x-0 top-8 text-center text-[5rem]/[5rem] font-bold text-red-500">
          良性飞轮
        </span>
        <span className="value-text-en">
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
      title: 'East/West Access',
      content: 'Deep roots in both East and West, a conduit that bridges market, capital, institutions and more.',
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

export default function FixedValue() {
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
      {VALUE_CONTENT.map((item) => (
        <Fragment key={item.id}>
          {isMobile && item.mobileSVGElement}
          <div
            id={item.id}
            className={cn(
              'page-value-item bilingual-font pointer-events-none fixed bottom-40 right-20 z-10 opacity-0 mobile:inset-x-5 mobile:bottom-[6.625rem]',
              item?.className,
            )}
          >
            <h3 className="text-xl/6 font-semibold mobile:text-sm/3.5">{item.title}</h3>
            <p className="bilingual-font mt-4 w-[31rem] whitespace-pre-wrap text-base font-medium mobile:mt-2.5 mobile:w-full mobile:text-xs/4.5">
              {item.content}
            </p>
            {/* <div className={cn('pointer-events-auto mt-3 flex items-center uppercase', item?.buttonClass)}>
              <button onClick={() => setIsCN(false)}>
                <EnBtnSVG active={!isCN} />
              </button>
              <button onClick={() => setIsCN(true)} className="-ml-2.5">
                <CnBtnSVG active={isCN} />
              </button>
            </div> */}
          </div>
        </Fragment>
      ))}
      <div
        id="value-end-1"
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
        id="value-end-2"
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
