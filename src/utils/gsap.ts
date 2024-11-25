import gsap from 'gsap';

interface Config {
  repeat?: number;
  paused?: boolean;
  speed?: number;
  snap?: boolean | number;
  paddingRight?: number;
  reversed?: boolean;
}

export function horizontalLoop(items: HTMLElement[] | NodeList | SVGSVGElement[], config: Config = {}): GSAPTimeline {
  const elements = gsap.utils.toArray(items) as HTMLElement[];
  const { repeat, paused, speed = 1, snap = 1, paddingRight = 0, reversed } = config;

  const tl = gsap.timeline({
    repeat,
    paused,
    defaults: { ease: 'none' },
    onReverseComplete: () => {
      tl.totalTime(tl.rawTime() + tl.duration() * 100).pause();
    },
  });

  const length = elements.length;
  const startX = elements[0].offsetLeft;
  const times: number[] = [];
  const widths: number[] = [];
  const xPercents: number[] = [];
  let curIndex = 0;
  const pixelsPerSecond = speed * 100;
  const snapFunc = snap === false ? (v: number) => v : gsap.utils.snap(snap as number);

  gsap.set(elements, {
    xPercent: (i: number, el: HTMLElement) => {
      const width = (widths[i] = parseFloat(gsap.getProperty(el, 'width', 'px') as string));
      xPercents[i] = snapFunc(
        (parseFloat(gsap.getProperty(el, 'x', 'px').toString()) / width) * 100 +
          parseFloat(gsap.getProperty(el, 'xPercent').toString()), // 确保转换为字符串
      );
      return xPercents[i];
    },
  });

  gsap.set(elements, { x: 0 });

  const totalWidth =
    elements[length - 1].offsetLeft +
    (xPercents[length - 1] / 100) * widths[length - 1] -
    startX +
    (elements[length - 1].offsetWidth as number) * (gsap.getProperty(elements[length - 1], 'scaleX') as number) +
    paddingRight;

  elements.forEach((item, i) => {
    const curX = (xPercents[i] / 100) * widths[i];
    const distanceToStart = item.offsetLeft + curX - startX;
    const distanceToLoop = distanceToStart + widths[i] * (gsap.getProperty(item, 'scaleX') as number);

    tl.to(
      item,
      {
        xPercent: snapFunc(((curX - distanceToLoop) / widths[i]) * 100),
        duration: distanceToLoop / pixelsPerSecond,
      },
      0,
    )
      .fromTo(
        item,
        {
          xPercent: snapFunc(((curX - distanceToLoop + totalWidth) / widths[i]) * 100),
        },
        {
          xPercent: xPercents[i],
          duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
          immediateRender: false,
        },
        distanceToLoop / pixelsPerSecond,
      )
      .add(`label${i}`, distanceToStart / pixelsPerSecond);

    times[i] = distanceToStart / pixelsPerSecond;
  });

  function toIndex(index: number, vars: gsap.TweenVars = {}) {
    if (Math.abs(index - curIndex) > length / 2) {
      index += index > curIndex ? -length : length;
    }
    const newIndex = gsap.utils.wrap(0, length, index);
    let time = times[newIndex];
    if (time > tl.time() !== index > curIndex) {
      vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
      time += tl.duration() * (index > curIndex ? 1 : -1);
    }
    curIndex = newIndex;
    vars.overwrite = true;
    return tl.tweenTo(time, vars);
  }

  tl.next = (vars?: gsap.TweenVars) => toIndex(curIndex + 1, vars);
  tl.previous = (vars?: gsap.TweenVars) => toIndex(curIndex - 1, vars);
  tl.current = () => curIndex;
  tl.toIndex = (index: number, vars?: gsap.TweenVars) => toIndex(index, vars);
  tl.times = times;
  tl.progress(1, true).progress(0, true);

  if (reversed) {
    if (tl.vars.onReverseComplete) {
      tl.vars.onReverseComplete();
    }
    tl.reverse();
  }

  return tl;
}
