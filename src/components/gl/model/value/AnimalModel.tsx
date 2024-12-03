import React, { forwardRef, Ref, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useAnimations, useFBO, useGLTF } from '@react-three/drei';
import { ANIMAL_CONFIG, useFBOs } from '@/components/gl/config/animalConfig';
import { MeshDiscardMaterial, MeshTransmissionMaterial } from '@pmndrs/vanilla';

const backsideThickness = 1.5;
const thickness = 5;

const randomIndex = Math.floor(Math.random() * 2);

const gltfConfig = ANIMAL_CONFIG[randomIndex];

const AnimalModel = forwardRef((props, ref: Ref<THREE.Group>) => {
  const { scene, animations } = useGLTF(gltfConfig.path);
  const { actions, names } = useAnimations(animations, scene);
  const meshRef = useRef<THREE.Mesh[]>([]);
  const [discardMaterial] = useState(() => new MeshDiscardMaterial());
  const [background] = useState(() => new THREE.Color('white'));
  const fbos = useFBOs(gltfConfig.mesh.length);

  useEffect(() => {
    if (!scene) return;
    scene.traverse((child: any) => {
      if (child.isMesh) {
        const mesh = gltfConfig.mesh.find((mesh) => mesh.name === child.name);
        if (mesh) {
          const material = new MeshTransmissionMaterial({ samples: 4 });
          material.reflectivity = mesh.reflectivity;
          material.anisotropy = mesh.anisotropy;
          child.material = material;
          meshRef.current.push(child);
        }
      }
    });
  }, [scene]);

  useEffect(() => {
    actions[names[gltfConfig.animation]]?.reset().play();
  }, [actions, names]);

  useFrame(({ clock, gl, scene, camera }) => {
    meshRef.current.forEach((mesh: any, index: number) => {
      mesh.material.time = clock.getElapsedTime();
      const oldTone = gl.toneMapping;
      const oldBg = scene.background;
      const oldMaterial = mesh.material;

      gl.toneMapping = THREE.NoToneMapping;
      scene.background = background;
      mesh.material = discardMaterial;

      gl.setRenderTarget(fbos[index][1]);
      gl.render(scene, camera);
      mesh.material = oldMaterial;
      mesh.material.buffer = fbos[index][1].texture;
      mesh.material.thickness = backsideThickness;
      mesh.material.side = THREE.BackSide;

      gl.setRenderTarget(fbos[index][0]);
      gl.render(scene, camera);

      mesh.material = oldMaterial;
      mesh.material.thickness = thickness;
      mesh.material.side = THREE.FrontSide;
      mesh.material.buffer = fbos[index][0].texture;

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

AnimalModel.displayName = 'DragonModelTemp';

export default AnimalModel;
