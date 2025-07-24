import { useRouter } from 'next/navigation';

export default function PodcastListItem() {
  const router = useRouter();

  const handleItemClick = () => {
    router.push('/podcast/1');
  };

  return (
    <div onClick={() => handleItemClick()} className="group flex cursor-pointer gap-4">
      <img className="w-16 rounded" src="https://cdn.id.life/audio/idfm_logo.webp" alt="" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold group-hover:text-red-600">
            EP1 我们为何投资 Whole Body Replacement (1): 从克隆说起
          </h3>
          <div className="text-xs text-gray-500">24min · 2025/08/20</div>
        </div>
        <p className="mt-2 line-clamp-2 text-xs/4.5 font-medium">
          近期，不朽真龙 Immortal Dragons 完成了对一家 Whole Body Replacement 领域的公司的投资。Whole Body Replacement，
          可以称为全身替换。这也符合不朽真龙的一个投资主题：修复不如替换（Replace Not
          Repair）。那么全身替换怎么做？技术有何可近期，不朽真龙 Immortal Dragons 完成了对一家 Whole Body Replacement
          领域的公司的投资。Whole Body Replacement， 可以称为全身替换。这也符合不朽真龙的一个投资主题：修复不如替换（Replace Not
          Repair）。那么全身替换怎么做？技术有何可
        </p>
      </div>
    </div>
  );
}
