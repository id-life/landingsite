export default function PodcastCommentItem() {
  return (
    <div className="flex gap-2">
      <div className="size-10 rounded-full bg-gray-300" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-550">HC</div>
            <p className="text-xs/3 text-gray-350">2025.5.25</p>
          </div>
          <div className="text-xs text-gray-500">— 来自小宇宙用户</div>
        </div>
        <p className="mt-2 text-sm font-medium">
          记得初中就学会过多利羊，科学的发展让科幻照进现实，WBR如果真的可以对c端普及，那又是一个忒修斯之船，你还是你吗？
          只有正反调博弈的话题才有可能真的改变人类命运。希望有一天，上帝不会不认识我，而是夸我牛逼。
        </p>
      </div>
    </div>
  );
}
