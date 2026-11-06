import PageSEOContent from '@/components/seo/PageSEOContent';
import { TWIN_FEATURES, TWIN_FEATURES_CN, TWIN_ONTOLOGY } from '@/app/twin/content';
import { DigitalTwinYoutubeLink } from '@/constants/links';

export default function DigitalTwinSummary({ title, description }: { title: string; description: string }) {
  return (
    <PageSEOContent
      title={title}
      intro={[description]}
      sections={[
        {
          heading: 'Digital Twin 数字孪生',
          items: TWIN_FEATURES.map((feature) => ({ title: feature })),
          text: [{ text: TWIN_FEATURES_CN, lang: 'zh-CN' }],
        },
        {
          heading: TWIN_ONTOLOGY.title,
          text: [TWIN_ONTOLOGY.en, { text: TWIN_ONTOLOGY.cn, lang: 'zh-CN' }],
          items: [{ title: 'Digital Twin video', href: DigitalTwinYoutubeLink }],
        },
      ]}
    />
  );
}
