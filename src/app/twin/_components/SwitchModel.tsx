import { AnatomyCamera, currentModelAtom, currentModelTypeAtom, modelLoadingItemAtom, PredictionModel } from '@/atoms/twin';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import SelectBorderSVG from '@/../public/svgs/twin/select-border.svg?component';
import SelectSVG from '@/../public/svgs/twin/select.svg?component';
import clsx from 'clsx';
import { MessageType } from '@/components/event-bus/messageType';
import { eventBus } from '@/components/event-bus/eventBus';
import { ModelType } from '@/components/twin/model/type';
import { gsap } from 'gsap';
import { useGA } from '@/hooks/useGA';
import { GA_EVENT_LABELS, GA_EVENT_NAMES } from '@/constants/ga';
import { cn } from '@/utils';
import { motion, useAnimation } from 'motion/react';
import { useCallback } from 'react';
import { currentPageAtom } from '@/atoms';
import { useStaggerAnimation } from '@/hooks/useStaggerAnimation';

// Animation configuration - can be customized
const ANIMATION_CONFIG = {
  interval: 5000, // 5 seconds
  staggerDelay: 400, // delay between each avatar animation (ms) - staggerChildren effect
  scaleDuration: 0.4, // duration of scale animation
  scaleValue: 1.1, // scale multiplier
};

