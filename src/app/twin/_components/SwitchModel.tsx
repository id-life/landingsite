import {
  AnatomyCamera,
  currentAnatomyCameraAtom,
  currentModelAtom,
  currentModelTypeAtom,
  mobileBorderAnimationStateAtom,
  modelLoadingItemAtom,
  PredictionModel,
} from '@/atoms/twin';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import SelectSVG from '@/../public/svgs/twin/select.svg?component';
import clsx from 'clsx';
import { MessageType } from '@/components/event-bus/messageType';
import { eventBus } from '@/components/event-bus/eventBus';
import { ModelType } from '@/components/twin/model/type';
import { gsap } from 'gsap';
import { cn } from '@/utils';
import { motion, useAnimation } from 'motion/react';
import { useCallback } from 'react';
import { currentPageAtom, mobileCurrentPageAtom } from '@/atoms';
import { useStaggerAnimation } from '@/hooks/useStaggerAnimation';
import { trackTwin, twinModelId } from '@/lib/analytics/twin';
import { reportError } from '@/lib/report';
import { DURATION, EASE } from '@/motion/tokens';
import { u } from '@/utils/layout-unit';
import { twinOffstage, type TwinDeck } from '@/app/twin/twin-deck';

// The avatars' attention cycle: each scales up and down in turn (useStaggerAnimation; never with reduced motion).
const ANIMATION_CONFIG = { interval: 4000, staggerDelay: 400, scaleDuration: 0.5, scaleValue: 1.1 };
// The frames' cycle, on its own clock.
const BORDER_ANIMATION_CONFIG = { interval: 4000, scaleDuration: 2.2, scaleValue: 1.1 };

/** The camera each prediction model's anatomy view starts from (phone stills). */
const ANATOMY_START: Record<PredictionModel, AnatomyCamera> = {
  [PredictionModel.M0]: AnatomyCamera.CAMERA0,
  [PredictionModel.M1]: AnatomyCamera.CAMERA0,
  [PredictionModel.M2]: AnatomyCamera.CAMERA7,
  [PredictionModel.M3]: AnatomyCamera.CAMERA10,
};

const CLONES = [
  { model: PredictionModel.M1, img: '/imgs/twin/avatar-model1.png', code: 'C01' },
  { model: PredictionModel.M2, img: '/imgs/twin/avatar-model2.png', code: 'C02' },
  { model: PredictionModel.M3, img: '/imgs/twin/avatar-model3.png', code: 'C03' },
] as const;

/**
 * The model picker (the original avatar and the three predicted clones), one component for both decks (RWD-02; it was
 * SwitchModel and its mobile twin). Shared: the avatars, the selection marks, the attention cycles. By deck:
 * - desktop: 56 px avatars at the top right with a code (ORG, C01..C03) on hover; choosing a model moves the titles
 *   (GSAP, layout units) and switches the 3D stage (SWITCH_CAMERA / SWITCH_MODEL);
 * - phone: 32 px avatars at the left; choosing a model also sets the anatomy camera for the stills, moves the tags,
 *   and drives the skin switch's breathing (mobileBorderAnimationStateAtom).
 * RWD-06: the desktop avatars are 56 px boxes; the phone's 32 px tiles get a 44 px hit area on coarse pointers
 * (tap-area) rather than a 44 px box, which would stretch the coloured tiles out of their portrait shape.
 */
