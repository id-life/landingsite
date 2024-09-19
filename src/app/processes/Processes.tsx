import { NAV_LIST } from '@/components/nav/nav';
import Intervention from '@/app/intervention/Intervention';
import Insight from '@/app/insight/Insight';
import Tracking from '@/app/tracking/Tracking';

export default function Processes() {
  return (
    <div id={NAV_LIST[2].id} className="page-container p-12 mobile:p-5">
      <video
        autoPlay
        muted
        loop
        playsInline
        data-speed="0.8"
        className="absolute right-0 top-0 h-full w-full object-cover"
        src="https://cdn.id.life/processes-01.webm"
        poster="/imgs/processes.jpg"
      />
      <div className="relative">
        <div>
          <h2 className="page-title">industry processes</h2>
          <div className="mt-8 grid grid-cols-5 md:mt-4">
            <div>
              <div className="relative mb-4 w-8 -translate-x-3.5 text-center text-xl/5 font-bold mobile:w-4 mobile:-translate-x-[0.4rem] mobile:text-[.625rem]/3">
                01
              </div>
              <div className="border-b border-l border-black px-3 py-5 pt-4 text-xl/5 font-semibold mobile:mt-2.5 mobile:px-1 mobile:text-[.5rem]/3">
                Researcher
              </div>
            </div>
            <div>
              <div className="relative mb-1.5 w-8 -translate-x-3.5 text-center text-xl/5 font-bold text-red-600 mobile:text-[.625rem]/3">
                02
              </div>
              <div className="relative border-b border-l border-red-600 px-3 py-5 pt-6.5 text-xl/5 font-semibold text-red-600 mobile:px-1 mobile:text-[.5rem]/3">
                Translator
                <img className="absolute bottom-0 left-0 w-5 -rotate-90" src="/svgs/arrow-mark.svg" alt="arrow-mark" />
              </div>
            </div>
            <div>
              <div className="relative mb-4 w-8 -translate-x-3.5 text-center text-xl/5 font-bold mobile:text-[.5rem]/3">03</div>
              <div className="mt-2.5 border-b border-l border-black px-3 py-5 pt-4 text-xl/5 font-semibold mobile:px-1 mobile:text-[.5rem]/3">
                Manufacturer
              </div>
            </div>
            <div>
              <div className="relative mb-1.5 w-8 -translate-x-3.5 text-center text-xl/5 font-bold text-red-600 mobile:text-[.625rem]/3">
                04
              </div>
              <div className="relative border-b border-l border-red-600 px-3 py-5 pt-6.5 text-xl/5 font-semibold text-red-600 mobile:px-1 mobile:text-[.5rem]/3">
                Operator
                <img className="absolute bottom-0 left-0 w-5 -rotate-90" src="/svgs/arrow-mark.svg" alt="arrow-mark" />
              </div>
            </div>
            <div>
              <div className="relative mb-4 w-8 -translate-x-3.5 text-center text-xl/5 font-bold mobile:text-[.625rem]/3">
                05
              </div>
              <div className="mt-2.5 border-b border-l border-black px-3 py-5 pt-4 text-xl/5 font-semibold mobile:px-1 mobile:text-[.625rem]/3">
                Consumer
              </div>
            </div>
          </div>
          <div className="mt-17 mobile:mt-10">
            <div className="flex gap-22.5 mobile:flex-col mobile:gap-5">
              <div>
                <div className="processes-clip px-3.5 py-2 text-xl/5 font-medium text-white mobile:px-2.5 mobile:py-1 mobile:text-[.625rem]/3">
                  &nbsp;Focus on early adopters for future
                </div>
                <p className="mt-3 text-sm font-semibold mobile:mt-1.5 mobile:text-[.625rem]/3">
                  Catering to Kindred Spirits, Not the Crowd.
                </p>
              </div>
              <div>
                <div className="processes-clip inline-block px-3.5 py-2 text-xl/5 font-medium text-white mobile:px-2.5 mobile:py-1 mobile:text-[.625rem]/3">
                  &nbsp;Dire lack of operators
                </div>
                <p className="mt-3 text-sm font-semibold mobile:text-[.625rem]/3">
                  Research (knowledge, insight) is hard; Manufacturing is
                  <br /> relatively easy; Operating is prohibitively difficult by regulation.
                </p>
              </div>
            </div>
            <div className="mt-14 mobile:mt-5">
              <div className="processes-clip inline-block px-3.5 py-2 text-xl/5 font-medium text-white mobile:px-2.5 mobile:py-1 mobile:text-[.625rem]/3">
                &nbsp;Regulatory environment
              </div>
              <p className="mt-3 text-sm font-semibold mobile:text-[.625rem]/3">Adapting to and Building the Environment.</p>
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
