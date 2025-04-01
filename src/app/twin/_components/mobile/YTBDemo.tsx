import DemoBorderSVG from '@/../public/svgs/twin/demo-border.svg?component';
import YoutubeSVG from '@/../public/svgs/twin/youtube.svg?component';
import RightSVG from '@/../public/svgs/twin/right.svg?component';

export default function YTBDemo() {
  const handleYTBLinkClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div id="ytb-demo" className="absolute bottom-44 left-1/2 transform -translate-x-1/2 z-20 grid cursor-pointer gap-5">
      <div
        onClick={() => handleYTBLinkClick('https://www.youtube.com/watch?v=DkC4e9wZJbw')}
        className="group relative flex h-[28px] w-[133px] items-center justify-between px-5"
      >
        <DemoBorderSVG className="absolute left-0 top-0 h-full w-full fill-black group-hover:fill-red-600" />
        <div className="flex-center gap-2 text-sm font-medium group-hover:text-red-600">
          <YoutubeSVG className="fill-black group-hover:fill-red-600 w-4" />
          DEMO
        </div>
        <RightSVG className="fill-black stroke-black group-hover:fill-red-600 group-hover:stroke-red-600" />
      </div>
    </div>
  );
}
