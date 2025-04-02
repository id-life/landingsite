import YoutubeSVG from '@/../public/svgs/twin/youtube.svg?component';
import RightSVG from '@/../public/svgs/twin/right-2.svg?component';

export default function YTBDemo() {
  return (
    <div id="ytb-demo" className="absolute top-[22rem] left-5 z-20 grid cursor-pointer gap-5">
      <a
        href="https://www.youtube.com/watch?v=DkC4e9wZJbw"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex h-[28px] items-center justify-between"
      >
        <div className="flex-center gap-2 text-sm font-medium group-hover:text-red-600">
          <YoutubeSVG className="fill-black group-hover:fill-red-600 w-4" />
          DEMO
        </div>
        <RightSVG className="fill-black stroke-black group-hover:fill-red-600 group-hover:stroke-red-600 ml-2" />
      </a>
    </div>
  );
}
