import { NAV_LIST } from '@/components/nav/nav';
import Connect from './_components/Connect';

export default function Processes() {
  return (
    <div id={NAV_LIST[4].id} className="page-container bg-gray-200 bg-none px-12 pt-24 mobile:px-5 mobile:pt-9">
      <video
        autoPlay
        muted
        loop
        playsInline
        data-speed="0.8"
        className="absolute right-0 top-0 w-full"
        src="https://resources.id.life/processes-02.webm"
        poster="/imgs/processes.jpg"
      />
      <div className="relative">
        <Connect />
      </div>
    </div>
  );
}
