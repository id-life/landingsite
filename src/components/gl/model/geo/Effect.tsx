import React, { useEffect, useRef } from 'react';
import { Effects } from '@react-three/drei';
import { WaterPass } from './shaders/WaterPass';
import { extend, useThree } from '@react-three/fiber';
import { ShaderPass, RenderPass, GammaCorrectionShader } from 'three-stdlib';

extend({ ShaderPass, RenderPass, WaterPass });

export default function Effect() {
  const composer = useRef<any>(null);
  const water = useRef<any>(null);
  const { gl, size, camera, scene } = useThree();

  useEffect(() => {
    if (!composer.current) return;
    composer.current.setSize(size.width, size.height);
  }, [size]);

  return (
    <Effects ref={composer} args={[gl]} disableGamma disableRenderPass>
      <renderPass attach="passes" scene={scene} camera={camera} />
      <shaderPass attach="passes" args={[GammaCorrectionShader]} />
      <waterPass attach="passes" ref={water} />
    </Effects>
  );
}
