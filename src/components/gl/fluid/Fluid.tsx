// remake from https://github.com/whatisjery/react-fluid-distortion
import { createPortal, useFrame, useThree } from '@react-three/fiber';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Camera, Color, DoubleSide, Mesh, Scene, Texture, Vector2, Vector3 } from 'three';
import { ShaderPass } from 'three/examples/jsm/Addons.js';
import { Effect as FluidEffect } from './effect';
import { useFBOs } from './hooks/useFBOs';
import { useMaterials } from './hooks/useMaterials';
import { Props } from './types';
import { OPTS } from './constant';
import { usePointer } from './hooks/usePointer';
import { BlendFunction } from 'postprocessing';
import { isReducedMotion, onReducedMotionChange } from '@/motion/preference';

/** Frames after the last splat until the dye has faded out (0.96^180 is below 0.1 %). */
const SETTLE_FRAMES = 180;

type Uniforms = {
  uColor: Vector3 | Color;
  uPointer: Vector2;
  uTarget: Texture | null;
  uVelocity: Texture;
  uCurl: Texture;
  uTexture: Texture;
  uPressure: Texture;
  uDivergence: Texture;
  uSource: Texture;
  uRadius: number;
  uClearValue: number;
  uCurlValue: number;
  uDissipation: number;
};

