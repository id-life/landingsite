import React, { forwardRef, Ref, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useAnimations, useFBO, useGLTF } from '@react-three/drei';
import { ANIMAL_CONFIG } from '@/components/gl/config/animalConfig';
import { MeshDiscardMaterial, MeshTransmissionMaterial } from '@pmndrs/vanilla';

const backsideThickness = 1.5;
const thickness = 5;

const gltfConfig = ANIMAL_CONFIG[0];

const Animal2Model = forwardRef((props, ref: Ref<THREE.Group>) => {
  const { scene, animations } = useGLTF(gltfConfig.path);
  const { actions, names } = useAnimations(animations, scene);
  const meshRef = useRef<THREE.Mesh[]>([]);
  const [discardMaterial] = useState(() => new MeshDiscardMaterial());
  const [background] = useState(() => new THREE.Color('white'));
  const fboMain = useFBO(256, 256);
  const fboBack = useFBO(256, 256);

  useEffect(() => {
    if (!scene) return;
    scene.traverse((child: any) => {
      if (child.isMesh) {
        if (child.name === 'JF_skin_in') {
          const material = new MeshTransmissionMaterial({ samples: 4 });
          material.reflectivity = 0.04;
          material.anisotropy = 0.5;
          child.material = material;
          meshRef.current.push(child);
        }
        if (child.name === 'JF_skin_out') {
          child.material.opacity = 0.5;
        }
      }
    });
  }, [scene]);

  useEffect(() => {
    actions[names[gltfConfig.animation]]?.reset().play();
  }, [actions, names]);

  useFrame(({ clock, gl, scene, camera }) => {
    meshRef.current.forEach((mesh: any) => {
      mesh.material.time = clock.getElapsedTime();
      const oldTone = gl.toneMapping;
      const oldBg = scene.background;
      const oldMaterial = mesh.material;

      gl.toneMapping = THREE.NoToneMapping;
      scene.background = background;
      mesh.material = discardMaterial;

      gl.setRenderTarget(fboBack);
      gl.render(scene, camera);
      mesh.material = oldMaterial;
      mesh.material.buffer = fboBack.texture;
      mesh.material.thickness = backsideThickness;
      mesh.material.side = THREE.BackSide;

      gl.setRenderTarget(fboMain);
      gl.render(scene, camera);

      mesh.material = oldMaterial;
      mesh.material.thickness = thickness;
      mesh.material.side = THREE.FrontSide;
      mesh.material.buffer = fboMain.texture;

      scene.background = oldBg;
      gl.setRenderTarget(null);
      gl.toneMapping = oldTone;
    });
  });

  return (
    <group ref={ref} {...props} scale={gltfConfig.scale}>
      <group rotation={[0, Math.PI / 2, 0]}>
        <primitive object={scene}></primitive>
      </group>
    </group>
  );
});

Animal2Model.displayName = 'Animal2Model';

export default Animal2Model;
