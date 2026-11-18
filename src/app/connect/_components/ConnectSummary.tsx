import PageSEOContent from '@/components/seo/PageSEOContent';
import { ORG_ADDRESS, ORG_EMAIL } from '@/constants/entity';
import { CONNECT_STRENGTHS } from '@/content/connect';

export default function ConnectSummary({ title, description }: { title: string; description: string }) {
  const { streetAddress, addressLocality, postalCode } = ORG_ADDRESS;
  return (
    // contact_intent names this summary's email link "connect" (the delegated handler in src/lib/analytics/boot.tsx).
    <div data-track-placement="connect" className="contents">
      <PageSEOContent
        title={title}
        intro={[description]}
        // Only text the Connect section shows on at least one deck of the owner's site (his rule of 2026-11-18, question
        // 12b): the East & West line. The investment criteria, the four values and the other two strengths were never
        // drawn there (opacity 0 on his phone deck, absent on the laptop), so they are not repeated here.
        sections={[
          {
            heading: CONNECT_STRENGTHS[0].title?.en ?? '',
            text: [CONNECT_STRENGTHS[0].text.en],
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
