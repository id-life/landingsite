import { NAV_LIST } from '@/components/nav/nav';
import Intervention from '@/app/intervention/Intervention';
import Insight from '@/app/insight/Insight';
import Tracking from '@/app/tracking/Tracking';

export default function Processes() {
  return (
    <div id={NAV_LIST[1].id} className="page-container p-8">
      <video
        autoPlay
        muted
        loop
        data-speed="0.8"
        className="absolute right-0 top-0 h-full w-full object-cover"
        src="/assets/processes.webm"
        poster="/img/processes.jpg"
      />
      <div className="relative">
        <div className="page-height text-2xl">
          <p>Processes</p>
        </div>
        <Insight />
        <Tracking />
        <Intervention />
      </div>
    </div>
  );
}
