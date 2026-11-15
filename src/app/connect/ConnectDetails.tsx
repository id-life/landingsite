import { cn } from '@/utils';
import { CONNECT_CRITERIA, CONNECT_VALUES } from '@/content/connect';

// The investment criteria and the four value statements of the Connect section, as visible live text in one
// language (English; the Chinese strings stay in src/content/connect.ts for the /zh locale). They used to be mounted
// only on phones, as fixed blocks at opacity 0.

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
      <p className={cn('font-oxanium font-bold uppercase', titleClassName)}>{CONNECT_CRITERIA.title.en}</p>
      <ul className={cn('list-mark-red-disc flex flex-col', listClassName)}>
        {CONNECT_CRITERIA.items.map((item) => (
          <li key={item.en}>{item.en}</li>
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
      {CONNECT_VALUES.map((item) => (
        <li key={item.id}>
          <p className={cn('font-oxanium font-bold uppercase', titleClassName)}>{item.title?.en}</p>
          <p className={textClassName}>{item.text.en}</p>
        </li>
      ))}
    </ul>
  );
}
