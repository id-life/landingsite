import { NAV_LIST } from '@/components/nav/nav';
import Intervention from '@/app/intervention/Intervention';
import Insight from '@/app/insight/Insight';
import Tracking from '@/app/tracking/Tracking';
import { useIsMobile } from '@/hooks/useIsMobile';
import Value from './_components/Value';

export default function Processes() {
  const isMobile = useIsMobile();
  return (
    <div id={NAV_LIST[2].id} className="page-container bg-gray-200 bg-none px-12 pt-24 mobile:px-5 mobile:pt-9">
      <video
        autoPlay
        muted
        loop
        playsInline
        data-speed="0.8"
        className="absolute right-0 top-0 w-full"
        src="https://cdn.id.life/processes-02.webm"
        poster="/imgs/processes.jpg"
      />
      <div className="relative">
        <Value />
        {/* <div>
          <h2 className="page-title">industry processes</h2>
          <div className="mt-8 grid grid-cols-5 md:mt-4 mobile:mt-6 mobile:grid-cols-3 mobile:gap-y-5">
            <div>
              <div className="relative mb-4 w-8 -translate-x-3.5 text-center text-xl/5 font-bold mobile:mb-1.5 mobile:w-4 mobile:-translate-x-[0.4rem] mobile:text-sm/3.5">
                01
              </div>
              <div className="border-b border-l border-black px-3 py-5 pt-4 text-xl/5 font-semibold mobile:mt-0 mobile:px-1 mobile:py-2 mobile:text-sm/3.5">
                Researcher
              </div>
            </div>
            <div>
              <div className="relative mb-1.5 w-8 -translate-x-3.5 text-center text-xl/5 font-bold text-red-600 mobile:mb-1.5 mobile:text-sm/3.5">
                02
              </div>
              <div className="relative border-b border-l border-red-600 px-3 py-5 pt-6.5 text-xl/5 font-semibold text-red-600 mobile:mt-0 mobile:px-1 mobile:py-2 mobile:text-sm/3.5">
                Translator
                <img
                  className="absolute bottom-0 left-0 w-5 -rotate-90 mobile:w-2.5"
                  src="/svgs/arrow-mark.svg"
                  alt="arrow-mark"
                />
              </div>
            </div>
            <div>
              <div className="relative mb-4 w-8 -translate-x-3.5 text-center text-xl/5 font-bold mobile:mb-1.5 mobile:text-sm/3.5">
                03
              </div>
              <div className="mt-2.5 border-b border-l border-black px-3 py-5 pt-4 text-xl/5 font-semibold mobile:mt-0 mobile:px-1 mobile:py-2 mobile:text-sm/3.5">
                Manufacturer
              </div>
            </div>
            <div>
              <div className="relative mb-1.5 w-8 -translate-x-3.5 text-center text-xl/5 font-bold text-red-600 mobile:mb-1.5 mobile:text-sm/3.5">
                04
              </div>
              <div className="relative border-b border-l border-red-600 px-3 py-5 pt-6.5 text-xl/5 font-semibold text-red-600 mobile:mt-0 mobile:px-1 mobile:py-2 mobile:text-sm/3.5">
                Operator
                <img
                  className="absolute bottom-0 left-0 w-5 -rotate-90 mobile:w-2.5"
                  src="/svgs/arrow-mark.svg"
                  alt="arrow-mark"
                />
              </div>
            </div>
            <div>
              <div className="relative mb-4 w-8 -translate-x-3.5 text-center text-xl/5 font-bold mobile:mb-1.5 mobile:text-sm/3.5">
                05
              </div>
              <div className="mt-2.5 border-b border-l border-black px-3 py-5 pt-4 text-xl/5 font-semibold mobile:mt-0 mobile:px-1 mobile:py-2 mobile:text-sm/3.5">
                Consumer
              </div>
            </div>
          </div>
          <div className="mt-17 mobile:mt-12">
            <div className="flex gap-22.5 mobile:flex-col mobile:gap-9">
              <div>
                <div className="processes-clip inline-block px-3.5 py-2 text-xl/5 font-medium text-white mobile:px-2.5 mobile:py-1 mobile:text-sm/5">
                  &nbsp;Focus on early adopters for future
                </div>
                <p className="mt-3 text-sm font-semibold mobile:mt-1.5 mobile:text-xs/5">
                  Catering to Kindred Spirits, Not the Crowd.
                </p>
              </div>
              <div>
                <div className="processes-clip inline-block px-3.5 py-2 text-xl/5 font-medium text-white mobile:px-2.5 mobile:py-1 mobile:text-sm/5">
                  &nbsp;Dire lack of operators
                </div>
                <p className="mt-3 text-sm font-semibold mobile:text-xs/5">
                  Research (knowledge, insight) is hard; Manufacturing is {isMobile ? '' : <br />}relatively easy; Operating is
                  prohibitively difficult by regulation.
                </p>
              </div>
            </div>
            <div className="mt-14 mobile:mt-9">
              <div className="processes-clip inline-block px-3.5 py-2 text-xl/5 font-medium text-white mobile:px-2.5 mobile:py-1 mobile:text-sm/5">
                &nbsp;Regulatory environment
              </div>
              <p className="mt-3 text-sm font-semibold mobile:text-xs/5">Adapting to and Building the Environment.</p>
            </div>
          </div>
        </div> */}
        {/* <Insight /> */}
        {/* <Tracking />
        <Intervention /> */}
      </div>
    </div>
  );
}
