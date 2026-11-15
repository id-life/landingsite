import P5 from 'p5';
import { memo, useCallback, useEffect, useRef } from 'react';
import { isMotionPaused, onMotionPause } from '@/motion/runtime';

// Mounts a p5 sketch. It replaces @p5-wrapper/react 4, which bundles React 18's JSX runtime (it reads React
// internals that React 19 removed, so the experience never got past its loader) and its own second copy of p5
// (1.9.4); version 5 needs p5 2. Same contract as the wrapper it replaces: one p5 instance per sketch, mounted in a
// div.react-p5-wrapper, the other props handed to instance.updateWithProps after every render, the instance removed
// on unmount, and no re-render while the props are unchanged.

export type SketchProps = { [key: string]: unknown };
export type P5CanvasInstance<Props extends SketchProps = SketchProps> = P5 & {
  updateWithProps?: (props: Props) => void;
};
export type Sketch<Props extends SketchProps = SketchProps> = (instance: P5CanvasInstance<Props>) => void;

// Props are passed through untyped, as the replaced wrapper did: a sketch declares what it reads in updateWithProps.
type P5CanvasProps = SketchProps & { sketch: Sketch<any> };

function P5CanvasComponent({ sketch, ...props }: P5CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<P5CanvasInstance | null>(null);
  // MOT-03: a sketch loops only while its section has it active, its canvas is on screen, and the experience is not
  // paused (60 s idle, hidden tab). Every sketch draws nothing while inactive and nobody sees one off screen, so
  // stopping the loop changes nothing visible; each used to request a frame about 60 times a second whatever the
  // section (six at once on phones), and the desktop sections never cleared their flag on the way down.
  const active = props.activeAnim === true;
  const loopState = useRef({ active, inView: false });
  const syncLoop = useCallback(() => {
    const instance = instanceRef.current;
    if (!instance) return;
    const { active: isActive, inView } = loopState.current;
    if (isActive && inView && !isMotionPaused()) instance.loop();
    else instance.noLoop();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    instanceRef.current?.remove();
    instanceRef.current = new P5(sketch as (instance: P5) => void, containerRef.current) as P5CanvasInstance;
    syncLoop();
  }, [sketch, syncLoop]);

  useEffect(() => {
    loopState.current.active = active;
    instanceRef.current?.updateWithProps?.(props);
    syncLoop();
  });

  // The sketch moves its canvas into the element named by its id prop; watch that element (or our own div).
  const targetId = typeof props.id === 'string' ? props.id : undefined;
  useEffect(() => {
    const target = (targetId && document.getElementById(targetId)) || containerRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => {
      loopState.current.inView = entry.isIntersecting;
      syncLoop();
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, [targetId, syncLoop]);

  useEffect(() => onMotionPause(syncLoop), [syncLoop]);

  useEffect(
    () => () => {
      instanceRef.current?.remove();
      instanceRef.current = null;
    },
    [],
  );

  return <div ref={containerRef} className="react-p5-wrapper" />;
}

export const P5Canvas = memo(P5CanvasComponent);
