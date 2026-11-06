import PageSEOContent from '@/components/seo/PageSEOContent';
import { CONNECT_TEXT, END_CONTENT_1, END_CONTENT_2 } from '@/app/connect/content';
import { ORG_ADDRESS, ORG_EMAIL } from '@/constants/entity';

export default function ConnectSummary({ title, description }: { title: string; description: string }) {
  const { streetAddress, addressLocality, postalCode } = ORG_ADDRESS;
  return (
    <PageSEOContent
      title={title}
      intro={[description]}
      sections={[
        ...CONNECT_TEXT.map((item) => ({ heading: item.title, text: [item.content] })),
        {
          heading: END_CONTENT_1.en.title,
          text: END_CONTENT_1.en.items,
        },
        {
          heading: END_CONTENT_1.cn.title,
          text: END_CONTENT_1.cn.items.map((text) => ({ text, lang: 'zh-CN' })),
        },
        {
          heading: END_CONTENT_2.en.map((item) => item.title).join(' · '),
          items: [
            ...END_CONTENT_2.en.map((item) => ({ title: item.title, text: [item.content] })),
            ...END_CONTENT_2.cn.map((item) => ({
              title: item.title.replace(/[:：]\s*$/, '').trim(),
              text: [{ text: item.mobileContent ?? item.content, lang: 'zh-CN' }],
            })),
          ],
        },
        {
          heading: 'Contact',
          items: [
            { title: ORG_EMAIL, href: `mailto:${ORG_EMAIL}` },
            { title: `${streetAddress}, ${addressLocality} ${postalCode}` },
          ],
        },
      ]}
    />
  );
}
