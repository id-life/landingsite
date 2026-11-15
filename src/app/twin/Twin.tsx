import { currentPageAtom } from '@/atoms';
import { TWIN_FEATURES, TWIN_FEATURES_CN, TWIN_ONTOLOGY } from '@/content/twin';
import { currentModelAtom, currentModelTypeAtom, PredictionModel } from '@/atoms/twin';
import { eventBus } from '@/components/event-bus/eventBus';
import { MessageType } from '@/components/event-bus/messageType';
import { NAV_LIST } from '@/components/nav/nav';
import { ModelType } from '@/components/twin/model/type';
import { isLayoutRefreshing } from '@/motion/sectionController';
import { beats, EASE } from '@/motion/tokens';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useSetAtom } from 'jotai';
import { memo, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

const PAGE_ID = 'twin_page';
const twinNavItem = NAV_LIST.find((item) => item.id === PAGE_ID)!;

function Twin() {
  const isResetDemo = useRef(false);
  const { ref, inView } = useInView({ threshold: 0 });

  const setCurrentPage = useSetAtom(currentPageAtom);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const setCurrentModel = useSetAtom(currentModelAtom);
  const setCurrentModelType = useSetAtom(currentModelTypeAtom);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        id: 'twin-scroll-trigger',
        trigger: `#${PAGE_ID}`,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: true,
        onEnter: () => {
          if (isLayoutRefreshing()) return;
          setCurrentPage(twinNavItem);
          gsap.set('#twin-three-wrapper', { visibility: 'visible', zIndex: 10 });
        },
        onEnterBack: () => {
          if (isLayoutRefreshing()) return;
          setCurrentPage(twinNavItem);
          gsap.set('#twin-three-wrapper', { visibility: 'visible', zIndex: 10 });
        },
        onLeaveBack: () => {
          if (isLayoutRefreshing()) return;
          gsap.set('#twin-three-wrapper', { visibility: 'hidden', zIndex: 0 });
        },
        onLeave: () => {
          if (isLayoutRefreshing()) return;
          gsap.set('#twin-three-wrapper', { visibility: 'hidden', zIndex: 0 });
        },
      },
    });
    // tl.add(() => {
    //   setEnableUpJudge(true);
    // });
    tl.to(imageContainerRef.current, { height: '100svh', duration: beats(0.5) });
    tl.to('#twin-three-wrapper', { opacity: 1, duration: beats(1), ease: EASE.out });
    tl.to('#twin-three-wrapper', { opacity: 0, duration: beats(1) }, 'twin-show');
    // Every arrival lands where the model is fully shown (MOT-01).
    tl.addLabel('rest', 'twin-show');
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
  }, [inView, setCurrentModel, setCurrentModelType]);

  return (
    <div id={PAGE_ID} ref={ref} className="page-container twin">
      <div ref={imageContainerRef} className="absolute left-0 top-0 h-0 overflow-hidden">
        <img className="relative right-0 top-0 h-screen w-screen" src="/svgs/twin-bg.svg" alt="" />
      </div>
      <div className="twin-title-wrapper relative h-screen">
        <div className="twin-title absolute left-10 top-40 w-screen">
          <img className="w-[964px] xl:w-[1084px] 2xl:w-[1205px]" src="/svgs/twin/title-page.svg" alt="" />
        </div>
        <div className="twin-title absolute bottom-20 right-[64px] text-right text-base font-medium">
          {TWIN_FEATURES.map((feature) => (
            <p key={feature}>- {feature}</p>
          ))}
          <p>{TWIN_FEATURES_CN}</p>
        </div>
        <div className="twin-title-item twin-title-M0 absolute left-[-80rem] top-64">
          <img className="w-[325px] xl:w-[363px] 2xl:w-[403px]" src="/svgs/twin/title-ontology.svg" alt="" />
        </div>
        <div className="twin-title-item twin-title-M0 absolute bottom-32 left-[-80rem] max-w-[31.25rem]">
          <p className="text-xl/6 font-semibold">{TWIN_ONTOLOGY.title}</p>
          <p className="mt-5 text-base font-medium">{TWIN_ONTOLOGY.en}</p>
          <p className="mt-2 text-base font-medium">{TWIN_ONTOLOGY.cn}</p>
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
