import { currentModelAtom, currentModelTypeAtom, PredictionModel } from '@/atoms/twin';
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
    if (currentModelType !== ModelType.Skin) {
      eventBus.next({ type: MessageType.SWITCH_MODEL, payload: { type: ModelType.Skin, model } });
    }
    const list = gsap.utils.toArray('.twin-title-item');
    gsap.to('.twin-title', { opacity: 0 });
    gsap.to(list, { left: '-80rem' });
    gsap.to(`.twin-title-${model}`, { left: '5rem', delay: 0.5 });
    gsap.to('#switch-skin', { bottom: '8rem' });
    setCurrentModel(model);
  };

  return (
    <div id="switch-model" className="absolute right-32 top-50 z-20 grid gap-5">
      <div className="relative cursor-pointer p-2" onClick={() => handleSwitchModel(PredictionModel.M0)}>
        <SelectBorderSVG
          className={clsx(
            'absolute left-0 top-0 h-auto w-full',
            currentModel === PredictionModel.M0 ? 'stroke-red-600' : 'stroke-black',
          )}
        />
        {currentModel === PredictionModel.M0 && <SelectSVG className="absolute -right-7 top-6" />}
        <img src="/imgs/twin/avatar-model0.png" alt="" />
      </div>
      <img className="mx-auto" src="/svgs/twin/avatar-divider.svg" alt="" />
      <div className="grid gap-2 border-2 border-black p-2">
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
