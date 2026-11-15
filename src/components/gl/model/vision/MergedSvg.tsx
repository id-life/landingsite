'use client';

import { useLoader, type ThreeElements } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { SVGLoader } from 'three-stdlib';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/**
 * An SVG's filled shapes as one mesh per fill colour (MOT-06). drei's <Svg> draws one mesh, so one draw call, per
 * shape: the phone wordmark and tagline cost several hundred draw calls a frame (twice: the glass dragon's
 * transmission pass renders the scene again). Same output as <Svg> for fill-only artwork: flipped Y, MeshBasic
 * fill colour and opacity, transparent, double-sided, no depth write, in document order.
 */
export default function MergedSvg({ src, ...props }: { src: string } & ThreeElements['object3D']) {
  const svg = useLoader(SVGLoader, src);
  const layers = useMemo(() => {
    const byFill = new Map<string, { color: string; opacity: number; parts: THREE.BufferGeometry[] }>();
    for (const path of svg.paths) {
      const style = path.userData?.style;
      if (!style || style.fill === undefined || style.fill === 'none') continue;
      const key = `${style.fill}|${style.fillOpacity}`;
      const layer = byFill.get(key) ?? {
        color: String(style.fill),
        opacity: Number(style.fillOpacity ?? 1),
        parts: [] as THREE.BufferGeometry[],
      };
      for (const shape of SVGLoader.createShapes(path)) layer.parts.push(new THREE.ShapeGeometry(shape));
      byFill.set(key, layer);
    }
    return [...byFill.values()].map(({ color, opacity, parts }) => {
      const geometry = mergeGeometries(parts) ?? new THREE.BufferGeometry();
      parts.forEach((part) => part.dispose());
      return { color, opacity, geometry };
    });
  }, [svg]);
  useEffect(() => () => layers.forEach((layer) => layer.geometry.dispose()), [layers]);

  return (
    <object3D {...props}>
      <object3D scale={[1, -1, 1]}>
        {layers.map((layer, i) => (
          <mesh key={i} geometry={layer.geometry} renderOrder={i}>
            <meshBasicMaterial
              color={layer.color}
              opacity={layer.opacity}
              transparent
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        ))}
      </object3D>
    </object3D>
  );
}
