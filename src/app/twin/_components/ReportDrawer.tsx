import { Drawer } from 'vaul';
import { useState, type ReactNode } from 'react';
import clsx from 'clsx';
import SwitchLanguage from './SwitchLanguage';
import Tag from './Tag';
import { trackTwin } from '@/lib/analytics/twin';
import type { TwinDeck } from '@/app/twin/twin-deck';

/**
 * A clone's full report (More >), one drawer for both decks (RWD-02; ReportM01..03 and their mobile twins each built
 * their own). Shared: the trigger, the language switch, the report text. By deck: a 42-unit side panel from the left
 * with the period as a badge (desktop), or a bottom sheet with the period and habits as tags (phone).
 * Type roles (RWD-01): the report text is body (16 px and up), the title title / title-sm, the period label.
 */
export default function ReportDrawer({
  deck,
  code,
  title,
  period,
  tags,
  children,
}: {
  deck: TwinDeck;
  /** The clone's code for analytics (C01..C03). */
  code: string;
  title: string;
  period: { en: string; zh: string };
  /** The phone sheet's tags (the period and two habits). */
  tags: readonly string[];
  /** The report text, in Chinese or English. */
  children: (isChinese: boolean) => ReactNode;
}) {
  const phone = deck === 'phone';
  const [isChinese, setIsChinese] = useState(false);
  const languageSwitch = <SwitchLanguage isChineseActive={isChinese} onChange={setIsChinese} />;

  return (
    <Drawer.Root direction={phone ? 'bottom' : 'left'} disablePreventScroll={phone ? true : undefined}>
      {/* An inline control in running text: a 44 px hit area on coarse pointers, the line keeps its height (RWD-06). */}
      <Drawer.Trigger
        className={clsx('relative text-accent tap-area', phone && 'text-label font-semibold')}
        onClick={() => trackTwin('report', code)}
      >
        {' '}
        More &gt;
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-[50] bg-black/40 backdrop-blur" />
        <Drawer.Content
          className={clsx(
            'fixed bottom-0 left-0 z-[100] flex bg-white outline-none',
            phone ? 'top-[200px] w-full' : 'top-0 w-[max(42rem,min(504px,100vw))]',
          )}
        >
          <div className={clsx('flex h-full w-full grow flex-col', phone ? 'flex-1 overflow-y-auto p-4' : 'p-10')}>
            <div className={phone ? 'flex-none' : 'contents'}>
              <Drawer.Title className={clsx('font-semibold', phone ? 'flex items-center gap-3 text-title-sm' : 'text-title')}>
                {title}
                {phone && <> {languageSwitch}</>}
              </Drawer.Title>
              <Drawer.Close className={clsx('flex-center absolute tap', phone ? 'right-4 top-4 w-5' : 'right-10 top-10 w-5')}>
                <img src="/svgs/close.svg" alt="" />
              </Drawer.Close>
              <div className="mb-2 mt-4 flex items-center justify-between">
                {phone ? (
                  <div className="flex-1 overflow-hidden">
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-center gap-0.5 bg-accent/20 p-1 text-label font-semibold uppercase text-accent">
                      <img src="/svgs/twin/time.svg" alt="" />
                      {isChinese ? period.zh : period.en}
                    </div>
                    {languageSwitch}
                  </>
                )}
              </div>
            </div>
            <div className="overflow-scroll">
              <div className="mt-5 text-body font-medium">{children(isChinese)}</div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
