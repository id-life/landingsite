import { eventBus } from '@/components/event-bus/eventBus';
import { MessageType } from '@/components/event-bus/messageType';
import { ModelType } from '@/components/twin/model/type';
import SkinSVG from '@/../public/svgs/twin/skin.svg?component';
import AnatomySVG from '@/../public/svgs/twin/anatomy.svg?component';
import { useAtomValue } from 'jotai';
import { AnatomyCamera, currentModelAtom, currentModelTypeAtom, PredictionModel } from '@/atoms/twin';
import clsx from 'clsx';
import { gsap } from 'gsap';
import { useGA } from '@/hooks/useGA';
import { GA_EVENT_LABELS, GA_EVENT_NAMES } from '@/constants/ga';

export default function SwitchSkin() {
  const currentModelType = useAtomValue(currentModelTypeAtom);
  const currentModel = useAtomValue(currentModelAtom);

  const { trackEvent } = useGA();

  const handleModelTypeChange = (type: ModelType) => {
    trackEvent({
      name: GA_EVENT_NAMES.MODEL_SWITCH,
      label: type === ModelType.Skin ? GA_EVENT_LABELS.MODEL_SWITCH.SKIN : GA_EVENT_LABELS.MODEL_SWITCH.ANATOMY,
      twin_type: currentModel ? GA_EVENT_LABELS.TWIN_SWITCH[currentModel] : '',
    });

    if (currentModel === PredictionModel.M0) {
      gsap.to('.twin-title', { opacity: 0 });
      gsap.to('#ytb-demo', { opacity: 0 });
      gsap.to('#switch-skin', { bottom: '8rem' });
      gsap.to('.twin-title-M0', { left: '5rem', delay: 0.3 });
    }
    eventBus.next({ type: MessageType.SWITCH_MODEL, payload: { type, model: currentModel } });
  };

  return (
    <div id="switch-skin" className="absolute bottom-60 right-32 z-20 grid gap-5">
      <div className="grid grid-cols-2 gap-10">
        <div className="cursor-pointer" onClick={() => handleModelTypeChange(ModelType.Skin)}>
          <SkinSVG
            className={clsx(
              'h-[42px] w-[42px] animate-scale',
              currentModelType === ModelType.Skin ? 'fill-red-600 stroke-red-600' : 'fill-black stroke-black',
            )}
          />
        </div>
        <div className="cursor-pointer" onClick={() => handleModelTypeChange(ModelType.Anatomy)}>
          <AnatomySVG
            className={clsx(
              'h-[42px] w-[42px] animate-scale',
              currentModelType === ModelType.Anatomy ? 'fill-red-600 stroke-red-600' : 'fill-black stroke-black',
            )}
          />
        </div>
      </div>
    </div>
  );
}
