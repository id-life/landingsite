import { MessageType } from '@/components/event-bus/messageType';
import { useEventBus } from '@/components/event-bus/useEventBus';
import { Center, useAnimations, useGLTF, useProgress } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function Model0Out() {
  const { scene, animations } = useGLTF('/models/test-v3.glb');
  const currentActionRef = useRef<THREE.AnimationAction | null>(null); // 存储当前动画
  const animationLoopRef = useRef<NodeJS.Timeout | null>(null);
  const { actions } = useAnimations(animations, scene);
  const [resetAnimation, setResetAnimation] = useState<number>(0);

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
  }, [actions, resetAnimation]);

  useEventBus(MessageType.RESET_ANIMATION, () => {
    setResetAnimation((state) => state + 1);
  });

  return (
    <Center scale={5.5}>
      <primitive visible={true} object={scene} />
    </Center>
  );
}
