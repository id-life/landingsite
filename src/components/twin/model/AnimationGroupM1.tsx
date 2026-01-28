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
  const { nodes, materials, animations } = useGLTF('https://resources.id.life/m1/test-v1.glb') as unknown as {
    nodes: {
      Layered_sweater: THREE.SkinnedMesh;
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
      CC_Base_EyeOcclusion001_2: THREE.SkinnedMesh;
      CC_Base_EyeOcclusion001_1: THREE.SkinnedMesh;
      CC_Base_TearLine001_2: THREE.SkinnedMesh;
      CC_Base_TearLine001_1: THREE.SkinnedMesh;
      CC_Base_Teeth_1: THREE.SkinnedMesh;
      CC_Base_Teeth_2: THREE.SkinnedMesh;
      CC_Base_Tongue001: THREE.SkinnedMesh;
      Layered_Straight_Hair: THREE.SkinnedMesh;
      Sport_sneakers: THREE.SkinnedMesh;
      Slim_Jeans: THREE.SkinnedMesh;
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
              if (m.name == '毛发透明度.002b111') {
                m.depthWrite = false;
                m.depthTest = true;
              }
              materials.push(m);
            }
          });
        } else if (mat.opacity !== undefined) {
          // 头发的层级单独处理，不然会透视
          mat.transparent = true;
          if (['基本眼睛rb122', '基本c或nearb123', '基本眼睛lb124', '基本c或nealb125'].includes(mat.name)) {
            mat.transparent = false; // 在淡出后禁用深度写入
          }
          child.renderOrder = 1; // 材质渲染顺序
          if (mat.name == '毛发透明度.002b111') {
            mat.depthWrite = false;
            mat.depthTest = true;
            child.renderOrder = 2; // 让头发材质晚于其他材质渲染
          }
          if (mat.name == 'laye红色sweaterb121') {
            mat.depthWrite = false;
            mat.depthTest = true;
            child.renderOrder = 3; // 让头发材质晚于其他材质渲染
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
        if (mat.name === '基本c或nearb123' || mat.name === '基本c或nealb125') {
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
              (object.material.name === '基本眼睛rb122' ||
                object.material.name === '基本c或nearb123' ||
                object.material.name === '基本眼睛lb124' ||
                object.material.name === '基本c或nealb125')
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
              (object.material.name === '基本眼睛rb122' ||
                object.material.name === '基本c或nearb123' ||
                object.material.name === '基本眼睛lb124' ||
                object.material.name === '基本c或nealb125')
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
      if (action) {
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
      {/* <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}> */}
      <group name="CC_Base_Body001">
        <skinnedMesh
          name="CC_Base_Body001_1"
          geometry={nodes.CC_Base_Body001_1.geometry}
          material={materials.基本皮肤头b103}
          skeleton={nodes.CC_Base_Body001_1.skeleton}
          material-metalness={0.87}
          material-roughness={0.9}
          material-color={'#ffeaea'}
        />
        <skinnedMesh
          name="CC_Base_Body001_2"
          geometry={nodes.CC_Base_Body001_2.geometry}
          material={materials.基本皮肤身体b104}
          skeleton={nodes.CC_Base_Body001_2.skeleton}
          material-metalness={0.87}
          material-roughness={0.9}
          material-color={'#ffeaea'}
        />
        <skinnedMesh
          name="CC_Base_Body001_3"
          geometry={nodes.CC_Base_Body001_3.geometry}
          material={materials.基本皮肤手臂b105}
          skeleton={nodes.CC_Base_Body001_3.skeleton}
          material-metalness={0.87}
          material-roughness={0.9}
          material-color={'#ffeaea'}
        />
        <skinnedMesh
          name="CC_Base_Body001_4"
          geometry={nodes.CC_Base_Body001_4.geometry}
          material={materials.基本皮肤腿b106}
          skeleton={nodes.CC_Base_Body001_4.skeleton}
          material-metalness={0.87}
          material-roughness={0.9}
          material-color={'#ffeaea'}
        />
        <skinnedMesh
          name="CC_Base_Body001_5"
          geometry={nodes.CC_Base_Body001_5.geometry}
          material={materials.基本指甲b107}
          skeleton={nodes.CC_Base_Body001_5.skeleton}
          material-metalness={0.87}
          material-roughness={0.9}
          material-color={'#ffeaea'}
        />
        <skinnedMesh
          name="CC_Base_Body001_6"
          geometry={nodes.CC_Base_Body001_6.geometry}
          material={materials.基本睫毛b108}
          skeleton={nodes.CC_Base_Body001_6.skeleton}
          material-metalness={0.87}
          material-roughness={0.9}
          material-color={'#ffeaea'}
        />
      </group>
      <group name="CC_Base_Eye001">
        <skinnedMesh
          name="CC_Base_Eye001_1"
          geometry={nodes.CC_Base_Eye001_1.geometry}
          material={materials.基本眼睛rb122}
          skeleton={nodes.CC_Base_Eye001_1.skeleton}
        />
        <skinnedMesh
          name="CC_Base_Eye001_2"
          geometry={nodes.CC_Base_Eye001_2.geometry}
          material={materials.基本c或nearb123}
          skeleton={nodes.CC_Base_Eye001_2.skeleton}
        />
        <skinnedMesh
          name="CC_Base_Eye001_3"
          geometry={nodes.CC_Base_Eye001_3.geometry}
          material={materials.基本眼睛lb124}
          skeleton={nodes.CC_Base_Eye001_3.skeleton}
        />
        <skinnedMesh
          name="CC_Base_Eye001_4"
          geometry={nodes.CC_Base_Eye001_4.geometry}
          material={materials.基本c或nealb125}
          skeleton={nodes.CC_Base_Eye001_4.skeleton}
        />
      </group>
      <group name="CC_Base_EyeOcclusion001">
        <skinnedMesh
          name="CC_Base_EyeOcclusion001_1"
          geometry={nodes.CC_Base_EyeOcclusion001_1.geometry}
          material={materials.基本眼部阻塞rb101}
          skeleton={nodes.CC_Base_EyeOcclusion001_1.skeleton}
        />
        <skinnedMesh
          name="CC_Base_EyeOcclusion001_2"
          geometry={nodes.CC_Base_EyeOcclusion001_2.geometry}
          material={materials.基本眼部阻塞lb102}
          skeleton={nodes.CC_Base_EyeOcclusion001_2.skeleton}
        />
      </group>
      <group name="CC_Base_TearLine001">
        <skinnedMesh
          name="CC_Base_TearLine001_1"
          geometry={nodes.CC_Base_TearLine001_1.geometry}
          material={materials.基本分裂线rb109}
          skeleton={nodes.CC_Base_TearLine001_1.skeleton}
        />
        <skinnedMesh
          name="CC_Base_TearLine001_2"
          geometry={nodes.CC_Base_TearLine001_2.geometry}
          material={materials.基本分裂线lb110}
          skeleton={nodes.CC_Base_TearLine001_2.skeleton}
        />
      </group>
      <group name="CC_Base_Teeth">
        <skinnedMesh
          name="CC_Base_Teeth_1"
          geometry={nodes.CC_Base_Teeth_1.geometry}
          material={materials.基本上齿b126}
          skeleton={nodes.CC_Base_Teeth_1.skeleton}
        />
        <skinnedMesh
          name="CC_Base_Teeth_2"
          geometry={nodes.CC_Base_Teeth_2.geometry}
          material={materials.基本下颌b127}
          skeleton={nodes.CC_Base_Teeth_2.skeleton}
        />
      </group>
      <skinnedMesh
        name="CC_Base_Tongue001"
        geometry={nodes.CC_Base_Tongue001.geometry}
        material={materials.基本舌头b120}
        skeleton={nodes.CC_Base_Tongue001.skeleton}
      />
      <skinnedMesh
        name="Layered_Straight_Hair"
        geometry={nodes.Layered_Straight_Hair.geometry}
        material={materials['毛发透明度.002b111']}
        skeleton={nodes.Layered_Straight_Hair.skeleton}
      />
      <skinnedMesh
        name="Layered_sweater"
        geometry={nodes.Layered_sweater.geometry}
        material={materials.laye红色sweaterb121}
        skeleton={nodes.Layered_sweater.skeleton}
      />
      <skinnedMesh
        name="Slim_Jeans"
        geometry={nodes.Slim_Jeans.geometry}
        material={materials.slimjeansb100}
        skeleton={nodes.Slim_Jeans.skeleton}
      />
      <skinnedMesh
        name="Sport_sneakers"
        geometry={nodes.Sport_sneakers.geometry}
        material={materials.sp或tsneakersb119}
        skeleton={nodes.Sport_sneakers.skeleton}
      />
      <primitive object={nodes.mixamorigHips} />
    </group>
  );
});
AnimationGroup.displayName = 'AnimationGroup';
export default AnimationGroup;
