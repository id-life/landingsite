import { useIsMobile } from '@/hooks/useIsMobile';
import { useThree } from '@react-three/fiber';
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
  const isMobile = useIsMobile();
  const lastMouse = useRef<Vector2>(new Vector2());
  const hasMoved = useRef<boolean>(false);

  const createRadialSplats = useCallback(
    (x: number, y: number, numSplats = 16, forceRatio = 16) => {
      const baseRadius = force * forceRatio;
      const numLayers = 8;
      splatStack.push({
        mouseX: x / size.width,
        mouseY: 1.0 - y / size.height,
        velocityX: 0,
        velocityY: 0,
      });

      for (let layer = 1; layer <= numLayers; layer++) {
        const layerRadius = baseRadius * (layer / numLayers);

        for (let i = 0; i < numSplats; i++) {
          const angle = (i * 2 * Math.PI) / numSplats;
          const randomOffset = (Math.random() - 0.5) * 2;
          const velocityX = Math.cos(angle + randomOffset) * layerRadius;
          const velocityY = Math.sin(angle + randomOffset) * layerRadius;

          splatStack.push({
            mouseX: x / size.width,
            mouseY: 1.0 - y / size.height,
            velocityX: velocityX * (1 + Math.random() * 16),
            velocityY: velocityY * (1 + Math.random() * 16),
          });
        }
      }
    },
    [force, size.width, size.height, splatStack],
  );

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

  const onPointerDown = useCallback(
    (event: PointerEvent) => {
      createRadialSplats(event.clientX, event.clientY);
    },
    [createRadialSplats],
  );

  const onTouchMove = useCallback(
    (event: TouchEvent) => {
      const touch = event.touches[0];
      const deltaX = touch.clientX - lastMouse.current.x;
      const deltaY = touch.clientY - lastMouse.current.y;

      if (!hasMoved.current) {
        hasMoved.current = true;
        lastMouse.current.set(touch.clientX, touch.clientY);
      }

      lastMouse.current.set(touch.clientX, touch.clientY);

      if (!hasMoved.current) return;

      splatStack.push({
        mouseX: touch.clientX / size.width,
        mouseY: 1.0 - touch.clientY / size.height,
        velocityX: deltaX * force,
        velocityY: -deltaY * force,
      });
    },
    [force, size.height, size.width, splatStack],
  );

  const onTouchStart = useCallback(
    (event: TouchEvent) => {
      const touch = event.touches[0];
      createRadialSplats(touch.clientX, touch.clientY, 3, 4);
    },
    [createRadialSplats],
  );

  useEffect(() => {
    if (isMobile) {
      document.addEventListener('touchmove', onTouchMove);
      document.addEventListener('touchstart', onTouchStart);
      return () => {
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchstart', onTouchStart);
      };
    } else {
      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerdown', onPointerDown);
      return () => {
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerdown', onPointerDown);
      };
    }
  }, [onPointerDown, onPointerMove, onTouchMove, isMobile, onTouchStart]);

  return { splatStack };
};
