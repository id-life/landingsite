import { memo } from 'react';
import gsap from 'gsap';
import { NAV_LIST } from '@/components/nav/nav';
import { useGSAP } from '@gsap/react';
import { useSetAtom } from 'jotai';
import { currentPageAtom } from '@/atoms';

function Engagement() {
  const setCurrentPage = useSetAtom(currentPageAtom);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: `#${NAV_LIST[2].id}`,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: true,
        onEnter: () => {
          setCurrentPage(NAV_LIST[2]);
        },
        onEnterBack: () => {
          setCurrentPage(NAV_LIST[2]);
        },
      },
    });
  }, []);
  return (
    <div id={NAV_LIST[2].id} className="page-container engagement">
      <div className="relative flex h-[100svh] flex-col items-center justify-center">
        <img className="mx-auto w-[56rem]" src="/imgs/engagement/talk-01.webp" alt="" />
        <div className="mt-14 ml-40 grid grid-cols-3 gap-15 text-white">
          <div>
            <div className="text-3xl font-semibold uppercase">talk</div>
            <div className="mt-1.5 text-base font-medium">
              <p>2024 Oxford Future Innovation Forum - Healthy Aging sub-forum</p>
              <p>Timepie</p>
              <p>Edge City Lanna</p>
              <p>Founder&apos;s Longevity Forum</p>
            </div>
          </div>
          <div>
            <div className="text-3xl font-semibold uppercase">translation & publishing</div>
            <div className="mt-1.5 text-base font-medium">
              <p>bio/acc manifesto &gt;</p>
              <p>the Network State &gt;</p>
              <p>The Case against death</p>
              <p>王钊 better aging</p>
            </div>
          </div>
          <div>
            <div className="text-3xl font-semibold uppercase">sponsorship</div>
            <div className="">
              <div className="flex gap-5 mt-2.5">
                <img className="w-36 h-10" src="/imgs/engagement/sponsor-01.webp" alt="" />
                <img className="w-33" src="/imgs/engagement/sponsor-02.webp" alt="" />
              </div>
              <div className="flex gap-5 items-center mt-2.5">
                <img className="w-45 h-9" src="/imgs/engagement/sponsor-03.webp" alt="" />
                <img className="w-16.5" src="/imgs/engagement/sponsor-04.webp" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(Engagement);
