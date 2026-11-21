import PageSEOContent from '@/components/seo/PageSEOContent';
import { ORG_ADDRESS, ORG_EMAIL } from '@/constants/entity';
import { CONNECT_CRITERIA, CONNECT_STRENGTHS, CONNECT_VALUES } from '@/content/connect';

/**
 * His Connect summary, hidden as on his site and in his structure (his ConnectSummary: the four values, the criteria
 * in English and Chinese, the three strengths, the contact lines), read from the content layer, where the words are his
 * as amended by his answers (the criteria without the investment stage, 12j). His answer to question 25 (2026-11-20):
 * "A: leave them hidden, as your site does today (the default) for now".
 */
export default function ConnectSummary({ title, description }: { title: string; description: string }) {
  const { streetAddress, addressLocality, postalCode } = ORG_ADDRESS;
  return (
    // contact_intent names this summary's email link "connect" (the delegated handler in src/lib/analytics/boot.tsx).
    <div data-track-placement="connect" className="contents">
      <PageSEOContent
        title={title}
        intro={[description]}
        sections={[
          ...CONNECT_VALUES.map((item) => ({
            heading: `${item.title?.en} ${item.title?.zh}`,
            text: [`${item.text.en}\n${item.text.zh}`],
          })),
          { heading: CONNECT_CRITERIA.title.en, text: CONNECT_CRITERIA.items.map((item) => item.en) },
          {
            heading: CONNECT_CRITERIA.title.zh ?? '',
            text: CONNECT_CRITERIA.items.map((item) => ({ text: item.zh ?? '', lang: 'zh-CN' })),
          },
          {
            heading: CONNECT_STRENGTHS.map((item) => item.title?.en).join(' · '),
            items: [
              ...CONNECT_STRENGTHS.map((item) => ({ title: item.title?.en ?? '', text: [item.text.en] })),
              ...CONNECT_STRENGTHS.map((item) => ({
                title: item.title?.zh ?? '',
                text: [{ text: item.text.zh ?? '', lang: 'zh-CN' }],
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
    </div>
  );
}
