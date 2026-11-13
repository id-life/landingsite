import type { PodcastItem } from '@/apis/types';

// Search/AI description of an episode (meta description and JSON-LD only — the page itself keeps
// showing the API description). A multi-part series can share one description across its parts,
// which says nothing about the individual part; for those the summary comes from the part's transcript.

const EXCERPT_LENGTH = 160;
// Opening lines every episode repeats: greeting, show intro, producer credit.
const BOILERPLATE = /大家好|欢迎来到|今天来点|制作人|搜索/;

const normalize = (text: string) => text.replace(/\s+/g, ' ').trim();

/** First sentences of the transcript that are about the episode, up to ~EXCERPT_LENGTH characters. */
export function transcriptExcerpt(transcript: string): string {
  const text = normalize(
    transcript
      .replace(/^#+\s.*$/gm, ' ') // headings
      .replace(/\*\*@\[timeline\][^*]*\*\*/g, ' ') // chapter markers: **@[timeline](00:19)📍 …**
      .replace(/\*\*[^*]{0,40}[:：]\*\*/g, ' ') // speaker labels: **Speaker 1:**
      .replace(/\*\*/g, ''),
  );
  const sentences = text.match(/[^。！？!?]+[。！？!?]+/g) ?? [];
  const start = sentences.findIndex((sentence) => !BOILERPLATE.test(sentence));
  if (start === -1) return '';

  let excerpt = '';
  for (const sentence of sentences.slice(start)) {
    if (excerpt && excerpt.length + sentence.length > EXCERPT_LENGTH) break;
    excerpt += sentence.trim();
  }
  return excerpt;
}

export function episodeSummary(item: PodcastItem, siblings: PodcastItem[] = []): string {
  const description = normalize(item.description ?? '');
  const isShared = siblings.some((other) => other.id !== item.id && normalize(other.description ?? '') === description);
  if (!isShared || !item.transcript) return description;
  return transcriptExcerpt(item.transcript) || description;
}
