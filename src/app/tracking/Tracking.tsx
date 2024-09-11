import { NAV_LIST } from '@/components/nav/nav';
import ArrowMarkSVG from '@/../public/svg/arrow-mark.svg?component';

type TrackingItem = {
  cover: string;
  title: string;
};

const Tracking_List: TrackingItem[] = [
  {
    cover: '/img/tracking-01.webp',
    title: 'Biomarker tracking & diagnostics',
  },
  {
    cover: '/img/tracking-02.webp',
    title: 'Showroom and industry relations center & PR / GR center',
  },
  {
    cover: '/img/tracking-03.webp',
    title: 'Vetted interventions & selected supplements',
  },
];

export default function Tracking() {
  return (
    <div id={NAV_LIST[3].id} className="mt-37 px-12">
      <h2 className="page-title">Tracking Center</h2>
      <p className="font-migrena text-2xl/12 font-bold uppercase">Singapore</p>
      <div className="mt-12">
        <div className="h-112 flex w-3/4 gap-5">
          {Tracking_List.map((item, index) => (
            <div
              key={index}
              className="group relative flex-1 cursor-pointer border-r border-gray-800 shadow duration-500 hover:basis-1/2"
            >
              <ArrowMarkSVG className="w-7.5 absolute left-0 top-0 fill-gray-800 duration-500 group-hover:fill-red-600" />
              <img className="h-full object-cover object-left" src={item.cover} alt="tracking-01" />
              <div className="absolute bottom-0 left-0 w-full truncate bg-red-600/80 p-5 text-xl/5 font-semibold capitalize text-white">
                {item.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
