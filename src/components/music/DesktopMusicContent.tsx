import clsx from 'clsx';
import { useState } from 'react';
import DesktopMusicItem from './DesktopMusicItem';
import DesktopPodcastItem from './DesktopPodcastItem';
import { MusicData, MusicDataItem, PodcastData } from './music-data';

const PlayList = {
  MUSIC: 'MUSIC',
  PODCAST: 'PODCAST',
} as const;
type PlayListKey = keyof typeof PlayList;

const PlayOrder = {
  ORDER: 'ORDER',
  SHUFFLE: 'SHUFFLE',
  REPEAT: 'REPEAT',
  REPEAT_ONE: 'REPEAT_ONE',
} as const;
type PlayOrderKey = keyof typeof PlayOrder;

const underLineClassName =
  'after:absolute after:-bottom-1.5 after:left-0 after:right-0 after:mx-auto after:h-0.5 after:w-9 after:bg-gray-800';

export default function DesktopMusicContent() {
  const [currentList, setCurrentList] = useState<PlayListKey>(PlayList.MUSIC);
  const [playOrder, setPlayOrder] = useState<PlayOrderKey>(PlayOrder.ORDER);
  const [currentMusic, setCurrentMusic] = useState<MusicDataItem | null>(null);

  const handleChangeList = (list: keyof typeof PlayList) => {
    setCurrentList(list);
  };

  const handleChangePlayOrder = () => {
    setPlayOrder((v) => {
      const nextOrder = Object.values(PlayOrder)[(Object.values(PlayOrder).indexOf(v) + 1) % Object.values(PlayOrder).length];
      return nextOrder;
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex-center gap-3 text-xs/3 font-bold">
          <div
            className={clsx('relative cursor-pointer', currentList === PlayList.MUSIC && underLineClassName)}
            onClick={() => handleChangeList(PlayList.MUSIC)}
          >
            MUSIC 音乐
          </div>
          <div
            className={clsx('relative cursor-pointer', currentList === PlayList.PODCAST && underLineClassName)}
            onClick={() => handleChangeList(PlayList.PODCAST)}
          >
            PODCAST 播客
          </div>
        </div>
        <div
          onClick={handleChangePlayOrder}
          className="flex-center h-6.5 cursor-pointer select-none gap-0.5 rounded-full bg-white px-2 text-center text-ss/3 font-semibold"
        >
          {playOrder === PlayOrder.ORDER && (
            <>
              <img className="w-4" src="/svgs/player/play_order.svg" alt="" />
              <div className="w-18">Play in Order</div>
            </>
          )}
          {playOrder === PlayOrder.SHUFFLE && (
            <>
              <img className="w-4" src="/svgs/player/play_shuffle.svg" alt="" />
              <div className="w-18">Shuffle</div>
            </>
          )}
          {playOrder === PlayOrder.REPEAT && (
            <>
              <img className="w-4" src="/svgs/player/play_repeat.svg" alt="" />
              <div className="w-18">Repeat All</div>
            </>
          )}
          {playOrder === PlayOrder.REPEAT_ONE && (
            <>
              <img className="w-4" src="/svgs/player/play_repeat_one.svg" alt="" />
              <div className="w-18">Repeat One</div>
            </>
          )}
        </div>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-5">
        {currentList === PlayList.MUSIC &&
          MusicData.map((item) => (
            <DesktopMusicItem
              currentMusicId={currentMusic?.id}
              key={item.id}
              data={item}
              onClick={() => setCurrentMusic(item)}
            />
          ))}
        {currentList === PlayList.PODCAST &&
          PodcastData.map((item) => (
            <DesktopPodcastItem
              currentMusicId={currentMusic?.id}
              onClick={() => setCurrentMusic(item)}
              key={item.id}
              data={item}
            />
          ))}
      </div>
    </div>
  );
}
