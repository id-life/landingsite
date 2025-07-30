import AnatomySVG from '@/../public/svgs/twin/anatomy.svg?component';
import SkinSVG from '@/../public/svgs/twin/skin.svg?component';
import { mobileBorderAnimationStateAtom, currentModelAtom, currentModelTypeAtom } from '@/atoms/twin';
import { ModelType } from '@/components/twin/model/type';
import { GA_EVENT_LABELS, GA_EVENT_NAMES } from '@/constants/ga';
import { useGA } from '@/hooks/useGA';
import clsx from 'clsx';
import { useAtom, useAtomValue } from 'jotai';
import { motion, useAnimation } from 'motion/react';
import { useEffect } from 'react';

// Border animation configuration - matches SwitchModel
const BORDER_ANIMATION_CONFIG = {
  interval: 4000, // 2 seconds
  scaleDuration: 1.5, // duration of scale animation
  scaleValue: 1.1, // scale multiplier
};

export default function SwitchSkin() {
  const [currentModelType, setCurrentModelType] = useAtom(currentModelTypeAtom);
  const currentModel = useAtomValue(currentModelAtom);
  const borderAnimationState = useAtomValue(mobileBorderAnimationStateAtom);

  const { trackEvent } = useGA();

  // Border animation controls
  const borderControls = useAnimation();
  const selectBorderControls = useAnimation();

  // Border animation effect synchronized with SwitchModel
  useEffect(() => {
    if (borderAnimationState === 'scale-up') {
      // Scale up borders simultaneously with SwitchModel
      Promise.all([
        borderControls.start({
          scale: BORDER_ANIMATION_CONFIG.scaleValue,
          transition: {
            duration: BORDER_ANIMATION_CONFIG.scaleDuration,
          },
        }),
        selectBorderControls.start({
          scale: BORDER_ANIMATION_CONFIG.scaleValue,
          transition: {
            duration: BORDER_ANIMATION_CONFIG.scaleDuration,
          },
        }),
      ]);
    } else if (borderAnimationState === 'scale-down') {
      // Scale down borders simultaneously with SwitchModel
      Promise.all([
        borderControls.start({
          scale: 1,
          transition: {
            duration: BORDER_ANIMATION_CONFIG.scaleDuration,
          },
        }),
        selectBorderControls.start({
          scale: 1,
          transition: {
            duration: BORDER_ANIMATION_CONFIG.scaleDuration,
          },
        }),
      ]);
    }
  }, [borderAnimationState, borderControls, selectBorderControls]);

  const handleModelTypeChange = (type: ModelType) => {
    trackEvent({
      name: GA_EVENT_NAMES.MODEL_SWITCH,
      label: type === ModelType.Skin ? GA_EVENT_LABELS.MODEL_SWITCH.SKIN : GA_EVENT_LABELS.MODEL_SWITCH.ANATOMY,
      twin_type: currentModel ? GA_EVENT_LABELS.TWIN_SWITCH[currentModel] : '',
    });
    setCurrentModelType(type);
  };

  return (
    <div id="switch-skin" className="absolute right-5 top-1/2 z-20 grid -translate-y-1/2 gap-5">
      <motion.div className="grid grid-rows-2 gap-3" initial={{ scale: 1 }} animate={borderControls}>
        <div className="cursor-pointer" onClick={() => handleModelTypeChange(ModelType.Skin)}>
          <SkinSVG
            className={clsx(
              'w-7',
              currentModelType === ModelType.Skin ? 'fill-red-600 stroke-red-600' : 'fill-black stroke-black',
            )}
          />
        </div>
        <div className="cursor-pointer" onClick={() => handleModelTypeChange(ModelType.Anatomy)}>
          <AnatomySVG
            className={clsx(
              'w-7',
              currentModelType === ModelType.Anatomy ? 'fill-red-600 stroke-red-600' : 'fill-black stroke-black',
            )}
          />
        </div>
      </motion.div>
    </div>
  );
}
