import { mobileCurrentPageAtom } from '@/atoms';
import { NAV_LIST } from '@/components/nav/nav';
import { cn } from '@/utils';
import { useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import SwitchModel from './_components/mobile/SwitchModel';
import SwitchSkin from './_components/mobile/SwitchSkin';
import Description from './_components/mobile/Description';
import { currentModelAtom, currentModelTypeAtom, PredictionModel } from '@/atoms/twin';
import { gsap } from 'gsap';
import { Model } from './_components/mobile/Model';
import SwitchAnatomyCamera from './_components/mobile/SwitchAnatomyCamera';
import { ModelType } from '@/components/twin/model/type';
import YTBDemo from './_components/mobile/YTBDemo';

export default function MobileTwin() {
  const [currentPage, setCurrentPage] = useAtom(mobileCurrentPageAtom);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [, setCurrentModel] = useAtom(currentModelAtom);
  const [, setCurrentModelType] = useAtom(currentModelTypeAtom);
  useEffect(() => {
    if (currentPage !== NAV_LIST[3]) {
      resetModel();
    }
  }, [currentPage]);

  const resetModel = () => {
    const list = gsap.utils.toArray('.twin-title-item');
    gsap.to(list, { left: '-80rem' });
    gsap.to('.twin-title', { opacity: 1 });
    gsap.to('#ytb-demo', { opacity: 1, left: '1.25rem' });
    gsap.to('#switch-model', { top: '32rem', y: '-50%' });
    gsap.to('#switch-skin', { top: '30rem', y: '-50%' });
    gsap.to('#switch-anatomy-camera', { bottom: '11rem' });
    setCurrentModel(PredictionModel.M0);
    setCurrentModelType(ModelType.Skin);
  };

  return (
    <div
      id={NAV_LIST[3].id}
      className={cn('page-container-mobile', {
        hidden: currentPage.id !== NAV_LIST[3].id,
      })}
    >
      <div ref={imageContainerRef} className="absolute left-0 top-0 h-0 overflow-hidden">
        <img className="relative right-0 top-0 h-screen w-screen" src="/svgs/twin-bg.svg" alt="" />
      </div>

      <div className="twin-title-wrapper relative h-[500px]">
        <YTBDemo />
        <div className="twin-title absolute left-5 top-20 w-screen">
          <img src="/svgs/twin/mobile/title-page.svg" alt="" />
        </div>
        <div className="twin-title-item twin-title-M0 absolute left-[-80rem] top-20">
          <img src="/svgs/twin/title-ontology.svg" alt="" className="h-[116px] w-auto" />
        </div>
        <div className="twin-title-item twin-title-M1 absolute left-[-80rem] top-20">
          <img src="/svgs/twin/title-clone-01.svg" alt="" className="h-[116px] w-auto" />
        </div>
        <div className="twin-title-item twin-title-M2 absolute left-[-80rem] top-20">
          <img src="/svgs/twin/title-clone-02.svg" alt="" className="h-[116px] w-auto" />
        </div>
        <div className="twin-title-item twin-title-M3 absolute left-[-80rem] top-20">
          <img src="/svgs/twin/title-clone-03.svg" alt="" className="h-[116px] w-auto" />
        </div>
      </div>

      <div className="twin-wrapper fixed left-0 top-0 z-0 h-screen w-screen">
        <SwitchModel />
        <SwitchSkin />
        <Description />
        <SwitchAnatomyCamera />
        <Model />
      </div>
    </div>
  );
}
