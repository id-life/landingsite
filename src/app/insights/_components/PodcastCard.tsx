import Link from 'next/link';
import { STORAGE_KEY } from '@/constants/storage';
import { PodcastItem } from '@/app/insights/_components/PodcastSection';

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
export function PodcastCard({ item, isMobile = false }: PodcastCardProps) {
  // Same tab: the episode page is part of this site. On the phone, mark the return page so Back restores Insights.
  const onNavigate = () => {
    if (isMobile) sessionStorage.setItem(STORAGE_KEY.MOBILE_RETURN_PAGE, 'insights_page');
  };

  return (
    <Link
      href={`/podcast/${item.id}`}
      prefetch={false}
      onClick={onNavigate}
      className="podcast-card-clip group relative block bg-white p-0.5"
    >
      <div className="podcast-card-clip-inner bg-tone-50 p-4 mobile:p-3">
        <div className="flex items-center justify-between gap-3 mobile:gap-2">
          {/* The original's sizes on phones and from 1200 px (never under 12 px); the type roles on tablets. */}
          <h3 className="line-clamp-1 flex-1 font-text text-xl/8 font-bold mobile:line-clamp-2 mobile:text-xs/4.5 medium:text-body medium:leading-snug expanded:text-body expanded:leading-snug">
            {item.title}
          </h3>
          <img
            src="/imgs/podcast/podcast-play-white.svg"
            className="size-10 shrink-0 duration-300 group-hover:scale-110 mobile:size-8 medium:size-[32px] expanded:size-[32px]"
            alt=""
            aria-hidden="true"
          />
        </div>
        <p className="line-clamp-1 text-base font-medium mobile:text-caption medium:text-body-sm expanded:text-body-sm">
          {item.description}
        </p>
      </div>
    </Link>
  );
}
