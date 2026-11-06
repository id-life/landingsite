// Text of the connect section. Shared by FixedConnect (3D page) and the server-rendered page summary.

export type ConnectTextItem = {
  id: string;
  title: string;
  content: string;
  className?: string;
  buttonClass?: string;
};

export const CONNECT_TEXT: ConnectTextItem[] = [
  {
    id: 'page-connect-1',
    title: 'A New Dawn 曙光',
    content:
      'Our dedication is a world where emerging breakthroughs in science and medicine enable flourishing lifespans for all.\n我们的使命是通过前沿科技与医学突破，为全人类开启璀璨生命新纪元',
  },
  {
    id: 'page-connect-2',
    title: 'As an Evangelist 传播与共识',
    content:
      'We help the world come to a better understanding of life extension technologies, galvanizing global consciousness, talents & resources in the process.\n我们致力于成为生命延长技术的布道者，在促进全球共识、汇聚全球智慧与资源方面发挥关键作用',
    className: 'text-right mobile:text-left',
    buttonClass: 'ml-auto',
  },
  {
    id: 'page-connect-3',
    title: 'A Moral Endeavor 卓越的道德探索',
    content:
      'We pursue longer, healthier lives and less suffering from age-related ailments, endeavoring all our might to bring this vision to reality.\n我们矢志追求生命的延展与健康的永驻，化解年龄相关疾病带来的苦痛，全力以赴实现这一崇高愿景',
  },
  {
    id: 'page-connect-4',
    title: 'A Virtuous Cycle 胆量与发展并进',
    content:
      'We stand with bold early investments, where breakthroughs accelerate the cause, bringing further talents, supporters and resources.\n我们坚持前瞻性的大胆投资，每一次突破都将加速推进事业，吸引更多英才、支持者与资源汇聚',
    className: 'text-right mobile:text-left',
    buttonClass: 'ml-auto',
  },
];

export const END_CONTENT_1 = {
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

export const END_CONTENT_2: {
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
