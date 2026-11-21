import Link from 'next/link';
import { PodcastItem } from '@/app/insights/_components/PodcastSection';
import { zhLang } from '@/utils/lang';

type PodcastCardProps = {
  item: PodcastItem;
  isMobile?: boolean;
};

/**
 * One episode in the Insights podcast row: the whole card is a real link to its episode page (keyboard, middle-click,
 * Cmd/Ctrl-click and no-JavaScript all work), as the news cards are. The Play mark inside it is part of that link,
 * not a second control: it always opened the episode page (where the player is), and an interactive element nested
 * in a link is invalid. The accessible name is the card's visible text, which starts with the episode title (a name
 * of the title alone fails WCAG 2.5.3, label in name, as on the news cards).
 * No prefetch: the cards sit in a section the visitor may never reach, and each prefetch is a request on the hero.
 */
export function PodcastCard({ item }: PodcastCardProps) {
  // A new tab, as on the owner's site (his answer of 2026-11-18, "open new tab", reverses wave 0's same-tab episode
  // links); rel noopener noreferrer, which his window.open lacked. Insights stays where it was, so no return mark.

  return (
    <Link
      href={`/podcast/${item.id}`}
      prefetch={false}
      target="_blank"
      rel="noopener noreferrer"
      className="podcast-card-clip group relative block bg-white p-0.5"
    >
      <div className="podcast-card-clip-inner bg-tone-50 p-4 mobile:p-3">
        <div className="flex items-center justify-between gap-3 mobile:gap-2">
          {/* The original's sizes at every width (the owner's rule on font sizes). */}
          <h3
            lang={zhLang(item.title)}
            className="line-clamp-1 flex-1 font-text text-xl/8 font-bold mobile:line-clamp-2 mobile:text-xs/4.5"
          >
            {item.title}
          </h3>
          <img
            src="/imgs/podcast/podcast-play-white.svg"
            className="size-10 shrink-0 duration-300 group-hover:scale-110 mobile:size-8"
            alt=""
            aria-hidden="true"
          />
        </div>
        <p className="line-clamp-1 text-base font-medium mobile:text-[0.625rem]/4">{item.description}</p>
      </div>
    </Link>
  );
}