export default function SwitchModel() {
  const [currentModel, setCurrentModel] = useAtom(currentModelAtom);
  const currentModelType = useAtomValue(currentModelTypeAtom);
  const setModelLoadingItem = useSetAtom(modelLoadingItemAtom);
  const currentPage = useAtomValue(currentPageAtom);

  const { trackEvent } = useGA();

  // Animation controls for each avatar
  const avatar1Controls = useAnimation();
  const avatar2Controls = useAnimation();
  const avatar3Controls = useAnimation();
  const containerControls = useAnimation();

  const runStaggeredAnimation = useCallback(() => {
    const avatarControls = [avatar1Controls, avatar2Controls, avatar3Controls];

    // Animate container expansion at the start
    containerControls.start({
      scale: 1.03,
      transition: {
        duration: ANIMATION_CONFIG.scaleDuration * 0.8,
        ease: 'easeOut',
      },
    });

    // Start all avatar animations with staggered delays
    for (let i = 0; i < avatarControls.length; i++) {
      const control = avatarControls[i];
      setTimeout(async () => {
        try {
          // Scale up avatar
          await control.start({
            scale: ANIMATION_CONFIG.scaleValue,
            marginBottom: 4,
            marginTop: 4,
            transition: {
              duration: ANIMATION_CONFIG.scaleDuration,
              ease: 'easeOut',
            },
          });

          // Scale down avatar
          await control.start({
            scale: 1,
            marginBottom: 0,
            marginTop: 0,
            transition: {
              duration: ANIMATION_CONFIG.scaleDuration,
              ease: 'easeOut',
            },
          });
        } catch (error) {
          console.warn('Avatar animation error:', error);
        }
      }, i * ANIMATION_CONFIG.staggerDelay);
    }

    // Return container to normal size after all animations complete
    const totalAnimationTime =
      (avatarControls.length - 1) * ANIMATION_CONFIG.staggerDelay + ANIMATION_CONFIG.scaleDuration * 2 * 1000;
    setTimeout(() => {
      containerControls.start({
        scale: 1,
        transition: {
          duration: ANIMATION_CONFIG.scaleDuration,
          ease: 'easeOut',
        },
      });
    }, totalAnimationTime);
  }, [avatar1Controls, avatar2Controls, avatar3Controls, containerControls]);

  // Use custom hook for animation management
  useStaggerAnimation({
    enabled: currentPage.id === 'twin_page',
    interval: ANIMATION_CONFIG.interval,
    onAnimate: runStaggeredAnimation,
  });

  const handleSwitchModel = (model: PredictionModel | null): void => {
    if (model) {
      trackEvent({
        name: GA_EVENT_NAMES.TWIN_SWITCH,
        label: GA_EVENT_LABELS.TWIN_SWITCH[model],
      });
      setModelLoadingItem([GA_EVENT_NAMES.TWIN_LOAD_DURATION, GA_EVENT_LABELS.TWIN_SWITCH[model]]);
    }

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
          <SelectSVG className="absolute -right-14.5 bottom-0 top-0 my-auto animate-move-right" />
        )}
        <img src="/imgs/twin/avatar-model0.png" alt="" />
        <div className="flex-center absolute inset-2 left-2 top-2 bg-red-600/20 font-semibold text-white opacity-0 backdrop-blur-sm transition-all duration-150 hover:opacity-100">
          ORG
        </div>
      </div>
      <img className="mx-auto" src="/svgs/twin/avatar-divider.svg" alt="" />
      <motion.div
        className="group relative flex flex-col gap-2 p-2.5"
        initial={{ scale: 1 }}
        animate={containerControls}
        layout
      >
        <div
          className={cn(
            'corner-button absolute inset-0 -z-10 [--corner-border-color:#000] [--corner-border-size:1rem] [--corner-border-width:2px]',
            {
              'before:border-red-600 after:border-red-600': currentModel !== PredictionModel.M0,
            },
          )}
        >
          <span
            className={cn('absolute inset-0 -z-10', {
              'before:!border-red-600 after:!border-red-600': currentModel !== PredictionModel.M0,
            })}
          ></span>
        </div>
        <motion.div
          className={clsx(
            'relative origin-center cursor-pointer',
            currentModel === PredictionModel.M1 ? 'bg-[#D7BAC4]' : 'bg-[#B0B6C1]',
          )}
          onClick={() => handleSwitchModel(PredictionModel.M1)}
          initial={{ scale: 1 }}
          animate={avatar1Controls}
        >
          <img src="/imgs/twin/avatar-model1.png" alt="" />
          {currentModel === PredictionModel.M1 && <div className="absolute bottom-0 h-[3px] w-full bg-red-600" />}
          <div className="flex-center absolute inset-0 left-0 top-0 bg-red-600/20 font-semibold text-white opacity-0 backdrop-blur-sm transition-all duration-150 hover:opacity-100">
            C01
          </div>
          {currentModel === PredictionModel.M1 && (
            <SelectSVG className="absolute -right-14.5 bottom-0 top-0 my-auto animate-move-right" />
          )}
        </motion.div>
        <motion.div
          className={clsx(
            'relative origin-center cursor-pointer',
            currentModel === PredictionModel.M2 ? 'bg-[#D7BAC4]' : 'bg-[#B0B6C1]',
          )}
          onClick={() => handleSwitchModel(PredictionModel.M2)}
          initial={{ scale: 1 }}
          animate={avatar2Controls}
        >
          <img src="/imgs/twin/avatar-model2.png" alt="" />
          {currentModel === PredictionModel.M2 && <div className="absolute bottom-0 h-[3px] w-full bg-red-600" />}
          <div className="flex-center absolute inset-0 left-0 top-0 bg-red-600/20 font-semibold text-white opacity-0 backdrop-blur-sm transition-all duration-150 hover:opacity-100">
            C02
          </div>
          {currentModel === PredictionModel.M2 && (
            <SelectSVG className="absolute -right-14.5 bottom-0 top-0 my-auto animate-move-right" />
          )}
        </motion.div>
        <motion.div
          className={clsx(
            'relative origin-center cursor-pointer',
            currentModel === PredictionModel.M3 ? 'bg-[#D7BAC4]' : 'bg-[#B0B6C1]',
          )}
          onClick={() => handleSwitchModel(PredictionModel.M3)}
          initial={{ scale: 1 }}
          animate={avatar3Controls}
        >
          <img src="/imgs/twin/avatar-model3.png" alt="" />
          {currentModel === PredictionModel.M3 && <div className="absolute bottom-0 h-[3px] w-full bg-red-600" />}
          <div className="flex-center absolute inset-0 left-0 top-0 bg-red-600/20 font-semibold text-white opacity-0 backdrop-blur-sm transition-all duration-150 hover:opacity-100">
            C03
          </div>
          {currentModel === PredictionModel.M3 && (
            <SelectSVG className="absolute -right-14.5 bottom-0 top-0 my-auto animate-move-right" />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
