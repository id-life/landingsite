import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { EffectComposer, RenderPass, ShaderPass } from 'three/examples/jsm/Addons.js';
import { useControls } from 'leva';
import { FluidShader } from '../shaders/FluidShader';

export function FluidEffect() {
  const { gl, scene, camera, size } = useThree();
  const composer = useRef<EffectComposer>();
  const fluidPass = useRef<ShaderPass>();
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));
  const lastMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const velocity = useRef(new THREE.Vector2(0, 0));

  // 添加 leva 控制
  const controls = useControls('流体效果设置', {
    velocityDissipation: {
      value: 0.98,
      min: 0,
      max: 1,
      step: 0.01,
      label: '速度衰减',
      description: '控制流体运动速度的衰减程度',
    },
    densityDissipation: {
      value: 0.97,
      min: 0,
      max: 1,
      step: 0.01,
      label: '密度衰减',
      description: '控制流体颜色密度的衰减程度',
    },
    pressureDissipation: {
      value: 0.8,
      min: 0,
      max: 1,
      step: 0.01,
      label: '压力衰减',
      description: '控制流体压力的衰减速度',
    },
    pressureIterations: {
      value: 20,
      min: 1,
      max: 50,
      step: 1,
      label: '压力迭代次数',
      description: '压力求解的迭代次数，越高越精确但性能消耗更大',
    },
    curlStrength: {
      value: 20,
      min: 0,
      max: 50,
      step: 1,
      label: '涡度强度',
      description: '控制流体旋转运动的强度',
    },
    splatRadius: {
      value: 0.25,
      min: 0.1,
      max: 1,
      step: 0.01,
      label: '喷溅半径',
      description: '鼠标影响的范围大小',
    },
    splatForce: {
      value: 6000,
      min: 1000,
      max: 10000,
      step: 100,
      label: '喷溅力度',
      description: '鼠标移动产生的力度大小',
    },
    fluidRadius: {
      value: 0.3,
      min: 0.1,
      max: 1,
      step: 0.01,
      label: '流体半径',
      description: '流体粒子的作用半径',
    },
    fluidStrength: {
      value: 0.15,
      min: 0.01,
      max: 0.5,
      step: 0.01,
      label: '流体强度',
      description: '流体效果的整体强度',
    },
  });

  // 配置参数
  const config = useMemo(
    () => ({
      VELOCITY_DISSIPATION: controls.velocityDissipation,
      DENSITY_DISSIPATION: controls.densityDissipation,
      PRESSURE_DISSIPATION: controls.pressureDissipation,
      PRESSURE_ITERATIONS: controls.pressureIterations,
      CURL_STRENGTH: controls.curlStrength,
      SPLAT_RADIUS: controls.splatRadius,
      SPLAT_FORCE: controls.splatForce,
    }),
    [controls],
  );

  useEffect(() => {
    composer.current = new EffectComposer(gl);
    const renderPass = new RenderPass(scene, camera);
    composer.current.addPass(renderPass);

    gl.outputColorSpace = THREE.SRGBColorSpace;

    fluidPass.current = new ShaderPass(FluidShader);
    fluidPass.current.uniforms.uResolution.value.set(size.width, size.height);
    composer.current.addPass(fluidPass.current);

    const handleMouseMove = (event: MouseEvent) => {
      // 保存上一帧的鼠标位置
      lastMouse.current.copy(mouse.current);

      // 更新当前鼠标位置
      const x = event.clientX / window.innerWidth;
      const y = 1 - event.clientY / window.innerHeight;
      mouse.current.set(x, y);

      // 计算速度
      velocity.current.x = (mouse.current.x - lastMouse.current.x) * config.SPLAT_FORCE;
      velocity.current.y = (mouse.current.y - lastMouse.current.y) * config.SPLAT_FORCE;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [gl, scene, camera, size, config]);

  useEffect(() => {
    if (composer.current) {
      composer.current.setSize(size.width, size.height);
    }
  }, [size]);

  useFrame((state) => {
    if (composer.current && fluidPass.current) {
      // 更新流体模拟
      fluidPass.current.uniforms.uTime.value = state.clock.elapsedTime;
      fluidPass.current.uniforms.uMouse.value.copy(mouse.current);

      // 应用速度和衰减
      fluidPass.current.uniforms.uVelocity.value.copy(velocity.current);
      velocity.current.multiplyScalar(config.VELOCITY_DISSIPATION);

      composer.current.render();
    }
  }, 1);

  return null;
}
