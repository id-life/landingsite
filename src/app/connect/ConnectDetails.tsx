import { cn } from '@/utils';
import { CONNECT_TEXT, END_CONTENT_1 } from './content';

// The investment criteria and the four value statements of the Connect section, as visible live text in one
// language (English; the Chinese strings stay in ./content for the /zh locale). They used to be mounted only on
// phones, as fixed blocks at opacity 0.

/** 'A New Dawn 曙光' -> 'A New Dawn'. */
const englishTitle = (title: string) => title.replace(/\s*[㐀-鿿].*$/, '').trim();
/** The English line of a bilingual "English\nChinese" text. */
const englishText = (text: string) => text.split('\n')[0].trim();

/** Stage and valuation criteria: "Promising Early-Stage Ventures". */
export function ConnectCriteria({
  className,
  titleClassName,
  listClassName,
}: {
  className?: string;
  titleClassName?: string;
  listClassName?: string;
}) {
  return (
    <div className={className}>
      <p className={cn('font-oxanium font-bold uppercase', titleClassName)}>{END_CONTENT_1.en.title}</p>
      <ul className={cn('list-mark-red-disc flex flex-col', listClassName)}>
        {END_CONTENT_1.en.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

/** The four value statements (A New Dawn, As an Evangelist, A Moral Endeavor, A Virtuous Cycle). */
export function ConnectValues({
  className,
  titleClassName,
  textClassName,
}: {
  className?: string;
  titleClassName?: string;
  textClassName?: string;
}) {
  return (
    <ul className={className}>
      {CONNECT_TEXT.map((item) => (
        <li key={item.id}>
          <p className={cn('font-oxanium font-bold uppercase', titleClassName)}>{englishTitle(item.title)}</p>
          <p className={textClassName}>{englishText(item.content)}</p>
        </li>
      ))}
    </ul>
  );
}
