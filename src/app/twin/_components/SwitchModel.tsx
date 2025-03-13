import { currentModelAtom, PredictionModel } from '@/atoms/twin';
import { useAtom, useSetAtom } from 'jotai';
import SelectBorderSVG from '@/../public/svgs/twin/select-border.svg?component';
import SelectSVG from '@/../public/svgs/twin/select.svg?component';
import clsx from 'clsx';

export default function SwitchModel() {
  const [currentModel, setCurrentModel] = useAtom(currentModelAtom);

  const handleSwitchModel = (model: PredictionModel | null) => {
    setCurrentModel(model);
  };

  return (
    <div id="switch-model" className="absolute right-32 top-50 z-20 grid gap-5 opacity-0">
      <div className="relative cursor-pointer p-1" onClick={() => handleSwitchModel(PredictionModel.M0)}>
        <SelectBorderSVG
          className={clsx(
            'absolute left-0 top-0 w-full',
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
