// Sponsored bodies and funded projects. Two lists were published at the baseline and they differ: the profile
// (llms.txt and the 不朽真龙介绍 article, 21 entries with descriptions) and Spectrum's "Proudly Supporting" (20 logos).
// Both are kept exactly as published through `inProfile` / `onSpectrum` until the owner rules (CON-11 #5, #8);
// test/content-parity.test.mjs names the entries that differ.
import { live } from './approval';
import { Grant, defineContent } from './schema';
import { z } from 'zod';

export const GRANTS = defineContent('content/grants.ts', z.array(Grant), [
  {
    slug: 'ardd',
    name: 'ARDD',
    description: {
      en: 'Aging Research and Drug Discovery Meeting, held annually in Copenhagen; Immortal Dragons sponsored ARDD 2025.',
      zh: '衰老研究与药物发现会议，每年在哥本哈根举行；不朽真龙为ARDD 2025赞助商。',
    },
    url: 'https://agingpharma.org/',
    inProfile: true,
    onSpectrum: true,
    approval: live(),
  },
  {
    slug: 'nakauchi-lab',
    name: 'Nakauchi Lab – Stem Cell Research',
    description: {
      en: "Hiromitsu Nakauchi's stem cell laboratory at Stanford University.",
      zh: '斯坦福大学中内啓光干细胞实验室。',
    },
    url: 'https://med.stanford.edu/nakauchilab.html',
    inProfile: true,
    onSpectrum: true,
    approval: live(),
  },
  {
    slug: 'xprize',
    name: 'XPRIZE',
    description: {
      en: 'Prize-competition foundation; Immortal Dragons is a partner of XPRIZE Healthspan and sponsored the 2026 finalist awards ceremony.',
      zh: '奖金竞赛基金会；不朽真龙为XPRIZE Healthspan合作伙伴，赞助2026年决赛入围颁奖典礼。',
    },
    url: 'https://www.xprize.org/',
    inProfile: true,
    onSpectrum: true,
    approval: live(),
  },
  {
    slug: 'lifespan-research-institute',
    name: 'Lifespan Research Institute',
    description: {
      en: 'US longevity nonprofit; Immortal Dragons is one of the inaugural sponsors of its Lifespan Alliance.',
      zh: '美国长寿非营利组织；不朽真龙为其Lifespan Alliance首批赞助方。',
    },
    url: 'https://lifespan.io/',
    inProfile: true,
    onSpectrum: true,
    approval: live(),
  },
  {
    slug: 'public-longevity-group',
    name: 'Public Longevity Group',
    description: {
      en: 'A Lifespan Research Institute project studying public attitudes toward longevity science.',
      zh: 'Lifespan Research Institute旗下项目，研究公众对长寿科学的态度。',
    },
    inProfile: true,
    onSpectrum: true,
    approval: live(),
  },
  {
    slug: '2060-longevity-forum',
    name: '2060 Longevity Forum',
    description: { en: "Longevity forum hosted by France's 2060 Foundation.", zh: '法国2060 Foundation主办的长寿论坛。' },
    url: 'https://forum.2060.life/',
    inProfile: true,
    onSpectrum: true,
    approval: live(),
  },
  {
    slug: 'revive-me',
    name: 'REVIVE ME',
    description: { en: 'Longevity and health-tech summit in Abu Dhabi.', zh: '阿布扎比长寿与健康科技峰会。' },
    url: 'https://revivemeexpo.com/',
    inProfile: true,
    onSpectrum: true,
    approval: live(),
  },
  {
    slug: 'healthy-longevity-medicine-conference',
    name: 'Healthy Longevity and Medicine Conference',
    spectrumLabel: 'Health Longevity and Medicine Conference',
    description: {
      en: 'Healthy longevity and medicine conference co-hosted by the NUS Yong Loo Lin School of Medicine and others.',
      zh: '新加坡国立大学医学院等合办的健康长寿与医学会议。',
    },
    url: 'https://www.hlmconference.com/',
    inProfile: true,
    onSpectrum: true,
    approval: live('conferenceName'),
  },
  {
    slug: 'vitalist-bay-summit',
    name: 'Vitalist Bay Summit',
    description: {
      en: 'Longevity pop-up city and summit in Berkeley, California; Immortal Dragons was a founding sponsor.',
      zh: '美国伯克利长寿主题快闪城市及峰会；不朽真龙为创始赞助方。',
    },
    url: 'https://vitalistbay.com/',
    inProfile: true,
    onSpectrum: true,
    approval: live(),
  },
  {
    slug: 'copenhagen-aging-brain-rejuvenation',
    name: 'University of Copenhagen Project: Aging Brain Rejuvenation',
    spectrumLabel: 'UNIVERSITY OF COPENHAGEN PROJECT: Aging Brain Rejuvenation',
    description: {
      en: 'Center for Healthy Aging at the University of Copenhagen, developing compounds that clear senescent astrocytes.',
      zh: '哥本哈根大学健康老龄化中心，开发清除衰老星形胶质细胞的化合物。',
    },
    inProfile: true,
    onSpectrum: true,
    approval: live(),
  },
  {
    slug: 'oxford-heart-aging-metabolism',
    name: 'University of Oxford Project: Heart Aging and Metabolism',
    spectrumLabel: 'UNIVERSITY OF OXFORD PROJECT: Heart Aging And Metabolism',
    description: {
      en: 'University of Oxford research on the metabolic mechanisms of heart aging and dietary interventions.',
      zh: '牛津大学心脏衰老代谢机制与饮食干预研究。',
    },
    inProfile: true,
    onSpectrum: true,
    approval: live(),
  },
  {
    slug: 'stanford-brain-resilience',
    name: 'Stanford University Project: Brain Resilience Mechanism',
    spectrumLabel: 'Stanford University PROJECT: Brain Resilience Mechanism',
    description: {
      en: 'Research on brain and neural aging at the Wyss-Coray Lab, Stanford University.',
      zh: '斯坦福大学Wyss-Coray实验室的大脑与神经衰老研究。',
    },
    inProfile: true,
    onSpectrum: true,
    approval: live(),
  },
  {
    slug: 'cornerstone-foundation',
    name: 'Cornerstone Non-profit Foundation',
    description: {
      en: 'Policy advocacy supporting New Hampshire\'s "Right to Try" bill, HB 701.',
      zh: '支持新罕布什尔州"尝试权"法案HB 701的政策倡导。',
    },
    url: 'https://www.cornerstone.foundation/',
    inProfile: true,
    onSpectrum: true,
    approval: live(),
  },
  {
    slug: 'beyond-tomorrow-podcast',
    name: 'Beyond Tomorrow Podcast',
    description: { en: 'Podcast on AI and longevity hosted by Julian Issa.', zh: '关于AI与长寿的播客，主持人Julian Issa。' },
    url: 'https://beyondtomorrowpodcast.com/',
    inProfile: true,
    onSpectrum: true,
    approval: live(),
  },
  {
    slug: 'hackaging-ai',
    name: 'HackAging.ai Hackathon',
    description: {
      en: '2025 global online hackathon on using AI agents to fight aging.',
      zh: '2025年"用AI智能体对抗衰老"全球线上黑客松。',
    },
    url: 'https://www.hackaging.ai/',
    inProfile: true,
    onSpectrum: true,
    approval: live(),
  },
  {
    slug: 'biohackerdao',
    name: 'BioHackerDAO',
    url: 'https://biohackerdao.org/',
    inProfile: false,
    onSpectrum: true,
    approval: live('sponsors'),
  },
  {
    slug: 'vitalism',
    name: 'Vitalism',
    description: {
      en: 'Advocacy organization dedicated to ending aging; organizer of Vitalist Bay.',
      zh: '以终结衰老为目标的倡导组织，Vitalist Bay主办方。',
    },
    url: 'https://vitalismfoundation.org/',
    inProfile: true,
    onSpectrum: true,
    approval: live(),
  },
  {
    slug: 'longevity-science-foundation',
    name: 'Longevity Science Foundation',
    description: { en: 'Swiss nonprofit funding early-stage longevity research.', zh: '瑞士非营利组织，资助早期长寿研究。' },
    url: 'https://longevity.foundation/',
    inProfile: true,
    onSpectrum: true,
    approval: live(),
  },
  {
    slug: 'sundial-initiative',
    name: 'Sundial Initiative',
    description: {
      en: 'California nonprofit studying aging and resilience genes.',
      zh: '加州非营利组织，研究衰老与韧性基因。',
    },
    url: 'https://sundial-initiative.org/',
    inProfile: true,
    onSpectrum: true,
    approval: live(),
  },
  {
    slug: 'timepie-longevity-forum',
    name: 'TimePie Longevity Forum',
    description: { en: 'Aging-intervention forum hosted by TimePie in Shanghai.', zh: '时光派在上海举办的衰老干预论坛。' },
    url: 'https://www.timepie.com/',
    inProfile: true,
    onSpectrum: true,
    approval: live(),
  },
  {
    slug: 'american-alzheimer-association',
    name: 'American Alzheimer Association',
    description: {
      en: "The largest nonprofit funder of Alzheimer's research in the United States (Alzheimer's Association).",
      zh: "美国最大的阿尔茨海默病研究非营利资助机构（Alzheimer's Association）。",
    },
    inProfile: true,
    onSpectrum: false,
    approval: live('sponsors'),
  },
  {
    slug: 'china-alzheimer-association',
    name: 'China Alzheimer Association',
    description: { en: "China Association for Alzheimer's Disease (CAAD).", zh: '中国阿尔茨海默病防治协会（CAAD）。' },
    inProfile: true,
    onSpectrum: false,
    approval: live('sponsors'),
  },
]);

/** The profile's list (llms.txt, the article): 21 entries at the baseline. */
export const PROFILE_GRANTS = GRANTS.filter((grant) => grant.inProfile);

/** Spectrum's "Proudly Supporting" list: 20 entries at the baseline. */
export const SPECTRUM_GRANTS = GRANTS.filter((grant) => grant.onSpectrum);
