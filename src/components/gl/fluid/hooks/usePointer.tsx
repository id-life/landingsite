import { ThreeEvent, useThree } from '@react-three/fiber';
import { useCallback, useRef, useEffect } from 'react';
import { Vector2 } from 'three';

type SplatStack = {
  mouseX?: number;
  mouseY?: number;
  velocityX?: number;
  velocityY?: number;
};

export const usePointer = ({ force }: { force: number }) => {
  const size = useThree((three) => three.size);

  const splatStack: SplatStack[] = useRef([]).current;

  const lastMouse = useRef<Vector2>(new Vector2());
  const hasMoved = useRef<boolean>(false);

  const onPointerMove = useCallback(
    (event: PointerEvent) => {
      const deltaX = event.clientX - lastMouse.current.x;
      const deltaY = event.clientY - lastMouse.current.y;

      if (!hasMoved.current) {
        hasMoved.current = true;
        lastMouse.current.set(event.clientX, event.clientY);
      }

      lastMouse.current.set(event.clientX, event.clientY);

      if (!hasMoved.current) return;

      splatStack.push({
        mouseX: event.clientX / size.width,
        mouseY: 1.0 - event.clientY / size.height,
        velocityX: deltaX * force,
        velocityY: -deltaY * force,
      });
    },
    [force, size.height, size.width, splatStack],
  );

  useEffect(() => {
    document.addEventListener('pointermove', onPointerMove);
    return () => {
      document.removeEventListener('pointermove', onPointerMove);
    };
  }, [onPointerMove]);

  return { splatStack };
};
