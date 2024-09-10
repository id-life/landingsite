import { NAV_LIST } from '@/components/nav/nav';
import Intervention from '@/app/intervention/Intervention';
import Insight from '@/app/insight/Insight';
import Tracking from '@/app/tracking/Tracking';

export default function Processes() {
  return (
    <div id={NAV_LIST[1].id} className="page-container p-12">
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
        <div>
          <h2 className="page-title">Medical in dustry processes</h2>
          <div className="mt-8 grid grid-cols-5">
            <div>
              <div className="relative mb-4 w-8 -translate-x-3.5 text-center text-xl/5 font-bold">01</div>
              <div className="border-b border-l border-black px-3 py-5 pt-4 text-xl/5 font-semibold">Researcher</div>
            </div>
            <div>
              <div className="relative mb-1.5 w-8 -translate-x-3.5 text-center text-xl/5 font-bold text-red-600">02</div>
              <div className="pt-6.5 relative border-b border-l border-red-600 px-3 py-5 text-xl/5 font-semibold text-red-600">
                Translator
                <img className="absolute bottom-0 left-0 w-5 -rotate-90" src="/svg/arrow-mark.svg" alt="arrow-mark" />
              </div>
            </div>
            <div>
              <div className="relative mb-4 w-8 -translate-x-3.5 text-center text-xl/5 font-bold">03</div>
              <div className="mt-2.5 border-b border-l border-black px-3 py-5 pt-4 text-xl/5 font-semibold">Manufacturer</div>
            </div>
            <div>
              <div className="relative mb-1.5 w-8 -translate-x-3.5 text-center text-xl/5 font-bold text-red-600">04</div>
              <div className="pt-6.5 relative border-b border-l border-red-600 px-3 py-5 text-xl/5 font-semibold text-red-600">
                Operator
                <img className="absolute bottom-0 left-0 w-5 -rotate-90" src="/svg/arrow-mark.svg" alt="arrow-mark" />
              </div>
            </div>
            <div>
              <div className="relative mb-4 w-8 -translate-x-3.5 text-center text-xl/5 font-bold">05</div>
              <div className="mt-2.5 border-b border-l border-black px-3 py-5 pt-4 text-xl/5 font-semibold">Consumer</div>
            </div>
          </div>
          <div className="mt-17">
            <div className="gap-22.5 flex">
              <div>
                <div className="processes-clip px-3.5 py-2 text-xl/5 font-semibold text-white">
                  &nbsp;Focus on early adopters for future
                </div>
                <p className="mt-3 text-sm font-semibold">Catering to Kindred Spirits, Not the Crowd.</p>
              </div>
              <div>
                <div className="processes-clip inline-block px-3.5 py-2 text-xl/5 font-semibold text-white">
                  &nbsp;Dire lack of operators
                </div>
                <p className="mt-3 text-sm font-semibold">
                  Research (knowledge, insight) is hard; Manufacturing is
                  <br /> relatively easy; Operating is prohibitively difficult by regulation.
                </p>
              </div>
            </div>
            <div className="mt-14">
              <div className="processes-clip inline-block px-3.5 py-2 text-xl/5 font-semibold text-white">
                &nbsp;Regulatory environment
              </div>
              <p className="mt-3 text-sm font-semibold">Adapting to and Building the Environment.</p>
            </div>
          </div>
        </div>
        <Insight />
        <Tracking />
        <Intervention />
      </div>
    </div>
  );
}
