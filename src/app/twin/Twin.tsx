import { currentPageAtom, mobileCurrentPageAtom } from '@/atoms';
import { TWIN_FEATURES, TWIN_FEATURES_CN, TWIN_ONTOLOGY } from '@/content/twin';
import {
  chooseTwinModel,
  currentModelAtom,
  currentModelTypeAtom,
  newTwinChoice,
  PredictionModel,
  twinWasPressed,
} from '@/atoms/twin';
import { eventBus } from '@/components/event-bus/eventBus';
import { MessageType } from '@/components/event-bus/messageType';
import { NAV_LIST } from '@/components/nav/nav';
import { ModelType } from '@/components/twin/model/type';
import { useSectionNear } from '@/hooks/useDeferredAssets';
import { isLayoutRefreshing } from '@/motion/sectionController';
import { beats, EASE } from '@/motion/tokens';
import { cn } from '@/utils';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useAtom, useSetAtom } from 'jotai';
import { memo, useCallback, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import Description from './_components/Description';
import { Model } from './_components/Model';
import SwitchAnatomyCamera from './_components/SwitchAnatomyCamera';
import SwitchModel from './_components/SwitchModel';
import SwitchSkin from './_components/SwitchSkin';
import YTBDemo from './_components/YTBDemo';
import { showTwinOpening, TWIN_AVATAR, TWIN_OFFSTAGE_CLASS, twinModelRestTop, type TwinAvatar } from './twin-deck';

const PAGE_ID = 'twin_page';
const PAGE_INDEX = NAV_LIST.findIndex((item) => item.id === PAGE_ID);
const twinNavItem = NAV_LIST[PAGE_INDEX];

/**
 * The headline is an image; it is the section's h2 (as Portfolio and Spectrum have theirs; the route's h1 is in the
 * server summary), named by the image's alt text: the words the image shows, once per deck.
 */
const HEADLINE_ALT = 'Digital Twin: Biomarker Visualization';

/**
 * Desktop deck: a pinned page whose scrubbed timeline reveals the 3D stage (#twin-three-wrapper, the twin canvas and
 * its controls, mounted once by the deck shell outside the scrolled content because ScrollSmoother's transform would
 * break position: fixed inside it). The page holds the headline, the feature list and the clone titles.
 *
 * Placement: the original's classes and layout units at every laptop window (the deck scales as the original does);
 * the headline, titles and picker start no higher than just below the header (its published height, --site-header-h),
 * and hidden titles wait fully off stage.
 */
function DesktopTwin() {
  const isResetDemo = useRef(false);
  const { ref, inView } = useInView({ threshold: 0 });
  const setCurrentPage = useSetAtom(currentPageAtom);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const setCurrentModel = useSetAtom(currentModelAtom);
  const setCurrentModelType = useSetAtom(currentModelTypeAtom);

  useGSAP(() => {
    const show = () => gsap.set('#twin-three-wrapper', { visibility: 'visible', zIndex: 10 });
    const hide = () => gsap.set('#twin-three-wrapper', { visibility: 'hidden', zIndex: 0 });
    const tl = gsap.timeline({
      scrollTrigger: {
        id: 'twin-scroll-trigger',
        trigger: `#${PAGE_ID}`,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: true,
        onEnter: () => {
          if (isLayoutRefreshing()) return;
          setCurrentPage(twinNavItem);
          show();
        },
        onEnterBack: () => {
          if (isLayoutRefreshing()) return;
          setCurrentPage(twinNavItem);
          show();
        },
        onLeaveBack: () => {
          if (isLayoutRefreshing()) return;
          hide();
        },
        onLeave: () => {
          if (isLayoutRefreshing()) return;
          hide();
        },
      },
    });
    tl.to(imageContainerRef.current, { height: '100svh', duration: beats(0.5) });
    tl.to('#twin-three-wrapper', { opacity: 1, duration: beats(1), ease: EASE.out });
    tl.to('#twin-three-wrapper', { opacity: 0, duration: beats(1) }, 'twin-show');
    // Every arrival lands where the model is fully shown (MOT-01).
    tl.addLabel('rest', 'twin-show');
  }, []);

  // Leaving the section puts the demo back: the headline, the original avatar, its skin.
  useEffect(() => {
    if (inView) {
      isResetDemo.current = true;
      return;
    }
    if (isResetDemo.current) {
      showTwinOpening('desktop');
      chooseTwinModel(PredictionModel.M0);
      setCurrentModel(PredictionModel.M0);
      setCurrentModelType(ModelType.Skin);
      eventBus.next({ type: MessageType.SWITCH_MODEL, payload: { type: ModelType.Skin, model: PredictionModel.M0 } });
      isResetDemo.current = false;
    }
  }, [inView, setCurrentModel, setCurrentModelType]);

  const titleItem = cn('twin-title-item absolute', TWIN_OFFSTAGE_CLASS);
  // Clone and ontology titles: below the header on medium windows, where they were placed in layout units.
  const titleTop = 'top-[max(16rem,calc(var(--site-header-h,7.5rem)_+_1rem))]';
  return (
    <div id={PAGE_ID} ref={ref} className="page-container twin">
      <div ref={imageContainerRef} className="absolute left-0 top-0 h-0 overflow-hidden">
        <img className="relative right-0 top-0 h-screen w-screen" src="/svgs/twin-bg.svg" alt="" />
      </div>
      <div className="twin-title-wrapper relative h-screen">
        <h2 className="twin-title absolute left-10 top-[max(10rem,calc(var(--site-header-h,7.5rem)_+_1rem))] w-screen">
          <img className="w-[964px] xl:w-[1084px] 2xl:w-[1205px]" src="/svgs/twin/title-page.svg" alt={HEADLINE_ALT} />
        </h2>
        {/* A list of features: list markup, at the original's size. The Chinese line is the same list. */}
        <div className="twin-title absolute bottom-[calc(var(--t)*5)] right-[64px] text-right text-base font-medium">
          <ul>
            {TWIN_FEATURES.map((feature) => (
              <li key={feature}>- {feature}</li>
            ))}
          </ul>
          <p lang="zh-CN" className="zh-run">
            {TWIN_FEATURES_CN}
          </p>
        </div>
        <div className={cn(titleItem, 'twin-title-M0', titleTop)}>
          <img className="w-[325px] xl:w-[363px] 2xl:w-[403px]" src="/svgs/twin/title-ontology.svg" alt="" />
        </div>
        <div className={cn(titleItem, 'twin-title-M0 bottom-32 max-w-[31.25rem]')}>
          <p className="text-xl/6 font-semibold">{TWIN_ONTOLOGY.title}</p>
          <p className="mt-5 text-base font-medium">{TWIN_ONTOLOGY.en}</p>
          <p className="mt-2 text-base font-medium">{TWIN_ONTOLOGY.cn}</p>
        </div>
        <div className={cn(titleItem, 'twin-title-M1', titleTop)}>
          <img className="w-[512px] xl:w-[576px] 2xl:w-[640px]" src="/svgs/twin/title-clone-01.svg" alt="" />
        </div>
        <div className={cn(titleItem, 'twin-title-M2', titleTop)}>
          <img className="w-[455px] xl:w-[512px] 2xl:w-[569px]" src="/svgs/twin/title-clone-02.svg" alt="" />
        </div>
        <div className={cn(titleItem, 'twin-title-M3', titleTop)}>
          <img className="w-[720px] xl:w-[810px] 2xl:w-[900px]" src="/svgs/twin/title-clone-03.svg" alt="" />
        </div>
      </div>
    </div>
  );
}

/**
 * Phone deck: a full-height panel shown while current. The headline, the DEMO link and the clone titles; with the
 * 'media' avatar (the default) the avatar clips and stills with their controls in a fixed layer. Leaving the panel
 * puts the demo back.
 */
function PhoneTwin({ avatar }: { avatar: TwinAvatar }) {
  const [currentPage] = useAtom(mobileCurrentPageAtom);
  const setCurrentModel = useSetAtom(currentModelAtom);
  const setCurrentModelType = useSetAtom(currentModelTypeAtom);
  // The avatar media (a 20 MB clip on Android, a 430 KB still on iPhone) mounts only once the visitor is on this page
  // or the one before it; the wrapper and the GSAP targets stay mounted.
  const mediaNear = useSectionNear(PAGE_INDEX);
  const resetModel = useCallback(() => {
    newTwinChoice();
    showTwinOpening('phone');
    chooseTwinModel(PredictionModel.M0);
    setCurrentModel(PredictionModel.M0);
    setCurrentModelType(ModelType.Skin);
  }, [setCurrentModel, setCurrentModelType]);

  useEffect(() => {
    if (currentPage.id !== PAGE_ID) resetModel();
  }, [currentPage, resetModel]);

  // The model column's resting place reads DEMO's and its own height (twinModelRestTop), which a hidden panel does not
  // have: placed again once the panel is shown, and on every resize or turn while nothing has been pressed, so a load
  // and a turn give the same layout.
  useEffect(() => {
    if (currentPage.id !== PAGE_ID) return;
    const place = () => {
      if (!twinWasPressed()) gsap.set('#switch-model', { top: twinModelRestTop(), y: '-50%' });
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [currentPage]);

  const titleItem = 'twin-title-item absolute left-[-80rem] top-20';
  return (
    <div id={PAGE_ID} className={cn('page-container-mobile', { hidden: currentPage.id !== PAGE_ID })}>
      <div className="absolute left-0 top-0 h-0 overflow-hidden">
        <img className="relative right-0 top-0 h-screen w-screen" src="/svgs/twin-bg.svg" alt="" />
      </div>

      <div className="twin-title-wrapper relative h-[31.25rem]">
        <YTBDemo deck="phone" />
        <h2 className="twin-title absolute left-5 top-20 w-screen">
          {/* His lettering at its size; only in windows narrower than 355 px (his 20 px offset plus its 335 px), where his
              headline is cut at the right edge, no wider than the window less both 20 px margins. From 355 px up it is his
              to the pixel. */}
          <img
            src="/svgs/twin/mobile/title-page.svg"
            alt={HEADLINE_ALT}
            className="w-[20.9375rem] [@media(max-width:354.98px)]:max-w-[calc(100vw_-_2.5rem)]"
          />
        </h2>
        <div className={cn(titleItem, 'twin-title-M0')}>
          <img src="/svgs/twin/title-ontology.svg" alt="" className="h-[7.25rem] w-auto" />
        </div>
        <div className={cn(titleItem, 'twin-title-M1')}>
          <img src="/svgs/twin/title-clone-01.svg" alt="" className="h-[7.25rem] w-auto" />
        </div>
        <div className={cn(titleItem, 'twin-title-M2')}>
          <img src="/svgs/twin/title-clone-02.svg" alt="" className="h-[7.25rem] w-auto" />
        </div>
        <div className={cn(titleItem, 'twin-title-M3')}>
          <img src="/svgs/twin/title-clone-03.svg" alt="" className="h-[7.25rem] w-auto" />
        </div>
      </div>

      {avatar === 'media' && (
        <div className="twin-wrapper fixed left-0 top-0 z-0 h-screen w-screen">
          <SwitchModel deck="phone" />
          <SwitchSkin deck="phone" />
          <Description />
          <SwitchAnatomyCamera deck="phone" />
          {mediaNear && <Model active={currentPage.id === PAGE_ID} />}
        </div>
      )}
    </div>
  );
}

type TwinProps =
  /** The scrolled deck always shows the 3D avatar (the canvas stage the shell mounts). */
  | { deck: 'desktop' }
  /** The phone deck shows the avatar media by default; 'canvas' leaves the avatar to a canvas stage (RWD-10). */
  | { deck: 'phone'; avatar?: TwinAvatar };

/**
 * Digital Twin, one component for both decks (RWD-02; it was Twin and MobileTwin). The controls (SwitchModel,
 * SwitchSkin, SwitchAnatomyCamera, YTBDemo, the reports) are one component each taking `deck`; what differs by deck is
 * how the section enters (scrubbed pinned page vs paged panel) and how the avatar is shown (`avatar`, default
 * TWIN_AVATAR: the 3D canvas on the desktop deck, clips and stills on the phone deck, as before).
 */
function Twin(props: TwinProps) {
  if (props.deck === 'desktop') return <DesktopTwin />;
  return <PhoneTwin avatar={props.avatar ?? TWIN_AVATAR.phone} />;
}

export default memo(Twin);
