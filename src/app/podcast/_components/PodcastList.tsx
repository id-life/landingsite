import { RELOAD_BUTTON_CLASS } from '@/components/common/ErrorState';
import { PODCAST_NAV_LIST, PodcastCategory } from '@/app/podcast/_components/constant';
import PodcastListItem from '@/app/podcast/_components/PodcastListItem';
import EpisodeClickTracker from '@/app/podcast/_components/EpisodeClickTracker';
import { getPodcastEpisodes } from '@/app/podcast/_components/episodes';

type PodcastListProps = {
  category: PodcastCategory;
};

export default async function PodcastList(props: PodcastListProps) {
  const { category } = props;
  const list = await getPodcastEpisodes(category);

  if (!list) {
    const retry = PODCAST_NAV_LIST.find((item) => item.id === category)?.link ?? '/podcast';
    return (
      // The owner's "Reload" and nothing else (his rule: no text he has not shown). A full reload fetches the page
      // again; it regenerates on the server every 5 minutes.
      <div role="status" className="py-16 text-center text-black mobile:py-12">
        <a href={retry} className={`inline-block ${RELOAD_BUTTON_CLASS}`}>
          Reload
        </a>
      </div>
    );
  }

  return (
    <div className="grid gap-12 mobile:gap-9">
      {list.map((item) => (
        // The row's link (a new tab, as on his site) with its click event.
        <EpisodeClickTracker key={item.id} episodeId={String(item.id)} channel={item.category} href={`/podcast/${item.id}`}>
          <PodcastListItem data={item} />
        </EpisodeClickTracker>
      ))}
    </div>
  );
}