export const Fluid = ({
  blend = OPTS.blend,
  force = OPTS.force,
  radius = OPTS.radius,
  curl = OPTS.curl,
  swirl = OPTS.swirl,
  intensity = OPTS.intensity,
  distortion = OPTS.distortion,
  fluidColor = OPTS.fluidColor,
  backgroundColor = OPTS.backgroundColor,
  showBackground = OPTS.showBackground,
  rainbow = OPTS.rainbow,
  pressure = OPTS.pressure,
  densityDissipation = OPTS.densityDissipation,
  velocityDissipation = OPTS.velocityDissipation,
  blendFunction = BlendFunction.NORMAL,
  simRes = OPTS.simRes,
}: Props & { simRes?: number }) => {
  const size = useThree((three) => three.size);
  const gl = useThree((three) => three.gl);

  const bufferScene = useMemo(() => new Scene(), []);
  const bufferCamera = useMemo(() => new Camera(), []);

  const meshRef = useRef<Mesh>(null);
  const postRef = useRef<ShaderPass>(null);

  const FBOs = useFBOs(simRes);
  const materials = useMaterials();
  const { splatStack } = usePointer({ force });

  const setShaderMaterial = useCallback(
    (name: keyof ReturnType<typeof useMaterials>) => {
      if (!meshRef.current) return;

      // Swapping the mesh's material is enough; needsUpdate here re-validated the program on every pass.
      meshRef.current.material = materials[name];
      meshRef.current.material.side = DoubleSide;
    },
    [materials],
  );

  const setRenderTarget = useCallback(
    (name: keyof ReturnType<typeof useFBOs>) => {
      const target = FBOs[name];

      if ('write' in target) {
        gl.setRenderTarget(target.write);
        gl.clear();
        gl.render(bufferScene, bufferCamera);
        target.swap();
      } else {
        gl.setRenderTarget(target);
        gl.clear();
        gl.render(bufferScene, bufferCamera);
      }
    },
    [bufferCamera, bufferScene, FBOs, gl],
  );

  const setUniforms = useCallback(
    <K extends keyof Uniforms>(material: keyof ReturnType<typeof useMaterials>, uniform: K, value: Uniforms[K]) => {
      const mat = materials[material];

      if (mat && mat.uniforms[uniform]) {
        mat.uniforms[uniform].value = value;
      }
    },
    [materials],
  );

  // MOT-03: frames since the last pointer splat. The dye fades by densityDissipation per frame (0.96: under 0.1 % left
  // after SETTLE_FRAMES), so past that the solver's dozen passes per frame change nothing visible and are skipped.
  const quietFramesRef = useRef(SETTLE_FRAMES);

  // Reduced motion (MOT-02): the pointer leaves no ink. Ink is motion that follows the pointer, and with reduced
  // motion the canvas renders a still frame and stops once a section change has settled (FrameDriver), so the ink
  // painted during the change never faded: a pale blotch behind the header on Connect and stains on the first screen
  // after it. A switch to reduced motion also wipes the dye already there.
  useEffect(
    () =>
      onReducedMotionChange((reduced) => {
        if (!reduced) return;
        splatStack.length = 0;
        for (const target of [FBOs.density.read, FBOs.density.write, FBOs.velocity.read, FBOs.velocity.write]) {
          gl.setRenderTarget(target);
          gl.clear();
        }
        gl.setRenderTarget(null);
        quietFramesRef.current = SETTLE_FRAMES;
      }),
    [FBOs, gl, splatStack],
  );

  useFrame(({ gl }) => {
    if (!meshRef.current || !postRef.current) return;
    if (isReducedMotion()) splatStack.length = 0;
    if (splatStack.length) quietFramesRef.current = 0;
    else if (quietFramesRef.current >= SETTLE_FRAMES) return;
    quietFramesRef.current += 1;

    for (let i = splatStack.length - 1; i >= 0; i--) {
      const { mouseX, mouseY, velocityX, velocityY } = splatStack[i];

      setShaderMaterial('splat');
      setUniforms('splat', 'uTarget', FBOs.velocity.read.texture);
      setUniforms('splat', 'uPointer', new Vector2(mouseX, mouseY));
      setUniforms('splat', 'uColor', new Vector3(velocityX, velocityY, 10.0));
      setUniforms('splat', 'uRadius', radius / 100.0);
      setRenderTarget('velocity');
      setUniforms('splat', 'uTarget', FBOs.density.read.texture);
      setRenderTarget('density');

      splatStack.pop();
    }

    setShaderMaterial('curl');
    setUniforms('curl', 'uVelocity', FBOs.velocity.read.texture);
    setRenderTarget('curl');

    setShaderMaterial('vorticity');
    setUniforms('vorticity', 'uVelocity', FBOs.velocity.read.texture);
    setUniforms('vorticity', 'uCurl', FBOs.curl.texture);
    setUniforms('vorticity', 'uCurlValue', curl);
    setRenderTarget('velocity');

    setShaderMaterial('divergence');
    setUniforms('divergence', 'uVelocity', FBOs.velocity.read.texture);
    setRenderTarget('divergence');

    setShaderMaterial('clear');
    setUniforms('clear', 'uTexture', FBOs.pressure.read.texture);
    setUniforms('clear', 'uClearValue', pressure);
    setRenderTarget('pressure');

    setShaderMaterial('pressure');
    setUniforms('pressure', 'uDivergence', FBOs.divergence.texture);

    for (let i = 0; i < swirl; i++) {
      setUniforms('pressure', 'uPressure', FBOs.pressure.read.texture);
      setRenderTarget('pressure');
    }

    setShaderMaterial('gradientSubstract');
    setUniforms('gradientSubstract', 'uPressure', FBOs.pressure.read.texture);
    setUniforms('gradientSubstract', 'uVelocity', FBOs.velocity.read.texture);
    setRenderTarget('velocity');

    setShaderMaterial('advection');
    setUniforms('advection', 'uVelocity', FBOs.velocity.read.texture);
    setUniforms('advection', 'uSource', FBOs.velocity.read.texture);
    setUniforms('advection', 'uDissipation', velocityDissipation);

    setRenderTarget('velocity');
    setUniforms('advection', 'uVelocity', FBOs.velocity.read.texture);
    setUniforms('advection', 'uSource', FBOs.density.read.texture);
    setUniforms('advection', 'uDissipation', densityDissipation);

    setRenderTarget('density');

    gl.setRenderTarget(null);
    gl.clear();
  });

  return (
    <>
      {createPortal(
        <mesh ref={meshRef} scale={[size.width, size.height, 1]}>
          <planeGeometry args={[2, 2, 10, 10]} />
          <shaderMaterial side={DoubleSide} transparent={true} depthWrite={false} />
        </mesh>,
        bufferScene,
      )}

      <FluidEffect
        blendFunction={blendFunction}
        intensity={intensity * 0.0001}
        rainbow={rainbow}
        distortion={distortion * 0.001}
        backgroundColor={backgroundColor}
        blend={blend * 0.01}
        fluidColor={fluidColor}
        showBackground={showBackground}
        ref={postRef}
        tFluid={FBOs.density.read.texture}
      />
    </>
  );
};
