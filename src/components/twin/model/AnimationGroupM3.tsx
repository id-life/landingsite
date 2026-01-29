'use client';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import * as THREE from 'three';
import { useAnimations, useGLTF } from '@react-three/drei';

export type AnimationGroupProps = {
  modelRef: React.MutableRefObject<THREE.Group | null>;
};
export type AnimationGroupHandle = {
  playAnimation: (name: string, onComplete?: () => void) => void;
  fadeOut: (target: 'modelRef' | 'animationGroup', onComplete?: () => void) => void;
  fadeIn: (target: 'modelRef' | 'animationGroup', onComplete?: () => void) => void;
  startAnimationLoop: () => void;
  stopAnimationLoop: () => void;
};
const AnimationGroup = forwardRef<AnimationGroupHandle, AnimationGroupProps>(({ modelRef }, ref) => {
  const { nodes, materials, animations } = useGLTF('https://resources.id.life/m3/test-v1.glb') as unknown as {
    nodes: {
      Basic_T_shirts001: THREE.SkinnedMesh;
      Gym_Short001: THREE.SkinnedMesh;
      CC_Base_Body001: THREE.SkinnedMesh;
      CC_Base_Body001_1: THREE.SkinnedMesh;
      CC_Base_Body001_2: THREE.SkinnedMesh;
      CC_Base_Body001_3: THREE.SkinnedMesh;
      CC_Base_Body001_4: THREE.SkinnedMesh;
      CC_Base_Body001_5: THREE.SkinnedMesh;
      CC_Base_Body001_6: THREE.SkinnedMesh;
      CC_Base_Eye001: THREE.SkinnedMesh;

      CC_Base_Eye001_1: THREE.SkinnedMesh;
      CC_Base_Eye001_2: THREE.SkinnedMesh;
      CC_Base_Eye001_3: THREE.SkinnedMesh;
      CC_Base_Eye001_4: THREE.SkinnedMesh;
      CC_Base_EyeOcclusion001: THREE.SkinnedMesh;
      CC_Base_EyeOcclusion001_1: THREE.SkinnedMesh;
      CC_Base_EyeOcclusion001_2: THREE.SkinnedMesh;
      CC_Base_TearLine001: THREE.SkinnedMesh;
      CC_Base_TearLine001_1: THREE.SkinnedMesh;
      CC_Base_Teeth001_1: THREE.SkinnedMesh;
      CC_Base_Teeth001_2: THREE.SkinnedMesh;
      CC_Base_Tongue001: THREE.SkinnedMesh;
      Layered_Straight_Hair002: THREE.SkinnedMesh;
      Canvas_shoes001: THREE.SkinnedMesh;
      Sports_Pants001: THREE.SkinnedMesh;
      mixamorigHips: THREE.SkinnedMesh;
    };
    materials: {
      [key: string]: THREE.Material;
    };
    animations: THREE.AnimationClip[];
  };

  const currentActionRef = useRef<THREE.AnimationAction | null>(null); // 存储当前动画
  const animationLoopRef = useRef<NodeJS.Timeout | null>(null);

  const { ref: animationRef, actions } = useAnimations(animations);
  const animationGroupRef = animationRef as React.MutableRefObject<THREE.Group | null>;

  const fade = (
    target: THREE.Group | null,
    startOpacity: number,
    endOpacity: number,
    duration: number,
    onComplete?: () => void,
  ) => {
    if (!target) return;

    let startTime: number | null = null;

    // 存储所有材质
    const materials: (THREE.Material & { opacity: number })[] = [];

    target.traverse((child) => {
      if ((child as THREE.Mesh).material) {
        const mat = (child as THREE.Mesh).material;
        if (Array.isArray(mat)) {
          // 如果材质是数组，处理每个材质
          mat.forEach((m) => {
            if (m.opacity !== undefined) {
              m.transparent = true;
              if (m.name == '毛发透明度.003b126') {
                m.depthWrite = false;
                m.depthTest = true;
              }
              materials.push(m);
            }
          });
        } else if (mat.opacity !== undefined) {
          // 头发的层级单独处理，不然会透视
          mat.transparent = true;
          if (['基本眼睛rb103', '基本c或nearb104', '基本眼睛lb105', '基本c或nealb106'].includes(mat.name)) {
            mat.transparent = false; // 在淡出后禁用深度写入
          }
          child.renderOrder = 1; // 材质渲染顺序
          if (mat.name == '毛发透明度.003b126') {
            mat.depthWrite = false;
            mat.depthTest = true;
            child.renderOrder = 2; // 让头发材质晚于其他材质渲染
          }
          materials.push(mat);
        }
      }
    });

    if (materials.length === 0) {
      if (onComplete) onComplete();
      return;
    }

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;

      const progress = Math.min(elapsed / duration, 1);
      const currentOpacity = startOpacity + (endOpacity - startOpacity) * progress;

      materials.forEach((mat) => {
        mat.opacity = currentOpacity; // 更新透明度
        if (mat.name === '基本c或nearb104' || mat.name === '基本c或nealb106') {
          mat.depthWrite = true; // 渐变完成后启用深度写入
        }
        // if (mat.name === '基本眼睛r.006b188' || mat.name === '基本眼睛l.006b190') {
        //   mat.depthWrite = false; // 渐变完成后启用深度写入
        // }
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        if (onComplete) onComplete();
      }
    };

    requestAnimationFrame(animate);
  };

  useImperativeHandle(ref, () => ({
    playAnimation: (name, onComplete) => {
      if (!actions) return;
      // 停止当前动画
      if (currentActionRef.current) {
        currentActionRef.current.fadeOut(0.5);
      }
      // 播放新动画
      const action = actions[name];
      if (action) {
        action.reset().fadeIn(0.5).play();
        currentActionRef.current = action;
        action.clampWhenFinished = true;
        action.loop = THREE.LoopRepeat;

        // 设置动画持续时间为 0.8 秒
        setTimeout(() => {
          if (onComplete) onComplete(); // 调用回调
        }, 700);
      }
    },
    fadeOut: (target: string, onComplete: any) => {
      if (target === 'modelRef') {
        fade(modelRef.current, 1, 0, 2000, onComplete);
      } else if (target === 'animationGroup') {
        if (animationGroupRef.current) {
          // 单独处理眼睛
          animationGroupRef.current.traverse((object: any) => {
            if (
              object.material &&
              (object.material.name === '基本眼睛rb103' ||
                object.material.name === '基本c或nearb104' ||
                object.material.name === '基本眼睛lb105' ||
                object.material.name === '基本c或nealb106')
            ) {
              object.visible = false;
            }
          });
          // animationGroupRef.current.visible = false
        }
        fade(animationGroupRef.current, 1, 0, 500, () => {
          if (animationGroupRef.current) animationGroupRef.current.visible = false;
        });
      }
    },
    fadeIn: (target: string, onComplete: any) => {
      if (target === 'modelRef') {
        fade(modelRef.current, 0, 1, 2000, onComplete);
      } else if (target === 'animationGroup') {
        if (animationGroupRef.current) {
          animationGroupRef.current.visible = true;
          animationGroupRef.current.traverse((object: any) => {
            if (
              object.material &&
              (object.material.name === '基本眼睛rb103' ||
                object.material.name === '基本c或nearb104' ||
                object.material.name === '基本眼睛lb105' ||
                object.material.name === '基本c或nealb106')
            ) {
              object.visible = true;
            }
          });
        }
        fade(animationGroupRef.current, 0, 1, 1000, onComplete);
      }
    },
    startAnimationLoop: () => {
      if (animationLoopRef.current) {
        clearTimeout(animationLoopRef.current);
        animationLoopRef.current = null;
        if (currentActionRef.current) {
          currentActionRef.current.fadeOut(0.5);
        }
      }
      const action = actions['Apose'];
      if (currentActionRef.current && action) {
        action.reset().fadeIn(0.5).play();
        currentActionRef.current = action;
        action.clampWhenFinished = true;
        action.loop = THREE.LoopRepeat;
      }
      const playCatwalk = () => {
        if (currentActionRef.current) {
          currentActionRef.current.fadeOut(0.5);
        }
        if (actions['Idle']) {
          actions['Idle'].reset().fadeIn(0.5).play();
          currentActionRef.current = actions['Idle'];

          animationLoopRef.current = setTimeout(() => {
            const randomAnimation = 'PullingLever';
            playRandomAnimation(randomAnimation);
          }, 10000); // 10秒后切换
        }
      };

      const playRandomAnimation = (name: string) => {
        if (currentActionRef.current) {
          currentActionRef.current.fadeOut(0.5);
        }
        if (actions[name]) {
          actions[name].reset().fadeIn(0.5).play();
          currentActionRef.current = actions[name];

          animationLoopRef.current = setTimeout(() => {
            playCatwalk();
          }, 10000); // 10秒后切换
        }
      };

      playCatwalk();
    },
    stopAnimationLoop: () => {
      if (animationLoopRef.current) {
        clearTimeout(animationLoopRef.current);
        animationLoopRef.current = null;
      }
      const action = actions['Apose'];
      if (currentActionRef.current && action) {
        action.reset().fadeIn(0.5).play();
        currentActionRef.current = action;
        action.clampWhenFinished = true;
        action.loop = THREE.LoopRepeat;
      }
    },
  }));
  return (
    <group name="Armature" ref={animationGroupRef} rotation={[Math.PI / 2, 0, 0]} scale={0.055}>
      <skinnedMesh
        name="Basic_T_shirts001"
        geometry={nodes.Basic_T_shirts001.geometry}
        material={materials.基础tshirtsb112}
        skeleton={nodes.Basic_T_shirts001.skeleton}
        castShadow
        receiveShadow
      />
      <skinnedMesh
        name="Canvas_shoes001"
        geometry={nodes.Canvas_shoes001.geometry}
        material={materials.canvasshoesb100}
        skeleton={nodes.Canvas_shoes001.skeleton}
        castShadow
        receiveShadow
      />
      <group name="CC_Base_Body001">
        <skinnedMesh
          name="CC_Base_Body001_1"
          geometry={nodes.CC_Base_Body001_1.geometry}
          material={materials.基本皮肤头b113}
          skeleton={nodes.CC_Base_Body001_1.skeleton}
          morphTargetDictionary={nodes.CC_Base_Body001_1.morphTargetDictionary}
          morphTargetInfluences={nodes.CC_Base_Body001_1.morphTargetInfluences}
          castShadow
          material-metalness={0.87}
          material-roughness={0.9}
          material-color={'#ffeaea'}
          receiveShadow
        />
        <skinnedMesh
          name="CC_Base_Body001_2"
          geometry={nodes.CC_Base_Body001_2.geometry}
          material={materials.基本皮肤身体b114}
          skeleton={nodes.CC_Base_Body001_2.skeleton}
          morphTargetDictionary={nodes.CC_Base_Body001_2.morphTargetDictionary}
          morphTargetInfluences={nodes.CC_Base_Body001_2.morphTargetInfluences}
          castShadow
          material-metalness={0.87}
          material-roughness={0.9}
          material-color={'#ffeaea'}
          receiveShadow
        />
        <skinnedMesh
          name="CC_Base_Body001_3"
          geometry={nodes.CC_Base_Body001_3.geometry}
          material={materials.基本皮肤手臂b115}
          skeleton={nodes.CC_Base_Body001_3.skeleton}
          morphTargetDictionary={nodes.CC_Base_Body001_3.morphTargetDictionary}
          morphTargetInfluences={nodes.CC_Base_Body001_3.morphTargetInfluences}
          castShadow
          material-metalness={0.87}
          material-roughness={0.9}
          material-color={'#ffeaea'}
          receiveShadow
        />
        <skinnedMesh
          name="CC_Base_Body001_4"
          geometry={nodes.CC_Base_Body001_4.geometry}
          material={materials.基本皮肤腿b116}
          skeleton={nodes.CC_Base_Body001_4.skeleton}
          morphTargetDictionary={nodes.CC_Base_Body001_4.morphTargetDictionary}
          morphTargetInfluences={nodes.CC_Base_Body001_4.morphTargetInfluences}
          castShadow
          material-metalness={0.87}
          material-roughness={0.9}
          material-color={'#ffeaea'}
          receiveShadow
        />
        <skinnedMesh
          name="CC_Base_Body001_5"
          geometry={nodes.CC_Base_Body001_5.geometry}
          material={materials.基本指甲b117}
          skeleton={nodes.CC_Base_Body001_5.skeleton}
          morphTargetDictionary={nodes.CC_Base_Body001_5.morphTargetDictionary}
          morphTargetInfluences={nodes.CC_Base_Body001_5.morphTargetInfluences}
          castShadow
          material-metalness={0.87}
          material-roughness={0.9}
          material-color={'#ffeaea'}
          receiveShadow
        />
        <skinnedMesh
          name="CC_Base_Body001_6"
          geometry={nodes.CC_Base_Body001_6.geometry}
          material={materials.基本睫毛b118}
          skeleton={nodes.CC_Base_Body001_6.skeleton}
          morphTargetDictionary={nodes.CC_Base_Body001_6.morphTargetDictionary}
          morphTargetInfluences={nodes.CC_Base_Body001_6.morphTargetInfluences}
          castShadow
          material-metalness={0.87}
          material-roughness={0.9}
          material-color={'#ffeaea'}
          receiveShadow
        />
      </group>
      <group name="CC_Base_Eye001">
        <skinnedMesh
          name="CC_Base_Eye001_1"
          geometry={nodes.CC_Base_Eye001_1.geometry}
          material={materials.基本眼睛rb103}
          skeleton={nodes.CC_Base_Eye001_1.skeleton}
          morphTargetDictionary={nodes.CC_Base_Eye001_1.morphTargetDictionary}
          morphTargetInfluences={nodes.CC_Base_Eye001_1.morphTargetInfluences}
        />
        <skinnedMesh
          name="CC_Base_Eye001_2"
          geometry={nodes.CC_Base_Eye001_2.geometry}
          material={materials.基本c或nearb104}
          skeleton={nodes.CC_Base_Eye001_2.skeleton}
          morphTargetDictionary={nodes.CC_Base_Eye001_2.morphTargetDictionary}
          morphTargetInfluences={nodes.CC_Base_Eye001_2.morphTargetInfluences}
        />
        <skinnedMesh
          name="CC_Base_Eye001_3"
          geometry={nodes.CC_Base_Eye001_3.geometry}
          material={materials.基本眼睛lb105}
          skeleton={nodes.CC_Base_Eye001_3.skeleton}
          morphTargetDictionary={nodes.CC_Base_Eye001_3.morphTargetDictionary}
          morphTargetInfluences={nodes.CC_Base_Eye001_3.morphTargetInfluences}
        />
        <skinnedMesh
          name="CC_Base_Eye001_4"
          geometry={nodes.CC_Base_Eye001_4.geometry}
          material={materials.基本c或nealb106}
          skeleton={nodes.CC_Base_Eye001_4.skeleton}
          morphTargetDictionary={nodes.CC_Base_Eye001_4.morphTargetDictionary}
          morphTargetInfluences={nodes.CC_Base_Eye001_4.morphTargetInfluences}
        />
      </group>
      <group name="CC_Base_EyeOcclusion001">
        <skinnedMesh
          name="CC_Base_EyeOcclusion001_1"
          geometry={nodes.CC_Base_EyeOcclusion001_1.geometry}
          material={materials.基本眼部阻塞rb107}
          skeleton={nodes.CC_Base_EyeOcclusion001_1.skeleton}
          morphTargetDictionary={nodes.CC_Base_EyeOcclusion001_1.morphTargetDictionary}
          morphTargetInfluences={nodes.CC_Base_EyeOcclusion001_1.morphTargetInfluences}
        />
        <skinnedMesh
          name="CC_Base_EyeOcclusion001_2"
          geometry={nodes.CC_Base_EyeOcclusion001_2.geometry}
          material={materials.基本眼部阻塞lb108}
          skeleton={nodes.CC_Base_EyeOcclusion001_2.skeleton}
          morphTargetDictionary={nodes.CC_Base_EyeOcclusion001_2.morphTargetDictionary}
          morphTargetInfluences={nodes.CC_Base_EyeOcclusion001_2.morphTargetInfluences}
        />
      </group>
      <group name="CC_Base_TearLine002">
        <skinnedMesh
          name="CC_Base_TearLine001"
          geometry={nodes.CC_Base_TearLine001.geometry}
          material={materials.基本分裂线rb101}
          skeleton={nodes.CC_Base_TearLine001.skeleton}
        />
        <skinnedMesh
          name="CC_Base_TearLine001_1"
          geometry={nodes.CC_Base_TearLine001_1.geometry}
          material={materials.基本分裂线lb102}
          skeleton={nodes.CC_Base_TearLine001_1.skeleton}
        />
      </group>
      <group name="CC_Base_Teeth001">
        <skinnedMesh
          name="CC_Base_Teeth001_1"
          geometry={nodes.CC_Base_Teeth001_1.geometry}
          material={materials.基本上齿b109}
          skeleton={nodes.CC_Base_Teeth001_1.skeleton}
        />
        <skinnedMesh
          name="CC_Base_Teeth001_2"
          geometry={nodes.CC_Base_Teeth001_2.geometry}
          material={materials.基本下颌b110}
          skeleton={nodes.CC_Base_Teeth001_2.skeleton}
        />
      </group>
      <skinnedMesh
        name="CC_Base_Tongue001"
        geometry={nodes.CC_Base_Tongue001.geometry}
        material={materials.基本舌头b119}
        skeleton={nodes.CC_Base_Tongue001.skeleton}
        morphTargetDictionary={nodes.CC_Base_Tongue001.morphTargetDictionary}
        morphTargetInfluences={nodes.CC_Base_Tongue001.morphTargetInfluences}
      />
      <skinnedMesh
        name="Gym_Short001"
        geometry={nodes.Gym_Short001.geometry}
        material={materials.gymsh或tb111}
        skeleton={nodes.Gym_Short001.skeleton}
        castShadow
        receiveShadow
      />
      <skinnedMesh
        name="Layered_Straight_Hair002"
        geometry={nodes.Layered_Straight_Hair002.geometry}
        material={materials['毛发透明度.003b126']}
        skeleton={nodes.Layered_Straight_Hair002.skeleton}
        castShadow
        receiveShadow
      />
      <primitive object={nodes.mixamorigHips} />
    </group>
  );
});
AnimationGroup.displayName = 'AnimationGroup';
export default AnimationGroup;
