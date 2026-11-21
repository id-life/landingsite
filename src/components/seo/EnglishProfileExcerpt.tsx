import { LLMS_SECTIONS, llmsSection } from '@/app/llms.txt/content';
import HiddenMarkdown from '@/components/seo/HiddenMarkdown';

type SectionKey = keyof typeof LLMS_SECTIONS;

// Hidden English excerpt of the official English profile (the llms.txt header) for a page whose
// visible content covers the same topic. English counterpart of ArticleExcerpt.
export default function EnglishProfileExcerpt({ sections }: { sections: SectionKey[] }) {
  const markdown = sections
    .map((key) => llmsSection(LLMS_SECTIONS[key]))
    .filter(Boolean)
    .join('\n\n');
  if (!markdown) return null;
  return (
    <section className="sr-only" lang="en" aria-label="About Immortal Dragons">
      <HiddenMarkdown>{markdown}</HiddenMarkdown>
    </section>
  );
}
