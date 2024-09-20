import { NAV_LIST } from '@/components/nav/nav';
import ArrowMarkSVG from '@/../public/svgs/arrow-mark.svg?component';
import { cn } from '@/utils';
import { useIsMobile } from '@/hooks/useIsMobile';

type TrackingItem = {
  cover: string;
  title: string;
};

const Tracking_List: TrackingItem[] = [
  {
    cover: '/imgs/tracking-01.webp',
    title: 'Biomarker tracking & diagnostics',
  },
  {
    cover: '/imgs/tracking-02.webp',
    title: 'Showroom and industry relations center & PR / GR center',
  },
  {
    cover: '/imgs/tracking-03.webp',
    title: 'Vetted interventions & selected supplements',
  },
];

export default function Tracking() {
  return (
    <div id={NAV_LIST[4].id} className="mt-[16.625rem] p-12 mobile:mt-56 mobile:p-0">
      <h2 className="page-title">Tracking Center</h2>
      <p className="font-migrena text-2xl/12 font-bold uppercase mobile:mt-1.5 mobile:text-sm/5 mobile:capitalize">Singapore</p>
      <div className="mt-12 mobile:mt-6">
        <div className="flex h-112 w-3/4 gap-5 mobile:h-auto mobile:w-full mobile:flex-col mobile:gap-4">
          {Tracking_List.map((item, index) => (
            <div
              key={index}
              className="group relative flex-1 cursor-pointer border-r border-gray-800 shadow duration-500 hover:basis-1/2"
            >
              <ArrowMarkSVG className="absolute left-0 top-0 w-7.5 fill-gray-800 duration-500 group-hover:fill-red-600 mobile:w-3 mobile:group-hover:fill-gray-800" />
              <img className="h-full object-cover object-left mobile:h-auto" src={item.cover} alt="tracking-01" />
              <div className="mobile:text-sm/3.5 absolute bottom-0 left-0 w-full truncate bg-red-600/80 p-5 text-xl/5 font-semibold capitalize text-white mobile:bg-gray-800/80 mobile:py-3 mobile:pl-3.5">
                {item.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
