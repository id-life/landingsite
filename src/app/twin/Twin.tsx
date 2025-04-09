import { currentPageAtom } from '@/atoms';
import { currentModelAtom, currentModelTypeAtom, PredictionModel } from '@/atoms/twin';
import { eventBus } from '@/components/event-bus/eventBus';
import { MessageType } from '@/components/event-bus/messageType';
import { NAV_LIST } from '@/components/nav/nav';
import { ModelType } from '@/components/twin/model/type';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useAtom, useSetAtom } from 'jotai';
import { memo, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

function Twin() {
  const isResetDemo = useRef(false);
  const { ref, inView } = useInView({ threshold: 0 });

  const [currentPage, setCurrentPage] = useAtom(currentPageAtom);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const setCurrentModel = useSetAtom(currentModelAtom);
  const setCurrentModelType = useSetAtom(currentModelTypeAtom);

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
    tl.to(imageContainerRef.current, { height: '100svh' });
    tl.to('#twin-three-wrapper', { opacity: 1, duration: 1, ease: 'power3.out' });
    tl.to('#twin-three-wrapper', { opacity: 0, duration: 1, delay: 0.6 });
  }, []);

  useEffect(() => {
    if (inView) {
      isResetDemo.current = true;
      return;
    }
    if (!inView && isResetDemo.current) {
      const list = gsap.utils.toArray('.twin-title-item');
      gsap.to(list, { left: '-80rem' });
      gsap.to('.twin-title', { opacity: 1 });
      gsap.to('#ytb-demo', { opacity: 1 });
      gsap.to('#switch-skin', { bottom: '15rem' });
      setCurrentModel(PredictionModel.M0);
      setCurrentModelType(ModelType.Skin);
      eventBus.next({ type: MessageType.SWITCH_MODEL, payload: { type: ModelType.Skin, model: PredictionModel.M0 } });
      isResetDemo.current = false;
    }
  }, [inView]);

  return (
    <div id={NAV_LIST[3].id} ref={ref} className="page-container twin">
      <div ref={imageContainerRef} className="absolute left-0 top-0 h-0 overflow-hidden">
        <img className="relative right-0 top-0 h-screen w-screen" src="/svgs/twin-bg.svg" alt="" />
      </div>
      <div className="twin-title-wrapper relative h-screen">
        <div className="twin-title absolute left-10 top-40 w-screen">
          <img className="w-[964px] xl:w-[1084px] 2xl:w-[1205px]" src="/svgs/twin/title-page.svg" alt="" />
        </div>
        <div className="twin-title absolute bottom-20 right-[7.5rem] text-right text-base font-medium">
          <p>- High-Precision Digital Twin Model Creation</p>
          <p>- Predictive Models</p>
          <p>- Long-Term Health Tracking & Personalized Guidance</p>
          <p>- Progressive Digital Twin Refinement & Optimization</p>
          <p>高精度数字孪生/AI预测克隆体/健康跟踪与个性化指导/持续升级和优化</p>
        </div>
        <div className="twin-title-item twin-title-M0 absolute left-[-80rem] top-64">
          <img className="w-[325px] xl:w-[363px] 2xl:w-[403px]" src="/svgs/twin/title-ontology.svg" alt="" />
        </div>
        <div className="twin-title-item twin-title-M0 absolute bottom-32 left-[-80rem] max-w-[31.25rem]">
          <p className="text-xl/6 font-semibold">Appearance & Biomarkers 外形采集&健康数据</p>
          <p className="mt-5 text-base font-medium">
            Precision Digital Clones: Generated from Biomarkers & Environmental Contexts.
          </p>
          <p className="mt-2 text-base font-medium">根据个人生物指标创建本体 & 根据时间、环境和习惯生成克隆</p>
        </div>
        <div className="twin-title-item twin-title-M1 absolute left-[-80rem] top-64">
          <img className="w-[512px] xl:w-[576px] 2xl:w-[640px]" src="/svgs/twin/title-clone-01.svg" alt="" />
        </div>
        <div className="twin-title-item twin-title-M2 absolute left-[-80rem] top-64">
          <img className="w-[455px] xl:w-[512px] 2xl:w-[569px]" src="/svgs/twin/title-clone-02.svg" alt="" />
        </div>
        <div className="twin-title-item twin-title-M3 absolute left-[-80rem] top-64">
          <img className="w-[720px] xl:w-[810px] 2xl:w-[900px]" src="/svgs/twin/title-clone-03.svg" alt="" />
        </div>
      </div>
    </div>
  );
}

export default memo(Twin);
