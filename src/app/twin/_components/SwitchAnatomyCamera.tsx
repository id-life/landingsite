import clsx from 'clsx';
import { useAtom, useAtomValue } from 'jotai';
import type { ComponentType, SVGProps } from 'react';
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
import { trackTwin } from '@/lib/analytics/twin';
import type { TwinDeck } from '@/app/twin/twin-deck';

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

/** The anatomy views each prediction model offers (M3 has none: its anatomy view is one camera). */
const VIEWS: Partial<Record<PredictionModel, [Icon, AnatomyCamera][]>> = {
  [PredictionModel.M0]: [
    [AnatomyM01, AnatomyCamera.CAMERA0],
    [AnatomyM02, AnatomyCamera.CAMERA1],
    [AnatomyM03, AnatomyCamera.CAMERA2],
    [AnatomyM04, AnatomyCamera.CAMERA3],
    [AnatomyM05, AnatomyCamera.CAMERA4],
  ],
  [PredictionModel.M1]: [
    [AnatomyM11, AnatomyCamera.CAMERA0],
    [AnatomyM12, AnatomyCamera.CAMERA5],
    [AnatomyM13, AnatomyCamera.CAMERA6],
  ],
  [PredictionModel.M2]: [
    [AnatomyM21, AnatomyCamera.CAMERA7],
    [AnatomyM22, AnatomyCamera.CAMERA8],
    [AnatomyM23, AnatomyCamera.CAMERA9],
  ],
};

/**
 * The anatomy camera picker, one component for both decks (RWD-02; it was SwitchAnatomyCamera and its mobile twin).
 * By deck: 32 px icons above the bottom edge (desktop) or 24 px icons higher up (phone). The desktop deck's 3D views
 * also move the camera (SWITCH_CAMERA); the phone's stills follow currentAnatomyCameraAtom. RWD-06: every icon has a
 * 44x44 box on coarse pointers.
 */
export default function SwitchAnatomyCamera({ deck }: { deck: TwinDeck }) {
  const phone = deck === 'phone';
  const currentModel = useAtomValue(currentModelAtom);
  const currentModelType = useAtomValue(currentModelTypeAtom);
  const [currentAnatomyCamera, setCurrentAnatomyCamera] = useAtom(currentAnatomyCameraAtom);
  const handleSwitchAnatomyCamera = (index: AnatomyCamera) => {
    trackTwin('anatomy_camera', String(index), currentModel);
    setCurrentAnatomyCamera(index);
    eventBus.next({ type: MessageType.SWITCH_ANATOMY_MODULE, payload: { index } });
    eventBus.next({ type: MessageType.SWITCH_CAMERA, payload: { index } });
  };
  const views = currentModel ? VIEWS[currentModel] : undefined;

  return (
    <div
      id="switch-anatomy-camera"
      className={clsx('absolute left-1/2 z-20 -translate-x-1/2', phone ? 'bottom-44' : 'bottom-[max(8rem,96px)]')}
    >
      {currentModelType === ModelType.Anatomy && views && (
        <div className={clsx('flex bg-white/10 backdrop-blur', phone ? 'gap-4 p-2' : 'gap-7 p-3', 'coarse:gap-2')}>
          {views.map(([Icon, camera]) => (
            <span key={camera} className="flex-center cursor-pointer tap" onClick={() => handleSwitchAnatomyCamera(camera)}>
              <Icon
                className={clsx(
                  phone ? 'w-6' : 'h-[32px] w-[32px]',
                  currentAnatomyCamera === camera ? 'fill-accent' : 'fill-black',
                )}
              />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
