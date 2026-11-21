import { eventBus } from '@/components/event-bus/eventBus';
import { MessageType } from '@/components/event-bus/messageType';
import { ModelType } from '@/components/twin/model/type';
import SkinSVG from '@/../public/svgs/twin/skin.svg?component';
import AnatomySVG from '@/../public/svgs/twin/anatomy.svg?component';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  chosenModel,
  markTwinPressed,
  currentModelAtom,
  currentModelTypeAtom,
  mobileBorderAnimationStateAtom,
  modelLoadingItemAtom,
  PredictionModel,
} from '@/atoms/twin';
import { jotaiStore } from '@/atoms/store';
import { registerInnerPage } from '@/motion/innerPages';
import clsx from 'clsx';
import { gsap } from 'gsap';
import { motion, useAnimation } from 'motion/react';
import { useEffect, useRef } from 'react';
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

  const handleModelTypeChange = (type: ModelType) => pressType(type, true);
  // A press, or the same press put back from the history entry (NAV-02), which is not counted as a press.
  const pressType = (type: ModelType, counted: boolean) => {
    const label = type === ModelType.Skin ? 'skin' : 'anatomy';
    if (counted) trackTwin('skin', label, currentModel);
    markTwinPressed();
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

  // Anatomy is the Twin's second inner page (NAV-02): put back once the model before it is on stage (its load done).
  const pressTypeRef = useRef(pressType);
  useEffect(() => {
    pressTypeRef.current = pressType;
  });
  useEffect(
    () =>
      registerInnerPage(
        'twin_page',
        'type',
        () => (jotaiStore.get(currentModelTypeAtom) === ModelType.Anatomy ? 'anatomy' : undefined),
        (value) => {
          if (value !== 'anatomy') return true;
          if (jotaiStore.get(currentModelTypeAtom) === ModelType.Anatomy) return true;
          // Ready when the stage holds the chosen model (on the laptop a model chosen in anatomy is applied once its camera
          // rests). Not the load-timing flag (modelLoadingItemAtom): it is cleared only when a load suspends the stage, so
          // after a press that needed no load it stays set, and waiting on it lost the restore.
          if (!phone && jotaiStore.get(currentModelAtom) !== chosenModel()) return false;
          pressTypeRef.current(ModelType.Anatomy, false);
          return true;
        },
        1,
        (onChange) => jotaiStore.sub(currentModelAtom, onChange),
      ),
    [phone],
  );

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
        // Desktop: the original's place; GSAP moves it (bottom) when a model is shown.
        phone ? 'right-5 top-1/2 -translate-y-1/2' : 'bottom-60 right-[64px]',
      )}
    >
      <motion.div
        className={phone ? 'grid grid-rows-2 gap-3' : 'grid grid-cols-2 gap-10'}
        initial={{ scale: 1 }}
        animate={borderControls}
      >
        {/* Buttons (ENG-03), named for screen readers only; grid items, so they draw as the divs did. */}
        <button
          type="button"
          aria-label="Skin"
          aria-pressed={currentModelType === ModelType.Skin}
          className="relative cursor-pointer tap-area"
          onClick={() => handleModelTypeChange(ModelType.Skin)}
        >
          <SkinSVG aria-hidden className={iconClass(ModelType.Skin)} />
        </button>
        <button
          type="button"
          aria-label="Anatomy"
          aria-pressed={currentModelType === ModelType.Anatomy}
          className="relative cursor-pointer tap-area"
          onClick={() => handleModelTypeChange(ModelType.Anatomy)}
        >
          <AnatomySVG aria-hidden className={iconClass(ModelType.Anatomy)} />
        </button>
      </motion.div>
    </div>
  );
}
