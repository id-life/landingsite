import { eventBus } from '@/components/event-bus/eventBus';
import { MessageType } from '@/components/event-bus/messageType';
import { ModelType } from '@/components/twin/model/type';
import SkinSVG from '@/../public/svgs/twin/skin.svg?component';
import AnatomySVG from '@/../public/svgs/twin/anatomy.svg?component';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  chosenModel,
  currentModelAtom,
  currentModelTypeAtom,
  mobileBorderAnimationStateAtom,
  modelLoadingItemAtom,
  PredictionModel,
} from '@/atoms/twin';
import clsx from 'clsx';
import { gsap } from 'gsap';
import { motion, useAnimation } from 'motion/react';
import { useEffect } from 'react';
import { trackTwin, twinModelId } from '@/lib/analytics/twin';
import { u } from '@/utils/layout-unit';
import { showTwinDemo, stopTwinTitleMoves, twinOffstage, type TwinDeck } from '@/app/twin/twin-deck';

// Phone deck: the pair of icons breathes with the model picker's border (mobileBorderAnimationStateAtom).
const BORDER_ANIMATION_CONFIG = { scaleDuration: 1.5, scaleValue: 1.1 };

/**
 * Skin / anatomy switch, one component for both decks (RWD-02; it was SwitchSkin and its mobile twin). By deck:
 * - desktop: two 42 px icons side by side at the bottom right; switching moves the titles out (GSAP) and asks the 3D
 *   stage for the other model (SWITCH_MODEL), timing the load (modelLoadingItemAtom);
 * - phone: two 28 px icons stacked at the right edge, scaling with the model picker's border; switching sets the model
 *   type, which picks the clip or still.
 * RWD-06: each icon is hit within 44 x 44 px on coarse pointers (tap-area); the icons keep their size and spacing.
 */
export default function SwitchSkin({ deck }: { deck: TwinDeck }) {
  const phone = deck === 'phone';
  const [currentModelType, setCurrentModelType] = useAtom(currentModelTypeAtom);
  const currentModel = useAtomValue(currentModelAtom);
  const setModelLoadingItem = useSetAtom(modelLoadingItemAtom);
  const borderAnimationState = useAtomValue(mobileBorderAnimationStateAtom);
  const borderControls = useAnimation();

  useEffect(() => {
    if (!phone || borderAnimationState === 'idle') return;
    void borderControls.start({
      scale: borderAnimationState === 'scale-up' ? BORDER_ANIMATION_CONFIG.scaleValue : 1,
      transition: { duration: BORDER_ANIMATION_CONFIG.scaleDuration },
    });
  }, [phone, borderAnimationState, borderControls]);

  const handleModelTypeChange = (type: ModelType) => {
    const label = type === ModelType.Skin ? 'skin' : 'anatomy';
    trackTwin('skin', label, currentModel);
    if (phone) {
      setCurrentModelType(type);
      return;
    }
    // The avatar chosen last, which the stage may not have applied yet (chosenModel).
    const model = chosenModel();
    setModelLoadingItem({ view: label, model: twinModelId(model) ?? '', at: performance.now() });
    if (model === PredictionModel.M0) {
      stopTwinTitleMoves();
      // The other avatars' titles out too: an ORG press in anatomy moves them out only after a delay, which this press
      // has just stopped, so a clone's title stayed beside ORG's.
      gsap.to('.twin-title-item:not(.twin-title-M0)', { left: twinOffstage() });
      gsap.to('.twin-title', { opacity: 0, overwrite: 'auto' });
      showTwinDemo('desktop', false);
      gsap.to('#switch-skin', { bottom: u(8), overwrite: 'auto' });
      gsap.to('.twin-title-M0', { left: u(5), delay: 0.3 });
    }
    eventBus.next({ type: MessageType.SWITCH_MODEL, payload: { type, model } });
  };

  const iconClass = (type: ModelType) =>
    clsx(
      phone ? 'w-7' : 'h-[42px] w-[42px] animate-scale',
      currentModelType === type ? 'fill-accent stroke-accent' : 'fill-black stroke-black',
    );
  return (
    <div
      id="switch-skin"
      className={clsx(
        'absolute z-20 grid gap-5',
        // Desktop: never closer to the bottom than 190 px, so the feature list under it (its text is the 1440 px size there) does
        // not reach it on tablets. GSAP moves it (bottom) when a model is shown.
        phone ? 'right-5 top-1/2 -translate-y-1/2' : 'bottom-[max(15rem,190px)] right-[64px] large:bottom-60',
      )}
    >
      <motion.div
        className={phone ? 'grid grid-rows-2 gap-3' : 'grid grid-cols-2 gap-10'}
        initial={{ scale: 1 }}
        animate={borderControls}
      >
        <div className="relative cursor-pointer tap-area" onClick={() => handleModelTypeChange(ModelType.Skin)}>
          <SkinSVG className={iconClass(ModelType.Skin)} />
        </div>
        <div className="relative cursor-pointer tap-area" onClick={() => handleModelTypeChange(ModelType.Anatomy)}>
          <AnatomySVG className={iconClass(ModelType.Anatomy)} />
        </div>
      </motion.div>
    </div>
  );
}
