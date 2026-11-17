// The Connect section's copy: the four value statements, the investment criteria and the three strengths.
// Rendered visibly by FixedConnect / FixedConnectPage1 (English) and in full by the server-rendered summary.
// Wording edits are owner drafts (src/content/drafts/copy-edits.ts).
import { live } from './approval';
import type { Copy, CopyList } from './schema';

export const CONNECT_VALUES: Copy[] = [
  {
    id: 'a-new-dawn',
    title: { en: 'A New Dawn', zh: '曙光' },
    text: {
      en: 'Our dedication is to a world where emerging breakthroughs in science and medicine enable flourishing lifespans for all.',
      zh: '我们的使命是通过前沿科技与医学突破，为全人类开启璀璨生命新纪元',
    },
    approval: live(),
  },
  {
    id: 'as-an-evangelist',
    title: { en: 'As an Evangelist', zh: '传播与共识' },
    text: {
      en: 'We help the world come to a better understanding of life extension technologies, galvanizing global consciousness, talents & resources in the process.',
      zh: '我们致力于成为生命延长技术的布道者，在促进全球共识、汇聚全球智慧与资源方面发挥关键作用',
    },
    approval: live(),
  },
  {
    id: 'a-moral-endeavor',
    title: { en: 'A Moral Endeavor', zh: '卓越的道德探索' },
    text: {
      en: 'We pursue longer, healthier lives and less suffering from age-related ailments, endeavoring all our might to bring this vision to reality.',
      zh: '我们矢志追求生命的延展与健康的永驻，化解年龄相关疾病带来的苦痛，全力以赴实现这一崇高愿景',
    },
    approval: live(),
  },
  {
    id: 'a-virtuous-cycle',
    title: { en: 'A Virtuous Cycle', zh: '胆量与发展并进' },
    text: {
      en: 'We stand with bold early investments, where breakthroughs accelerate the cause, bringing further talents, supporters and resources.',
      zh: '我们坚持前瞻性的大胆投资，每一次突破都将加速推进事业，吸引更多英才、支持者与资源汇聚',
    },
    approval: live(),
  },
];

export const CONNECT_CRITERIA: CopyList = {
  id: 'early-stage-ventures',
  title: { en: 'Promising Early-Stage Ventures', zh: '聚焦早期企业投资' },
  items: [
    {
      en: 'Partnering with Pre-Seed to Series-A startups under $100m valuations.',
      zh: '与估值1亿美元以下的种子轮至A轮企业合作',
    },
    {
      en: 'Prioritizing talents, bold visions and impactful human benefits.',
      zh: '重点关注优秀人才、远大愿景和积极的社会影响',
    },
  ],
  approval: live(),
};

export const CONNECT_STRENGTHS: Copy[] = [
  {
    id: 'east-west-access',
    title: { en: 'East & West Access', zh: '贯通东西' },
    text: {
      en: 'Deep Roots in Both East & West, a Conduit that Bridges Markets, Capital, Institutions and More',
      zh: '立足东西方市场，打通市场、资本、机构等多维资源',
    },
    approval: live(),
  },
  {
    id: 'industry-expertise',
    title: { en: 'Industry Expertise', zh: '专注领域' },
    text: {
      en: 'Sole focus on longevity biotech, linking partners with experts, top talent, and essential support.',
      zh: '聚焦长寿生物科技，链接专家、人才及核心支持',
    },
    approval: live(),
  },
  {
    id: 'founder-focused',
    title: { en: 'Founder Focused', zh: '以创始人为本' },
    text: {
      en: "Strategic partners, prioritizing founders' visions and long-term societal impact.",
      zh: '携手创业者，共创长期社会价值',
    },
    approval: live(),
  },
];
