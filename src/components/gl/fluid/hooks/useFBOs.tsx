import * as THREE from 'three';

import { useFBO } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import { useDoubleFBO } from '../hooks/useDoubleFBO';
import { OPTS } from '../constant';

export const useFBOs = (simRes: number = OPTS.simRes) => {
  const density = useDoubleFBO(OPTS.dyeRes, OPTS.dyeRes, {
    type: THREE.HalfFloatType,
    format: THREE.RGBAFormat,
    minFilter: THREE.LinearFilter,
    depth: false,
  });

  const velocity = useDoubleFBO(simRes, simRes, {
    type: THREE.HalfFloatType,
    format: THREE.RGFormat,
    minFilter: THREE.LinearFilter,
    depth: false,
  });

  const pressure = useDoubleFBO(simRes, simRes, {
    type: THREE.HalfFloatType,
    format: THREE.RedFormat,
    minFilter: THREE.NearestFilter,
    depth: false,
  });

  const divergence = useFBO(simRes, simRes, {
    type: THREE.HalfFloatType,
    format: THREE.RedFormat,
    minFilter: THREE.NearestFilter,
    depth: false,
  });

  const curl = useFBO(simRes, simRes, {
    type: THREE.HalfFloatType,
    format: THREE.RedFormat,
    minFilter: THREE.NearestFilter,
    depth: false,
  });

  const FBOs = useMemo(() => {
    return {
      density,
      velocity,
      pressure,
      divergence,
      curl,
    };
  }, [curl, density, divergence, pressure, velocity]);

  useEffect(() => {
    return () => {
      for (const FBO of Object.values(FBOs)) {
        FBO.dispose();
      }
    };
  }, [FBOs]);

  return FBOs;
};
