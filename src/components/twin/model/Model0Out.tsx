import { MessageType } from '@/components/event-bus/messageType';
import { useEventBus } from '@/components/event-bus/useEventBus';
import { Center, useAnimations, useGLTF, useProgress } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import MODELS from '@/components/gl/models-manifest.json';

// Content-hashed by scripts/optimize-models.mjs (PERF-14).
const MODEL_URL = MODELS.twin;

/** Fetch the avatar into the loader cache before Model0Out mounts (see useDeferredWarm). */
export const preloadModel0Out = () => useGLTF.preload(MODEL_URL);

export default function Model0Out() {
  const { scene, animations } = useGLTF(MODEL_URL);
  const currentActionRef = useRef<THREE.AnimationAction | null>(null); // 存储当前动画
  const animationLoopRef = useRef<NodeJS.Timeout | null>(null);
  const { actions } = useAnimations(animations, scene);
  const [resetAnimation, setResetAnimation] = useState<number>(0);
  const gl = useThree((state) => state.gl);
  const viewScene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);

  // Compile the avatar's shaders as soon as it has loaded (one section before it is shown), in the background where
  // the browser supports it (KHR_parallel_shader_compile). The first frame that drew the twin otherwise compiled them
  // synchronously: a 136-149 ms long task when the section appeared (PERF-14 trace).
  useEffect(() => {
    void gl.compileAsync(scene, camera, viewScene).catch(() => {
      // Compilation then happens on first draw, as before.
    });
  }, [gl, scene, camera, viewScene]);

  // MOT-06: hair and lashes are transparent and double-sided, which three.js draws in two passes (back faces, then
  // front); one pass looks the same on strands this thin and halves their draw calls.
  useEffect(() => {
    scene.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (!mesh.isMesh) return;
      for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
        if (/毛发|睫毛/.test(material.name)) material.forceSinglePass = true;
      }
    });
  }, [scene]);

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
