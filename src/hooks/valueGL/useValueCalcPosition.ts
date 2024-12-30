import { useThree } from '@react-three/fiber';
import { useCallback, useMemo } from 'react';
import { Vector3 } from 'three';

export const defaultWidth = 1912;

export type Position = {
  x: number;
  y: number;
  z: number;
};

export const useValueCalcPosition = () => {
  const { size } = useThree();
  const scaleRatio = useMemo(() => Math.min(1, size.width / defaultWidth), [size.width]);

  const getScalePosition = useCallback(
    (pos: Position) => {
      const backScale = 1 / scaleRatio;
      return { x: pos.x * backScale, y: pos.y * backScale, z: pos.z * backScale };
    },
    [scaleRatio],
  );
  const getVectorPosition = useCallback((pos: Position) => new Vector3(pos.x, pos.y, pos.z), []);
  return { scaleRatio, getScalePosition, getVectorPosition };
};
