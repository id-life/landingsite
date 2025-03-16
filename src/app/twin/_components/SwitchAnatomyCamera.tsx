import clsx from 'clsx';
import { useAtom, useAtomValue } from 'jotai';
import { ModelType } from '@/components/twin/model/type';
import { MessageType } from '@/components/event-bus/messageType';
import { eventBus } from '@/components/event-bus/eventBus';
import { AnatomyCamera, currentAnatomyCameraAtom, currentModelAtom, currentModelTypeAtom, PredictionModel } from '@/atoms/twin';
import AnatomyM01 from '@/../public/svgs/twin/anatomy-m0-1.svg?component';
import AnatomyM02 from '@/../public/svgs/twin/anatomy-m0-2.svg?component';
import AnatomyM03 from '@/../public/svgs/twin/anatomy-m0-3.svg?component';
import AnatomyM04 from '@/../public/svgs/twin/anatomy-m0-4.svg?component';
import AnatomyM05 from '@/../public/svgs/twin/anatomy-m0-5.svg?component';
import AnatomyM11 from '@/../public/svgs/twin/anatomy-m1-1.svg?component';
import AnatomyM12 from '@/../public/svgs/twin/anatomy-m1-2.svg?component';
import AnatomyM13 from '@/../public/svgs/twin/anatomy-m1-3.svg?component';
import AnatomyM21 from '@/../public/svgs/twin/anatomy-m2-1.svg?component';
import AnatomyM22 from '@/../public/svgs/twin/anatomy-m2-2.svg?component';
import AnatomyM23 from '@/../public/svgs/twin/anatomy-m2-3.svg?component';
import AnatomyM31 from '@/../public/svgs/twin/anatomy-m3-1.svg?component';

export default function SwitchAnatomyCamera() {
  const currentModel = useAtomValue(currentModelAtom);
  const currentModelType = useAtomValue(currentModelTypeAtom);
  const [currentAnatomyCamera, setCurrentAnatomyCamera] = useAtom(currentAnatomyCameraAtom);

  const handleSwitchAnatomyCamera = (index: AnatomyCamera) => {
    setCurrentAnatomyCamera(index);
    eventBus.next({ type: MessageType.SWITCH_ANATOMY_MODULE, payload: { index } });
    eventBus.next({ type: MessageType.SWITCH_CAMERA, payload: { index } });
  };

  return (
    <div id="switch-anatomy-camera" className="absolute bottom-32 left-1/2 z-20 -translate-x-1/2 opacity-0">
      {currentModelType === ModelType.Anatomy && (
        <div className="flex gap-7 bg-white/10 p-3 backdrop-blur">
          {currentModel === PredictionModel.M0 && (
            <>
              <AnatomyM01
                onClick={() => handleSwitchAnatomyCamera(AnatomyCamera.CAMERA0)}
                className={clsx('cursor-pointer', currentAnatomyCamera === AnatomyCamera.CAMERA0 ? 'fill-red-600' : 'fill-black')}
              />
              <AnatomyM02
                onClick={() => handleSwitchAnatomyCamera(AnatomyCamera.CAMERA1)}
                className={clsx('cursor-pointer', currentAnatomyCamera === AnatomyCamera.CAMERA1 ? 'fill-red-600' : 'fill-black')}
              />
              <AnatomyM03
                onClick={() => handleSwitchAnatomyCamera(AnatomyCamera.CAMERA2)}
                className={clsx('cursor-pointer', currentAnatomyCamera === AnatomyCamera.CAMERA2 ? 'fill-red-600' : 'fill-black')}
              />
              <AnatomyM04
                onClick={() => handleSwitchAnatomyCamera(AnatomyCamera.CAMERA3)}
                className={clsx('cursor-pointer', currentAnatomyCamera === AnatomyCamera.CAMERA3 ? 'fill-red-600' : 'fill-black')}
              />
              <AnatomyM05
                onClick={() => handleSwitchAnatomyCamera(AnatomyCamera.CAMERA4)}
                className={clsx('cursor-pointer', currentAnatomyCamera === AnatomyCamera.CAMERA4 ? 'fill-red-600' : 'fill-black')}
              />
            </>
          )}
          {currentModel === PredictionModel.M1 && (
            <>
              <AnatomyM11
                onClick={() => handleSwitchAnatomyCamera(AnatomyCamera.CAMERA0)}
                className={clsx('cursor-pointer', currentAnatomyCamera === AnatomyCamera.CAMERA0 ? 'fill-red-600' : 'fill-black')}
              />
              <AnatomyM12
                onClick={() => handleSwitchAnatomyCamera(AnatomyCamera.CAMERA5)}
                className={clsx('cursor-pointer', currentAnatomyCamera === AnatomyCamera.CAMERA5 ? 'fill-red-600' : 'fill-black')}
              />
              <AnatomyM13
                onClick={() => handleSwitchAnatomyCamera(AnatomyCamera.CAMERA6)}
                className={clsx('cursor-pointer', currentAnatomyCamera === AnatomyCamera.CAMERA6 ? 'fill-red-600' : 'fill-black')}
              />
            </>
          )}
          {currentModel === PredictionModel.M2 && (
            <>
              <AnatomyM21
                onClick={() => handleSwitchAnatomyCamera(AnatomyCamera.CAMERA7)}
                className={clsx('cursor-pointer', currentAnatomyCamera === AnatomyCamera.CAMERA7 ? 'fill-red-600' : 'fill-black')}
              />
              <AnatomyM22
                onClick={() => handleSwitchAnatomyCamera(AnatomyCamera.CAMERA8)}
                className={clsx('cursor-pointer', currentAnatomyCamera === AnatomyCamera.CAMERA8 ? 'fill-red-600' : 'fill-black')}
              />
              <AnatomyM23
                onClick={() => handleSwitchAnatomyCamera(AnatomyCamera.CAMERA9)}
                className={clsx('cursor-pointer', currentAnatomyCamera === AnatomyCamera.CAMERA9 ? 'fill-red-600' : 'fill-black')}
              />
            </>
          )}
          {currentModel === PredictionModel.M3 && (
            <>
              <AnatomyM31
                onClick={() => handleSwitchAnatomyCamera(AnatomyCamera.CAMERA10)}
                className={clsx('cursor-pointer', currentAnatomyCamera === AnatomyCamera.CAMERA10 ? 'fill-red-600' : 'fill-black')}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
