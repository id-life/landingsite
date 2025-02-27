import React, { forwardRef, Ref } from 'react';
import * as THREE from 'three';

import Animal2Model from '@/components/gl/model/value/Animal2Model';
import Animal3Model from '@/components/gl/model/value/Animal3Model';
import Animal4Model from '@/components/gl/model/value/Animal4Model';

const AnimalModel = forwardRef((props, ref: Ref<THREE.Group>) => {
  return (
    <group ref={ref} {...props}>
      <Animal2Model />
      <Animal3Model />
      <Animal4Model />
    </group>
  );
});

AnimalModel.displayName = 'DragonModelTemp';

export default AnimalModel;
