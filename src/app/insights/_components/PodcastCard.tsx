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
          {/* Type roles (RWD-01): title body (body-sm on the phone deck's two-up cards); the description is running text, so
              body on every deck (RWD-01's 16 px bar for runs of 60 characters or more). */}
          <h3 className="line-clamp-1 flex-1 font-text text-body font-bold leading-snug mobile:line-clamp-2 mobile:text-body-sm mobile:leading-snug">
            {item.title}
          </h3>
          <img
            src="/imgs/podcast/podcast-play-white.svg"
            className="size-10 shrink-0 cursor-pointer duration-300 hover:scale-110 mobile:size-8 medium:size-[32px] expanded:size-[32px]"
            alt="Play"
            onClick={handlePlay}
          />
        </div>
        <p className="line-clamp-1 text-body font-medium">{item.description}</p>
      </div>
    </div>
  );
}
