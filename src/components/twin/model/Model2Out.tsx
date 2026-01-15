import { Center, useAnimations, useGLTF } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Model2Out() {
  const { scene, animations } = useGLTF('https://cdn.id.life/twin/m2-v2.glb');
  const currentActionRef = useRef<THREE.AnimationAction | null>(null); // 存储当前动画
  const animationLoopRef = useRef<NodeJS.Timeout | null>(null);
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    const startAnimationLoop = () => {
      if (animationLoopRef.current) {
        clearTimeout(animationLoopRef.current);
        animationLoopRef.current = null;
        if (currentActionRef.current) {
          currentActionRef.current.fadeOut(0.5);
        }
      }
      const action = actions['Apose'];
      if (currentActionRef.current && action) {
        action.reset().play();
        currentActionRef.current = action;
        action.clampWhenFinished = true;
        action.loop = THREE.LoopRepeat;
      }
      const playCatwalk = () => {
        if (currentActionRef.current) {
          currentActionRef.current.fadeOut(0.5);
        }
        if (actions['Idle']) {
          actions['Idle'].reset().play();
          currentActionRef.current = actions['Idle'];

          animationLoopRef.current = setTimeout(() => {
            playRandomAnimation('PullingLever');
          }, 10000);
        }
      };

      const playRandomAnimation = (name: string) => {
        if (currentActionRef.current) {
          currentActionRef.current.fadeOut(0.5);
        }
        if (actions[name]) {
          actions[name].reset().play();
          currentActionRef.current = actions[name];

          animationLoopRef.current = setTimeout(() => {
            playCatwalk();
          }, 10000);
        }
      };

      playCatwalk();
    };

    const stopAnimationLoop = () => {
      if (animationLoopRef.current) {
        clearTimeout(animationLoopRef.current);
      }
      if (currentActionRef.current) {
        currentActionRef.current.fadeOut(0.5);
      }
    };

    startAnimationLoop();
    return () => {
      stopAnimationLoop();
    };
  }, [actions]);

  return (
    <Center scale={5.5}>
      <primitive visible={true} object={scene} />
    </Center>
  );
}
