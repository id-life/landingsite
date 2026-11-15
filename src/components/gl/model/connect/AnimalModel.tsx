import React, { forwardRef, Ref } from 'react';
import { ModelBoundary } from '@/components/gl/GLBoundary';
import * as THREE from 'three';

import Animal2Model from '@/components/gl/model/connect/Animal2Model';
import { DeferredSettled, useDeferredAssets } from '@/hooks/useDeferredAssets';

// The group (animated by the Connect timelines) is always present; the 2.8 MB jellyfish inside it
// loads when the visitor comes within one section of Connect, in its own Suspense boundary so it
// never holds the hero back.
const AnimalModel = forwardRef((props, ref: Ref<THREE.Group>) => {
  const deferredReady = useDeferredAssets('jellyfish');
  return (
    <group ref={ref} {...props}>
      {deferredReady && (
        // Its own boundary (ENG-02): a jellyfish that fails to load removes only the jellyfish.
        <ModelBoundary canvas="vision" model="jellyfish">
          <Animal2Model />
          <DeferredSettled group="jellyfish" />
        </ModelBoundary>
      )}
    </group>
  );
});

AnimalModel.displayName = 'DragonModelTemp';

export default AnimalModel;