export default function SwitchModel({ deck }: { deck: TwinDeck }) {
  const phone = deck === 'phone';
  const [currentModel, setCurrentModel] = useAtom(currentModelAtom);
  const currentModelType = useAtomValue(currentModelTypeAtom);
  const setModelLoadingItem = useSetAtom(modelLoadingItemAtom);
  const setCurrentAnatomyCamera = useSetAtom(currentAnatomyCameraAtom);
  const setBorderAnimationState = useSetAtom(mobileBorderAnimationStateAtom);
  const desktopPage = useAtomValue(currentPageAtom);
  const phonePage = useAtomValue(mobileCurrentPageAtom);
  const onTwin = (phone ? phonePage : desktopPage).id === 'twin_page';
  const avatar1Controls = useAnimation();
  const avatar2Controls = useAnimation();
  const avatar3Controls = useAnimation();
  const containerControls = useAnimation();
  const borderControls = useAnimation();
  const cornerBorderControls = useAnimation();
  const avatarControls = [avatar1Controls, avatar2Controls, avatar3Controls];

  const runStaggeredAnimation = useCallback(() => {
    const controls = [avatar1Controls, avatar2Controls, avatar3Controls];
    containerControls.start({ scale: 1.03, transition: { duration: ANIMATION_CONFIG.scaleDuration * 0.8, ease: EASE.out } });
    // The desktop avatars also open a 4 px gap while scaled.
    const margin = (px: number) => (phone ? {} : { marginBottom: px, marginTop: px });
    controls.forEach((control, i) => {
      setTimeout(async () => {
        try {
          await control.start({
            scale: ANIMATION_CONFIG.scaleValue,
            ...margin(4),
            transition: { duration: ANIMATION_CONFIG.scaleDuration, ease: EASE.out },
          });
          await control.start({
            scale: 1,
            ...margin(0),
            transition: { duration: ANIMATION_CONFIG.scaleDuration, ease: EASE.out },
          });
        } catch (error) {
          reportError(error, { area: 'animation', step: 'twin_avatar' });
        }
      }, i * ANIMATION_CONFIG.staggerDelay);
    });
    const total = (controls.length - 1) * ANIMATION_CONFIG.staggerDelay + ANIMATION_CONFIG.scaleDuration * 2 * 1000;
    setTimeout(() => {
      containerControls.start({ scale: 1, transition: { duration: ANIMATION_CONFIG.scaleDuration, ease: EASE.out } });
    }, total);
  }, [phone, avatar1Controls, avatar2Controls, avatar3Controls, containerControls]);

  const runBorderAnimation = useCallback(async () => {
    const transition = { duration: BORDER_ANIMATION_CONFIG.scaleDuration };
    try {
      if (phone) setBorderAnimationState('scale-up');
      await Promise.all([
        borderControls.start({ scale: BORDER_ANIMATION_CONFIG.scaleValue, transition }),
        cornerBorderControls.start({ scaleX: 1.1, scaleY: 1.05, transition }),
      ]);
      if (phone) setBorderAnimationState('scale-down');
      await Promise.all([
        borderControls.start({ scale: 1, transition }),
        cornerBorderControls.start({ scaleX: 1, scaleY: 1, transition }),
      ]);
      if (phone) setBorderAnimationState('idle');
    } catch (error) {
      reportError(error, { area: 'animation', step: 'twin_border' });
    }
  }, [phone, borderControls, cornerBorderControls, setBorderAnimationState]);

  useStaggerAnimation({ enabled: onTwin, interval: BORDER_ANIMATION_CONFIG.interval, onAnimate: runBorderAnimation });
  useStaggerAnimation({ enabled: onTwin, interval: ANIMATION_CONFIG.interval, onAnimate: runStaggeredAnimation });

  const handleSwitchModelDesktop = (model: PredictionModel) => {
    setModelLoadingItem({ view: 'model', model: twinModelId(model) ?? String(model), at: performance.now() });
    gsap.to('.twin-title', { opacity: 0 });
    gsap.to('#ytb-demo', { opacity: 0 });
    gsap.to('#switch-skin', { bottom: u(8) });
    const list = gsap.utils.toArray('.twin-title-item');
    gsap.killTweensOf(list);
    if (currentModelType === ModelType.Skin) {
      gsap.to(list, { left: twinOffstage(), duration: DURATION.moderate }).then(() => {
        gsap.to(`.twin-title-${model}`, { left: u(5), delay: 0.3 });
      });
      setCurrentModel(model);
      eventBus.next({ type: MessageType.SWITCH_CAMERA, payload: { index: AnatomyCamera.CAMERA0 } });
      eventBus.next({ type: MessageType.RESET_ANIMATION });
    }
    if (currentModelType === ModelType.Anatomy) {
      gsap.to(list, { left: twinOffstage(), delay: 0.5, duration: DURATION.moderate }).then(() => {
        gsap.to(`.twin-title-${model}`, { left: u(5), delay: 0.3 });
      });
      eventBus.next({ type: MessageType.SWITCH_MODEL, payload: { type: ModelType.Skin, model } });
    }
  };

  const handleSwitchModelPhone = (model: PredictionModel) => {
    const list = gsap.utils.toArray('.twin-title-item');
    gsap.to('.twin-title', { opacity: 0 });
    gsap.to('#ytb-demo', { opacity: 0, left: '-80rem' });
    gsap.to(list, { left: '-80rem' });
    gsap.to(`.twin-title-${model}`, { left: '1.25rem', delay: 0.5 });
    setCurrentModel(model);
    gsap.to('.twin-tag', { left: '-80rem' });
    if (model !== PredictionModel.M0) gsap.to('.twin-tag', { left: '0rem', delay: 0.5 });
    gsap.to('#switch-model', { top: '50%', y: '-50%' });
    gsap.to('#switch-skin', { top: '50%', y: '-50%' });
    setCurrentAnatomyCamera(ANATOMY_START[model]);
  };

  const handleSwitchModel = (model: PredictionModel) => {
    trackTwin('model', twinModelId(model) ?? String(model));
    if (phone) handleSwitchModelPhone(model);
    else handleSwitchModelDesktop(model);
  };

  const corner = phone
    ? '[--corner-border-size:6px] [--corner-border-width:1.5px]'
    : '[--corner-border-size:8px] [--corner-border-width:2.5px]';
  const select = phone
    ? 'absolute -right-6 bottom-0 top-0 my-auto animate-move-right'
    : 'absolute -right-[32px] bottom-0 top-0 my-auto animate-move-right';
  const codeOverlay =
    'flex-center absolute inset-0 bg-accent/20 font-semibold text-white opacity-0 backdrop-blur-sm transition-all duration-150 hover:opacity-100';
  const original = currentModel === PredictionModel.M0;

  return (
    <div
      id="switch-model"
      className={clsx(
        'absolute z-20 grid',
        // Desktop: the original's 12.5 units, or below the header where that is taller (--site-header-h).
        phone
          ? // A phone in landscape: on the right, beside the skin switch, clear of the headline.
            'left-5 top-[25rem] w-20 gap-3 shortScreen:left-auto shortScreen:right-20 shortScreen:top-[60%] shortScreen:-translate-y-1/2'
          : 'right-[64px] top-[max(12.5rem,calc(var(--site-header-h,7.5rem)_+_1rem))] gap-5',
      )}
    >
      <motion.div
        className={clsx('relative cursor-pointer', phone ? 'w-10 p-1 tap-area' : 'flex-center p-2')}
        onClick={() => handleSwitchModel(PredictionModel.M0)}
      >
        <motion.div
          initial={{ scale: 1 }}
          animate={borderControls}
          className={cn('corner-button absolute inset-0 -z-10 [--corner-border-color:#000]', corner, {
            'before:border-accent after:border-accent': original,
          })}
        >
          <span className={cn('absolute inset-0 -z-10', { 'before:!border-accent after:!border-accent': original })}></span>
        </motion.div>
        {original && <SelectSVG className={select} />}
        {phone ? (
          <img src="/imgs/twin/avatar-model0.png" alt="" />
        ) : (
          <div className="relative size-[56px]">
            <img src="/imgs/twin/avatar-model0.png" className="size-full object-contain" alt="" />
            <div className={cn(codeOverlay, 'size-[56px]')}>ORG</div>
          </div>
        )}
      </motion.div>
      <img className={phone ? undefined : 'mx-auto'} src="/svgs/twin/avatar-divider.svg" alt="" />
      <motion.div
        className={phone ? 'relative grid w-10 gap-2.5 p-1' : 'group relative flex flex-col gap-2 p-2.5'}
        initial={{ scale: 1 }}
        animate={containerControls}
        layout
      >
        <motion.div
          initial={{ scaleX: 1, scaleY: 1 }}
          animate={cornerBorderControls}
          className={cn('corner-button absolute inset-0 -z-10 [--corner-border-color:#000]', corner, {
            'before:border-accent after:border-accent': !original,
          })}
        >
          <span className={cn('absolute inset-0 -z-10', { 'before:!border-accent after:!border-accent': !original })}></span>
        </motion.div>
        {CLONES.map(({ model, img, code }, i) => (
          <motion.div
            key={model}
            className={clsx(
              'relative origin-center cursor-pointer',
              currentModel === model ? 'bg-twin-rose' : 'bg-twin-steel',
              phone && 'tap-area',
            )}
            onClick={() => handleSwitchModel(model)}
            initial={{ scale: 1 }}
            animate={avatarControls[i]}
          >
            <img src={img} alt="" className={phone ? undefined : 'size-[56px] object-contain'} />
            {currentModel === model && <div className="absolute bottom-0 h-[3px] w-full bg-accent" />}
            {!phone && <div className={cn(codeOverlay, 'left-0 top-0')}>{code}</div>}
            {currentModel === model && <SelectSVG className={select} />}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
