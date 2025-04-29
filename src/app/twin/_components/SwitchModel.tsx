import { AnatomyCamera, currentModelAtom, currentModelTypeAtom, PredictionModel } from '@/atoms/twin';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import SelectBorderSVG from '@/../public/svgs/twin/select-border.svg?component';
import SelectSVG from '@/../public/svgs/twin/select.svg?component';
import clsx from 'clsx';
import { MessageType } from '@/components/event-bus/messageType';
import { eventBus } from '@/components/event-bus/eventBus';
import { ModelType } from '@/components/twin/model/type';
import { gsap } from 'gsap';

export default function SwitchModel() {
  const [currentModel, setCurrentModel] = useAtom(currentModelAtom);
  const currentModelType = useAtomValue(currentModelTypeAtom);

  const handleSwitchModel = (model: PredictionModel | null) => {
    gsap.to('.twin-title', { opacity: 0 });
    gsap.to('#ytb-demo', { opacity: 0 });
    gsap.to('#switch-skin', { bottom: '8rem' });
    const list = gsap.utils.toArray('.twin-title-item');
    gsap.killTweensOf(list);
    if (currentModelType === ModelType.Skin) {
      gsap.to(list, { left: '-80rem', duration: 0.5 }).then(() => {
        gsap.to(`.twin-title-${model}`, { left: '5rem', delay: 0.3 });
      });
      setCurrentModel(model);
      eventBus.next({ type: MessageType.SWITCH_CAMERA, payload: { index: AnatomyCamera.CAMERA0 } });
      eventBus.next({ type: MessageType.RESET_ANIMATION });
    }
    if (currentModelType === ModelType.Anatomy) {
      gsap.to(list, { left: '-80rem', delay: 0.5, duration: 0.5 }).then(() => {
        gsap.to(`.twin-title-${model}`, { left: '5rem', delay: 0.3 });
      });
      eventBus.next({ type: MessageType.SWITCH_MODEL, payload: { type: ModelType.Skin, model } });
    }
  };

  return (
    <div id="switch-model" className="absolute right-32 top-50 z-20 grid gap-5">
      <div className="relative cursor-pointer p-2" onClick={() => handleSwitchModel(PredictionModel.M0)}>
        <SelectBorderSVG
          className={clsx(
            'absolute left-0 top-0 h-auto w-full animate-scale',
            currentModel === PredictionModel.M0 ? 'stroke-red-600' : 'stroke-black',
          )}
        />
        {currentModel === PredictionModel.M0 && (
          <SelectSVG className="absolute -right-10 bottom-0 top-0 my-auto animate-move-right" />
        )}
        <img src="/imgs/twin/avatar-model0.png" alt="" />
        <div className="flex-center absolute inset-2 left-2 top-2 bg-red-600/20 font-semibold text-white opacity-0 backdrop-blur-sm transition-all duration-150 hover:opacity-100">
          ORG
        </div>
      </div>
      <img className="mx-auto" src="/svgs/twin/avatar-divider.svg" alt="" />
      <div className="relative grid gap-2 p-2">
        <div className="absolute inset-0 animate-pulse-10 border-2 border-black"></div>
        <div
          className={clsx('relative cursor-pointer', currentModel === PredictionModel.M1 ? 'bg-[#D7BAC4]' : 'bg-[#B0B6C1]')}
          onClick={() => handleSwitchModel(PredictionModel.M1)}
        >
          <img src="/imgs/twin/avatar-model1.png" alt="" />
          {currentModel === PredictionModel.M1 && <div className="absolute bottom-0 h-[3px] w-full bg-red-600" />}
          <div className="flex-center absolute inset-0 left-0 top-0 bg-red-600/20 font-semibold text-white opacity-0 backdrop-blur-sm transition-all duration-150 hover:opacity-100">
            C01
          </div>
          {currentModel === PredictionModel.M1 && (
            <SelectSVG className="absolute -right-12 bottom-0 top-0 my-auto animate-move-right" />
          )}
        </div>
        <div
          className={clsx('relative cursor-pointer', currentModel === PredictionModel.M2 ? 'bg-[#D7BAC4]' : 'bg-[#B0B6C1]')}
          onClick={() => handleSwitchModel(PredictionModel.M2)}
        >
          <img src="/imgs/twin/avatar-model2.png" alt="" />
          {currentModel === PredictionModel.M2 && <div className="absolute bottom-0 h-[3px] w-full bg-red-600" />}
          <div className="flex-center absolute inset-0 left-0 top-0 bg-red-600/20 font-semibold text-white opacity-0 backdrop-blur-sm transition-all duration-150 hover:opacity-100">
            C02
          </div>
          {currentModel === PredictionModel.M2 && (
            <SelectSVG className="absolute -right-12 bottom-0 top-0 my-auto animate-move-right" />
          )}
        </div>
        <div
          className={clsx('relative cursor-pointer', currentModel === PredictionModel.M3 ? 'bg-[#D7BAC4]' : 'bg-[#B0B6C1]')}
          onClick={() => handleSwitchModel(PredictionModel.M3)}
        >
          <img src="/imgs/twin/avatar-model3.png" alt="" />
          {currentModel === PredictionModel.M3 && <div className="absolute bottom-0 h-[3px] w-full bg-red-600" />}
          <div className="flex-center absolute inset-0 left-0 top-0 bg-red-600/20 font-semibold text-white opacity-0 backdrop-blur-sm transition-all duration-150 hover:opacity-100">
            C03
          </div>
          {currentModel === PredictionModel.M3 && (
            <SelectSVG className="absolute -right-12 bottom-0 top-0 my-auto animate-move-right" />
          )}
        </div>
      </div>
    </div>
  );
}
