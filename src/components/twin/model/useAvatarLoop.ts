import { useAnimations } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useReducedMotionPref } from '@/motion/preference';

/** How long each clip of the avatar's attention loop plays before the other one (ms). */
const CLIP_MS = 10000;
/** Cross-fade between clips (s). */
const FADE_S = 0.5;

/**
 * The rest pose of the still frame (MOT-02 reduced motion): the first frame of the "Idle" clip, the avatar standing
 * relaxed, facing the camera, arms down. It is the pose every loop starts from and the one the phone's poster shows,
 * and, unlike the middle of "Idle" or "PullingLever" (a raised forearm, the hand at the wrist), it reads as a still
 * portrait rather than a paused gesture. "Apose" (arms out, a rigging pose) was not chosen.
 */
export const AVATAR_REST = { clip: 'Idle', time: 0 } as const;

/**
 * The skin avatars' animation (Model0Out to Model3Out): "Idle" for 10 s, then "PullingLever" for 10 s, repeating, and
 * restarted on `resetKey`. With reduced motion nothing loops: every clip stops and the avatar is held at AVATAR_REST,
 * so the canvas's settled still frame (FrameDriver) is that deliberate pose, never whatever frame the loop was at.
 */
export function useAvatarLoop(animations: THREE.AnimationClip[], scene: THREE.Object3D, resetKey = 0) {
  const { actions, mixer } = useAnimations(animations, scene);
  const reduced = useReducedMotionPref();
  const currentRef = useRef<THREE.AnimationAction | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (reduced) {
      mixer.stopAllAction();
      const rest = actions[AVATAR_REST.clip];
      if (rest) {
        rest.reset().play();
        rest.paused = true;
        rest.time = AVATAR_REST.time;
        currentRef.current = rest;
      }
      return () => {
        rest?.stop();
      };
    }
    const play = (name: string, next: string) => {
      currentRef.current?.fadeOut(FADE_S);
      const action = actions[name];
      if (!action) return;
      action.reset().play();
      currentRef.current = action;
      timer = setTimeout(() => play(next, name), CLIP_MS);
    };
    play('Idle', 'PullingLever');
    return () => {
      if (timer) clearTimeout(timer);
      currentRef.current?.fadeOut(FADE_S);
    };
  }, [actions, mixer, reduced, resetKey]);
}
