import React, { forwardRef, Ref } from 'react';
import * as THREE from 'three';

import Animal2Model from '@/components/gl/model/value/Animal2Model';

const AnimalModel = forwardRef((props, ref: Ref<THREE.Group>) => {
  return (
    <group ref={ref} {...props}>
      <Animal2Model />
    </group>
  );
});

AnimalModel.displayName = 'DragonModelTemp';

export default AnimalModel;
