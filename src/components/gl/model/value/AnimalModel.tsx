import { MeshDiscardMaterial, MeshTransmissionMaterial } from '@pmndrs/vanilla';
import { useAnimations, useFBO, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { forwardRef, Ref, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const backsideThickness = 1.5;
const thickness = 5;

const AnimalModel = forwardRef((props, ref: Ref<THREE.Group>) => {
  const { scene, animations } = useGLTF('https://cdn.id.life/animal2.glb');
  const { actions, names } = useAnimations(animations, scene);
  const meshRef = useRef<THREE.Mesh[]>([]);
  const materialRef = useRef<JSX.IntrinsicElements['meshTransmissionMaterial']>(new MeshTransmissionMaterial({ samples: 4 }));

  const [discardMaterial] = useState(() => new MeshDiscardMaterial());
  const [background] = useState(() => new THREE.Color('white'));
  const fboMain = useFBO(256, 256);
  const fboBack = useFBO(256, 256);

  useEffect(() => {
    if (!scene) return;
    materialRef.current.reflectivity = 0.04;
    materialRef.current.anisotropy = 0.5;
    const mesh: any = scene.children[0].children[0].children[0];
    mesh.material = materialRef.current;
    meshRef.current.push(mesh);
  }, [scene]);

  useEffect(() => {
    actions[names[1]]?.reset().play();
  }, [actions, names]);

  useFrame(({ clock, gl, scene, camera }) => {
    if (!materialRef.current) return;
    materialRef.current.time = clock.getElapsedTime();

    meshRef.current.forEach((mesh: any) => {
      const oldTone = gl.toneMapping;
      const oldBg = scene.background;

      gl.toneMapping = THREE.NoToneMapping;
      scene.background = background;
      mesh.material = discardMaterial;

      gl.setRenderTarget(fboBack);
      gl.render(scene, camera);
      mesh.material = materialRef.current;
      mesh.material.buffer = fboBack.texture;
      mesh.material.thickness = backsideThickness;
      mesh.material.side = THREE.BackSide;

      gl.setRenderTarget(fboMain);
      gl.render(scene, camera);

      mesh.material = materialRef.current;
      mesh.material.thickness = thickness;
      mesh.material.side = THREE.FrontSide;
      mesh.material.buffer = fboMain.texture;

      scene.background = oldBg;
      gl.setRenderTarget(null);
      gl.toneMapping = oldTone;
    });
  });

  return (
    <group ref={ref} {...props} position={[0, -10, 0]}>
      <group rotation={[0, Math.PI / 2, 0]}>
        <primitive object={scene}></primitive>
      </group>
    </group>
  );
});
AnimalModel.displayName = 'DragonModelTemp';

export default AnimalModel;
