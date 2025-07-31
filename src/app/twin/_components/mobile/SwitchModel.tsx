import SelectSVG from '@/../public/svgs/twin/select.svg?component';
import { mobileCurrentPageAtom } from '@/atoms';
import {
  AnatomyCamera,
  mobileBorderAnimationStateAtom,
  currentAnatomyCameraAtom,
  currentModelAtom,
  PredictionModel,
} from '@/atoms/twin';
import { GA_EVENT_LABELS, GA_EVENT_NAMES } from '@/constants/ga';
import { useGA } from '@/hooks/useGA';
import { useStaggerAnimation } from '@/hooks/useStaggerAnimation';
import { cn } from '@/utils';
import clsx from 'clsx';
import { gsap } from 'gsap';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { motion, useAnimation } from 'motion/react';
import { useCallback } from 'react';

// Animation configuration - can be customized
const ANIMATION_CONFIG = {
  interval: 4000, // 5 seconds
  staggerDelay: 400, // delay between each avatar animation (ms) - staggerChildren effect
  scaleDuration: 0.4, // duration of scale animation
  scaleValue: 1.1, // scale multiplier
};

// Border animation configuration - independent 2s cycle
const BORDER_ANIMATION_CONFIG = {
  interval: 4000, // 2 seconds
  scaleDuration: 1.5, // duration of scale animation
};

export default function SwitchModel() {
  const [currentModel, setCurrentModel] = useAtom(currentModelAtom);
  const setCurrentAnatomyCamera = useSetAtom(currentAnatomyCameraAtom);
  const currentPage = useAtomValue(mobileCurrentPageAtom);

  const { trackEvent } = useGA();

  // Animation controls for each avatar
  const avatar1Controls = useAnimation();
  const avatar2Controls = useAnimation();
  const avatar3Controls = useAnimation();
  const containerControls = useAnimation();

  // Border animation controls
  const borderControls = useAnimation();
  const cornerButtonControls = useAnimation();
  const setBorderAnimationState = useSetAtom(mobileBorderAnimationStateAtom);

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
            transition: {
              duration: ANIMATION_CONFIG.scaleDuration,
              ease: 'easeOut',
            },
          });

          // Scale down avatar
          await control.start({
            scale: 1,
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

  // Independent border animation cycle (2s interval)
  const runBorderAnimation = useCallback(async () => {
    try {
      // Set state to scale-up and start animations simultaneously
      setBorderAnimationState('scale-up');

      await Promise.all([
        borderControls.start({
          scale: 1.1,
          transition: {
            duration: BORDER_ANIMATION_CONFIG.scaleDuration,
          },
        }),
        cornerButtonControls.start({
          scaleX: 1.1,
          scaleY: 1.05,
          transition: {
            duration: BORDER_ANIMATION_CONFIG.scaleDuration,
          },
        }),
      ]);

      // Set state to scale-down and start animations simultaneously
      setBorderAnimationState('scale-down');

      await Promise.all([
        borderControls.start({
          scale: 1,
          transition: {
            duration: BORDER_ANIMATION_CONFIG.scaleDuration,
          },
        }),
        cornerButtonControls.start({
          scaleX: 1,
          scaleY: 1,
          transition: {
            duration: BORDER_ANIMATION_CONFIG.scaleDuration,
          },
        }),
      ]);

      // Reset to idle
      setBorderAnimationState('idle');
    } catch (error) {
      console.warn('Border animation error:', error);
    }
  }, [borderControls, cornerButtonControls, setBorderAnimationState]);

  // Use stagger animation for border animation cycle
  useStaggerAnimation({
    enabled: currentPage.id === 'twin_page',
    interval: BORDER_ANIMATION_CONFIG.interval,
    onAnimate: runBorderAnimation,
  });

  // Use custom hook for avatar animation management
  useStaggerAnimation({
    enabled: currentPage.id === 'twin_page',
    interval: ANIMATION_CONFIG.interval,
    onAnimate: runStaggeredAnimation,
  });

  const handleSwitchModel = (model: PredictionModel | null) => {
    if (model) {
      trackEvent({
        name: GA_EVENT_NAMES.TWIN_SWITCH,
        label: GA_EVENT_LABELS.TWIN_SWITCH[model],
      });
    }

    const list = gsap.utils.toArray('.twin-title-item');
    gsap.to('.twin-title', { opacity: 0 });
    gsap.to('#ytb-demo', { opacity: 0, left: '-80rem' });

    gsap.to(list, { left: '-80rem' });
    gsap.to(`.twin-title-${model}`, { left: '1.25rem', delay: 0.5 });
    setCurrentModel(model);
    if (model !== PredictionModel.M0) {
      gsap.to('.twin-tag', { left: '-80rem' });
      gsap.to('.twin-tag', { left: '0rem', delay: 0.5 });
    } else {
      gsap.to('.twin-tag', { left: '-80rem', delay: 0.5 });
    }
    gsap.to('#switch-model', { top: '50%', y: '-50%' });
    gsap.to('#switch-skin', { top: '50%', y: '-50%' });

    switch (model) {
      case PredictionModel.M0:
        setCurrentAnatomyCamera(AnatomyCamera.CAMERA0);
        break;
      case PredictionModel.M1:
        setCurrentAnatomyCamera(AnatomyCamera.CAMERA0);
        break;
      case PredictionModel.M2:
        setCurrentAnatomyCamera(AnatomyCamera.CAMERA7);
        break;
      case PredictionModel.M3:
        setCurrentAnatomyCamera(AnatomyCamera.CAMERA10);
        break;
    }
  };

  return (
    <div id="switch-model" className="absolute left-5 top-[25rem] z-20 grid w-20 gap-3">
      <div className="relative w-10 cursor-pointer p-1" onClick={() => handleSwitchModel(PredictionModel.M0)}>
        <motion.div
          initial={{ scale: 1 }}
          animate={borderControls}
          className={cn(
            'corner-button absolute inset-0 -z-10 [--corner-border-color:#000] [--corner-border-size:6px] [--corner-border-width:1.5px]',
            {
              'before:border-red-600 after:border-red-600': currentModel === PredictionModel.M0,
            },
          )}
        >
          <span
            className={cn('absolute inset-0 -z-10', {
              'before:!border-red-600 after:!border-red-600': currentModel === PredictionModel.M0,
            })}
          ></span>
        </motion.div>
        {currentModel === PredictionModel.M0 && (
          <SelectSVG className="absolute -right-6 bottom-0 top-0 my-auto animate-move-right" />
        )}
        <img src="/imgs/twin/avatar-model0.png" alt="" />
      </div>
      <img src="/svgs/twin/avatar-divider.svg" alt="" />
      <motion.div className="relative grid w-10 gap-2.5 p-1" initial={{ scale: 1 }} animate={containerControls} layout>
        <motion.div
          initial={{ scaleX: 1, scaleY: 1 }}
          animate={cornerButtonControls}
          className={cn(
            'corner-button absolute inset-0 -z-10 [--corner-border-color:#000] [--corner-border-size:6px] [--corner-border-width:1.5px]',
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
        </motion.div>
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
          {currentModel === PredictionModel.M1 && (
            <SelectSVG className="absolute -right-6 bottom-0 top-0 my-auto animate-move-right" />
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
          {currentModel === PredictionModel.M2 && (
            <SelectSVG className="absolute -right-6 bottom-0 top-0 my-auto animate-move-right" />
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
          {currentModel === PredictionModel.M3 && (
            <SelectSVG className="absolute -right-6 bottom-0 top-0 my-auto animate-move-right" />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
