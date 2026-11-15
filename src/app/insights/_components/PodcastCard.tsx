import { useRouter } from 'next/navigation';
import { STORAGE_KEY } from '@/constants/storage';
import { PodcastItem } from '@/app/insights/_components/PodcastSection';

type PodcastCardProps = {
  item: PodcastItem;
  isMobile?: boolean;
};

export function PodcastCard({ item, isMobile = false }: PodcastCardProps) {
  const router = useRouter();

  // The card links straight to its episode by id. It used to look the episode up in the player's 1.3 MB list
  // first, which made the Play button depend on that list (now fetched only when the player is opened).
  const handlePlay = () => {
    // Same tab: the episode page is part of this site.
    if (isMobile) sessionStorage.setItem(STORAGE_KEY.MOBILE_RETURN_PAGE, 'insights_page');
    router.push(`/podcast/${item.id}`);
  };

  return (
    <div className="podcast-card-clip relative bg-white p-0.5">
      <div className="podcast-card-clip-inner bg-tone-50 p-4 mobile:p-3">
        <div className="flex items-center justify-between gap-3 mobile:gap-2">
          <h3 className="line-clamp-1 flex-1 font-text text-xl/8 font-bold mobile:line-clamp-2 mobile:text-xs/4.5">
            {item.title}
          </h3>
          <img
            src="/imgs/podcast/podcast-play-white.svg"
            className="size-10 shrink-0 cursor-pointer duration-300 hover:scale-110 mobile:size-8"
            alt="Play"
            onClick={handlePlay}
          />
        </div>
        <p className="line-clamp-1 text-base font-medium mobile:text-xs/4">{item.description}</p>
      </div>
    </div>
  );
}
