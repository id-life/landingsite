import PodcastContentTab from '@/app/podcast/[id]/_components/PodcastContentTab';
import PodcastPlayer from '@/app/podcast/[id]/_components/PodcastPlayer';

export default function PodcastContentPage() {
  return (
    <div className="py-10">
      <img className="mx-auto w-24 rounded-lg" src="https://cdn.id.life/audio/idfm_logo.webp" alt="" />
      <div className="flex-center my-7.5 mt-6 gap-2.5">
        <h1 className="text-xl font-semibold">EP1 我们为何投资 Whole Body Replacement (1): 从克隆说起</h1>
        <div className="flex-center gap-2">
          <img className="w-7.5 cursor-pointer" src="/imgs/podcast/fm_xyz.png" alt="" />
          <img className="w-7.5 cursor-pointer" src="/imgs/podcast/fm_spotify.png" alt="" />
          <img className="w-7.5 cursor-pointer" src="/imgs/podcast/fm_podcast.png" alt="" />
        </div>
      </div>
      <div className="h-[300px] w-full bg-gray-300" />
      <div className="my-9 mt-7.5 text-sm font-medium">
        近期，不朽真龙 Immortal Dragons 完成了对一家 Whole Body Replacement 领域的公司的投资。Whole Body
        Replacement，可以称为全身替换。这也符合不朽真龙的一个投资主题：修复不如替换（Replace Not
        Repair）。那么全身替换怎么做？技术有何可行性？这一系列节目跟大家讨论这几个话题。
      </div>
      <PodcastContentTab />
      <PodcastPlayer />
    </div>
  );
}
