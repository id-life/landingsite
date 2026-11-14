import React, { forwardRef, Ref, Suspense } from 'react';
import * as THREE from 'three';

import Animal2Model from '@/components/gl/model/connect/Animal2Model';
import { useDeferredAssets } from '@/hooks/useDeferredAssets';

// The group (animated by the Connect timelines) is always present; the 2.8 MB jellyfish inside it
// loads after the first screen is up, in its own Suspense boundary so it never holds the hero back.
const AnimalModel = forwardRef((props, ref: Ref<THREE.Group>) => {
  const deferredReady = useDeferredAssets();
  return (
    <group ref={ref} {...props}>
      {deferredReady && (
        <Suspense fallback={null}>
          <Animal2Model />
        </Suspense>
      )}
    </group>
  );
});

AnimalModel.displayName = 'DragonModelTemp';

export default AnimalModel;
