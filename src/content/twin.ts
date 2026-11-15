// The Digital Twin section's copy. Shared by Twin (3D page) and the server-rendered page summary.
import { live } from './approval';
import { Text, ShippableApproval, defineContent } from './schema';
import { z } from 'zod';

const TwinCopy = z.object({
  features: z.array(Text).min(1),
  ontology: z.object({ title: Text, text: Text }),
  approval: ShippableApproval,
});

const TWIN = defineContent('content/twin.ts', TwinCopy, {
  features: [
    { en: 'High-Precision Digital Twin Model Creation', zh: '高精度数字孪生' },
    { en: 'Predictive Models', zh: 'AI预测克隆体' },
    { en: 'Long-Term Health Tracking & Personalized Guidance', zh: '健康跟踪与个性化指导' },
    { en: 'Progressive Digital Twin Refinement & Optimization', zh: '持续升级和优化' },
  ],
  ontology: {
    title: { en: 'Appearance & Biomarkers', zh: '外形采集&健康数据' },
    text: {
      en: 'Precision Digital Clones: Generated from Biomarkers & Environmental Contexts.',
      zh: '根据个人生物指标创建本体 & 根据时间、环境和习惯生成克隆',
    },
  },
  approval: live(),
});

export const TWIN_FEATURES = TWIN.features.map((feature) => feature.en);

/** The Chinese feature names on one line, as the section shows them. */
export const TWIN_FEATURES_CN = TWIN.features.map((feature) => feature.zh).join('/');

export const TWIN_ONTOLOGY = {
  title: `${TWIN.ontology.title.en} ${TWIN.ontology.title.zh}`,
  en: TWIN.ontology.text.en,
  cn: TWIN.ontology.text.zh ?? '',
};
