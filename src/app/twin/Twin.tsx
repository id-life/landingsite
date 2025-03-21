import { currentPageAtom } from '@/atoms';
import { currentModelAtom, PredictionModel } from '@/atoms/twin';
import { NAV_LIST } from '@/components/nav/nav';
import { useScrollTriggerAction } from '@/hooks/anim/useScrollTriggerAction';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useAtom, useSetAtom } from 'jotai';
import { memo, useEffect, useRef } from 'react';

function Twin() {
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const { setEnableJudge: setEnableUpJudge } = useScrollTriggerAction({
    triggerId: 'twin-scroll-trigger',
    scrollFn: () => {
      const smoother = ScrollSmoother.get();
      smoother?.scrollTo(`#map-container`, true, `bottom bottom`);
    },
    isUp: true,
  });
  const setCurrentModel = useSetAtom(currentModelAtom);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        id: 'twin-scroll-trigger',
        trigger: `#${NAV_LIST[3].id}`,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: true,
        onEnter: () => {
          setCurrentPage(NAV_LIST[3]);
          gsap.set('#twin-three-wrapper', { visibility: 'visible', zIndex: 10 });
        },
        onEnterBack: () => {
          setCurrentPage(NAV_LIST[3]);
          gsap.set('#twin-three-wrapper', { visibility: 'visible', zIndex: 10 });
        },
        onLeaveBack: () => {
          gsap.set('#twin-three-wrapper', { visibility: 'hidden', zIndex: 0 });
        },
        onLeave: () => {
          gsap.set('#twin-three-wrapper', { visibility: 'hidden', zIndex: 0 });
        },
      },
    });
    tl.add(() => {
      setEnableUpJudge(true);
    });
    tl.to(imageContainerRef.current, { height: '100svh' });
    tl.to('#twin-three-wrapper', { opacity: 1, duration: 1, ease: 'power3.out' });
    tl.to('#twin-three-wrapper', { opacity: 0, duration: 2, delay: 1 });
  }, []);

  useEffect(() => {
    if (currentPage !== NAV_LIST[3]) {
      resetModel();
    }
  }, [currentPage]);

  const resetModel = () => {
    const list = gsap.utils.toArray('.twin-title-item');
    gsap.to(list, { left: '-80rem' });
    gsap.to('.twin-title', { opacity: 1 });
    gsap.to('#switch-skin', { bottom: '15rem' });
    setCurrentModel(PredictionModel.M0);
  };

  return (
    <div id={NAV_LIST[3].id} className="page-container twin">
      <div ref={imageContainerRef} className="absolute left-0 top-0 h-0 overflow-hidden">
        <img className="relative right-0 top-0 h-screen w-screen" src="/svgs/twin-bg.svg" alt="" />
      </div>
      <div className="twin-title-wrapper relative h-screen">
        <div className="twin-title absolute left-10 top-40 w-screen">
          <img src="/svgs/twin/title-page.svg" alt="" />
        </div>
        <div className="twin-title absolute bottom-20 right-32 text-right text-base font-medium">
          <p>- High-Precision Custom Digital Twin Creation</p>
          <p>- AI Health Prediction Clones</p>
          <p>- Long-Term Health Tracking & Personalized Guidance</p>
          <p>- Continuous Digital Twin Upgrades & Optimization</p>
          <p>高精度数字孪生/AI预测克隆体/健康跟踪与个性化指导/持续升级和优化</p>
        </div>
        <div className="twin-title-item twin-title-M0 absolute left-[-80rem] top-64">
          <img src="/svgs/twin/title-ontology.svg" alt="" />
        </div>
        <div className="twin-title-item twin-title-M0 absolute bottom-32 left-[-80rem] max-w-[31.25rem]">
          <p className="text-xl/6 font-semibold">Appearance & Biomarkers 外形采集&健康数据</p>
          <p className="mt-5 text-base font-medium">
            Create from Personal Biomarkers & Generate Clones Based on Time, Environment, and Habits.
          </p>
          <p className="mt-2 text-base font-medium">根据个人生物指标创建 & 根据时间、环境和习惯生成克隆</p>
        </div>
        <div className="twin-title-item twin-title-M1 absolute left-[-80rem] top-64">
          <img src="/svgs/twin/title-clone-01.svg" alt="" />
        </div>
        <div className="twin-title-item twin-title-M2 absolute left-[-80rem] top-64">
          <img src="/svgs/twin/title-clone-02.svg" alt="" />
        </div>
        <div className="twin-title-item twin-title-M3 absolute left-[-80rem] top-64">
          <img src="/svgs/twin/title-clone-03.svg" alt="" />
        </div>
      </div>
    </div>
  );
}

export default memo(Twin);
