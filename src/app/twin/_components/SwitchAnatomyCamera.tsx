import { useAtom, useAtomValue } from 'jotai';
import {
    AnatomyCamera,
  currentAnatomyM0Atom,
  currentAnatomyM1Atom,
  currentAnatomyM2Atom,
  currentAnatomyM3Atom,
  currentModelAtom,
  currentModelTypeAtom,
  PredictionModel,
} from '@/atoms/twin';
import AnatomyM01 from '@/../public/svgs/twin/anatomy-m0-1.svg?component';
import AnatomyM02 from '@/../public/svgs/twin/anatomy-m0-2.svg?component';
import AnatomyM03 from '@/../public/svgs/twin/anatomy-m0-3.svg?component';
import AnatomyM04 from '@/../public/svgs/twin/anatomy-m0-4.svg?component';
import AnatomyM05 from '@/../public/svgs/twin/anatomy-m0-5.svg?component';
import clsx from 'clsx';
import { ModelType } from '@/components/twin/model/type';
import { MessageType } from '@/components/event-bus/messageType';
import { eventBus } from '@/components/event-bus/eventBus';

export default function SwitchAnatomyCamera() {
  const currentModel = useAtomValue(currentModelAtom);
  const currentModelType = useAtomValue(currentModelTypeAtom);
  const [currentAnatomyM0, setCurrentAnatomyM0] = useAtom(currentAnatomyM0Atom);
  const [currentAnatomyM1, setCurrentAnatomyM1] = useAtom(currentAnatomyM1Atom);
  const [currentAnatomyM2, setCurrentAnatomyM2] = useAtom(currentAnatomyM2Atom);
  const [currentAnatomyM3, setCurrentAnatomyM3] = useAtom(currentAnatomyM3Atom);

  const handleSwitchAnatomyM0 = (index: AnatomyCamera) => {
    setCurrentAnatomyM0(index);
    eventBus.next({ type: MessageType.SWITCH_ANATOMY_CAMERA, payload: { index } });
  };

  return (
    <div id="switch-anatomy-camera" className="absolute bottom-32 left-1/2 z-20 -translate-x-1/2 opacity-0">
      {currentModelType === ModelType.Anatomy && (
        <div className="flex gap-7 bg-white/10 p-3 backdrop-blur">
          {currentModel === PredictionModel.M0 && (
            <>
              <AnatomyM01
                onClick={() => handleSwitchAnatomyM0(AnatomyCamera.CAMERA0)}
                className={clsx('cursor-pointer', currentAnatomyM0 === AnatomyCamera.CAMERA0 ? 'fill-red-600' : 'fill-black')}
              />
              <AnatomyM02
                onClick={() => handleSwitchAnatomyM0(AnatomyCamera.CAMERA1)}
                className={clsx('cursor-pointer', currentAnatomyM0 === AnatomyCamera.CAMERA1 ? 'fill-red-600' : 'fill-black')}
              />
              <AnatomyM03
                onClick={() => handleSwitchAnatomyM0(AnatomyCamera.CAMERA2)}
                className={clsx('cursor-pointer', currentAnatomyM0 === AnatomyCamera.CAMERA2 ? 'fill-red-600' : 'fill-black')}
              />
              <AnatomyM04
                onClick={() => handleSwitchAnatomyM0(AnatomyCamera.CAMERA3)}
                className={clsx('cursor-pointer', currentAnatomyM0 === AnatomyCamera.CAMERA3 ? 'fill-red-600' : 'fill-black')}
              />
              <AnatomyM05
                onClick={() => handleSwitchAnatomyM0(AnatomyCamera.CAMERA4)}
                className={clsx('cursor-pointer', currentAnatomyM0 === AnatomyCamera.CAMERA4 ? 'fill-red-600' : 'fill-black')}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
