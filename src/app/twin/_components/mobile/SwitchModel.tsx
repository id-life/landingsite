import { currentModelAtom, currentModelTypeAtom, PredictionModel } from '@/atoms/twin';
import { useAtom, useAtomValue } from 'jotai';
import SelectBorderSVG from '@/../public/svgs/twin/select-border.svg?component';
import clsx from 'clsx';
import { gsap } from 'gsap';

export default function SwitchModel() {
  const [currentModel, setCurrentModel] = useAtom(currentModelAtom);
  const currentModelType = useAtomValue(currentModelTypeAtom);

  const handleSwitchModel = (model: PredictionModel | null) => {
    const list = gsap.utils.toArray('.twin-title-item');
    gsap.to('.twin-title', { opacity: 0 });
    gsap.to(list, { left: '-80rem' });
    gsap.to(`.twin-title-${model}`, { left: '1.25rem', delay: 0.5 });
    setCurrentModel(model);
    if (model !== PredictionModel.M0) {
      gsap.to('.twin-tag', { left: '-80rem' });
      gsap.to('.twin-tag', { left: '0rem', delay: 0.5 });
    } else {
      gsap.to('.twin-tag', { left: '-80rem', delay: 0.5 });
    }
    gsap.to('#switch-model', { top: '50%', y: '-50%' });
    gsap.to('#switch-skin', { top: '50%', y: '-50%' });
  };

  return (
    <div id="switch-model" className="absolute left-5 top-[34rem] z-20 grid w-20 gap-3">
      <div className="relative cursor-pointer p-1 w-10" onClick={() => handleSwitchModel(PredictionModel.M0)}>
        <SelectBorderSVG
          className={clsx(
            'absolute left-0 top-0 h-auto w-full',
            currentModel === PredictionModel.M0 ? 'stroke-red-600' : 'stroke-black',
          )}
        />
        <img src="/imgs/twin/avatar-model0.png" alt="" />
      </div>
      <img src="/svgs/twin/avatar-divider.svg" alt="" />
      <div className="grid gap-2 border-2 border-black p-1 w-10">
        <div
          className={clsx('relative cursor-pointer', currentModel === PredictionModel.M1 ? 'bg-[#D7BAC4]' : 'bg-[#B0B6C1]')}
          onClick={() => handleSwitchModel(PredictionModel.M1)}
        >
          <img src="/imgs/twin/avatar-model1.png" alt="" />
          {currentModel === PredictionModel.M1 && <div className="absolute bottom-0 h-[3px] w-full bg-red-600" />}
        </div>
        <div
          className={clsx('relative cursor-pointer', currentModel === PredictionModel.M2 ? 'bg-[#D7BAC4]' : 'bg-[#B0B6C1]')}
          onClick={() => handleSwitchModel(PredictionModel.M2)}
        >
          <img src="/imgs/twin/avatar-model2.png" alt="" />
          {currentModel === PredictionModel.M2 && <div className="absolute bottom-0 h-[3px] w-full bg-red-600" />}
        </div>
        <div
          className={clsx('relative cursor-pointer', currentModel === PredictionModel.M3 ? 'bg-[#D7BAC4]' : 'bg-[#B0B6C1]')}
          onClick={() => handleSwitchModel(PredictionModel.M3)}
        >
          <img src="/imgs/twin/avatar-model3.png" alt="" />
          {currentModel === PredictionModel.M3 && <div className="absolute bottom-0 h-[3px] w-full bg-red-600" />}
        </div>
      </div>
    </div>
  );
}
