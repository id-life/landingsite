import { eventBus } from '@/components/event-bus/eventBus';
import { MessageType } from '@/components/event-bus/messageType';
import { ModelType } from '@/components/twin/model/type';
import SkinSVG from '@/../public/svgs/twin/skin.svg?component';
import AnatomySVG from '@/../public/svgs/twin/anatomy.svg?component';
import { useAtomValue } from 'jotai';
import { currentModelAtom, currentModelTypeAtom } from '@/atoms/twin';
import clsx from 'clsx';

export default function SwitchSkin() {
  const currentModelType = useAtomValue(currentModelTypeAtom);
  const currentModel = useAtomValue(currentModelAtom);

  const handleModelTypeChange = (type: ModelType) => {
    eventBus.next({ type: MessageType.SWITCH_MODEL, payload: { type, model: currentModel } });
  };

  return (
    <div id="switch-skin" className="absolute bottom-60 right-32 z-20 grid gap-5">
      <div className="grid grid-cols-2 gap-10">
        <div className="cursor-pointer" onClick={() => handleModelTypeChange(ModelType.Skin)}>
          <SkinSVG className={clsx(currentModelType === ModelType.Skin ? 'stroke-red-600 fill-red-600' : 'stroke-black fill-black')} />
        </div>
        <div className="cursor-pointer" onClick={() => handleModelTypeChange(ModelType.Anatomy)}>
          <AnatomySVG className={clsx(currentModelType === ModelType.Anatomy ? 'stroke-red-600 fill-red-600' : 'stroke-black fill-black')}  />
        </div>
      </div>
    </div>
  );
}
