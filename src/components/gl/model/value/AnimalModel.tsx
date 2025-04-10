import React, { forwardRef, Ref } from 'react';
import * as THREE from 'three';

import Animal2Model from '@/components/gl/model/value/Animal2Model';
import Animal3Model from '@/components/gl/model/value/Animal3Model';
import Animal4Model from '@/components/gl/model/value/Animal4Model';
import { useControls } from 'leva';

const AnimalModel = forwardRef((props, ref: Ref<THREE.Group>) => {
  // const { position, rotation } = useControls({
  //   position: {
  //     value: { x: 0, y: -10, z: 0 },
  //     x: { step: 0.1 },
  //     y: { step: 0.1 },
  //     z: { step: 0.1 },
  //   },
  //   rotation: {
  //     value: { x: 0, y: 0, z: 0 },
  //     x: { step: 0.1 },
  //     y: { step: 0.1 },
  //     z: { step: 0.1 },
  //   },
  // });
  return (
    <group ref={ref} {...props}>
      <Animal2Model />
      {/*<Animal3Model />*/}
      {/*<Animal4Model />*/}
    </group>
  );
});

AnimalModel.displayName = 'DragonModelTemp';

export default AnimalModel;
