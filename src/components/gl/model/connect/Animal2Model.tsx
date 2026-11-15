import { model2VisibleAtom } from '@/atoms/geo';
import { currentPageIndexAtom, mobileCurrentPageIndexAtom } from '@/atoms/nav';
import { NAV, NAV_LIST } from '@/components/nav/nav';
import { ANIMAL_CONFIG } from '@/components/gl/config/animalConfig';
import { MeshDiscardMaterial, MeshTransmissionMaterial } from '@pmndrs/vanilla';
import { useAnimations, useFBO, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useAtomValue } from 'jotai';
import { forwardRef, memo, Ref, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const backside = false;
const backsideThickness = 0.5;
const thickness = 1;
const animation = 0;

const gltfConfig = ANIMAL_CONFIG[0];
const CONNECT_INDEX = NAV_LIST.findIndex((item) => item.id === NAV.connect_page.id);

const Animal2Model = forwardRef((props, ref: Ref<THREE.Group>) => {
  const { scene, animations } = useGLTF(gltfConfig.path);
  const { actions, names } = useAnimations(animations, scene);
  const meshRef = useRef<THREE.Mesh[]>([]);
  const [discardMaterial] = useState(() => new MeshDiscardMaterial());
  const [background] = useState(() => new THREE.Color('white'));
  const fboMain = useFBO(gltfConfig.resolution, gltfConfig.resolution);
  const fboBack = useFBO(gltfConfig.resolution, gltfConfig.resolution);
  const visible = useAtomValue(model2VisibleAtom);
  // MOT-03: the jellyfish swims and refracts only while the visitor is at Connect or one section before it (the
  // vision canvas also shows the hero, with the jellyfish far below the frame). Elsewhere its animation is paused and
  // its transmission pass (a second render of the scene every frame) is skipped.
  const desktopIndex = useAtomValue(currentPageIndexAtom);
  const mobileIndex = useAtomValue(mobileCurrentPageIndexAtom);
  const near = Math.max(desktopIndex, mobileIndex) >= CONNECT_INDEX - 1;

  useEffect(() => {
    if (!scene) return;
    scene.traverse((child: any) => {
      if (child.isMesh) {
        if (child.name === 'JF_skin_in') {
          const material = new MeshTransmissionMaterial({ samples: 4, buffer: fboMain.texture as any });
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
  }, [fboMain.texture, scene]);

  useEffect(() => {
    actions[names[animation]]?.reset().play();
  }, [actions, names]);

  useEffect(() => {
    const action = actions[names[animation]];
    if (action) action.paused = !near;
  }, [actions, names, near]);

  useFrame(({ clock, gl, scene, camera }) => {
    // 当不可见时跳过渲染循环
    if (!visible || !near) return;

    meshRef.current.forEach((mesh: any) => {
      mesh.material.time = clock.getElapsedTime();
      if (mesh.material.buffer === fboMain.texture) {
        const oldTone = gl.toneMapping;
        const oldBg = scene.background;
        const oldMaterial = mesh.material;
        const oldSide = mesh.material.side;

        gl.toneMapping = THREE.NoToneMapping;
        scene.background = background;
        mesh.material = discardMaterial;

        if (backside) {
          gl.setRenderTarget(fboBack);
          gl.render(scene, camera);
          mesh.material = oldMaterial;
          mesh.material.buffer = fboBack.texture;
          mesh.material.thickness = backsideThickness;
          mesh.material.side = THREE.BackSide;
        }

        gl.setRenderTarget(fboMain);
        gl.render(scene, camera);

        mesh.material = oldMaterial;
        mesh.material.thickness = thickness;
        mesh.material.side = oldSide;
        mesh.material.buffer = fboMain.texture;

        scene.background = oldBg;
        gl.setRenderTarget(null);
        gl.toneMapping = oldTone;
      }
    });
  });

  return (
    <group ref={ref} {...props} scale={gltfConfig.scale} visible={visible}>
      <group rotation={[0, Math.PI / 2, 0]}>
        <primitive object={scene}></primitive>
      </group>
    </group>
  );
});

Animal2Model.displayName = 'Animal2Model';

export default memo(Animal2Model);
