import { OrbitControls, Points } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useEffect, useMemo, useRef, useState } from 'react';

// 硬编码所有默认参数
const parameters = {
  count: 100000,
  size: 0.01,
  radius: 20,
  branches: 10,
  spin: 5,
  randomness: 10,
  randomnessPower: 0,
  innerColor: '#ff6030',
  outerColor: '#070041',
};

export const Galaxy = () => {
  const [points, setPoints] = useState<any>()
  const [geometry, setGeometry] = useState<any>()
  const [material, setMaterial] = useState<any>()


  useEffect(() => {
    const newGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);

    const insideColor = new THREE.Color(parameters.innerColor);
    const outsideColor = new THREE.Color(parameters.outerColor);

    for (let i = 0; i < parameters.count; i++) {
      const i3 = i * 3;
      const radius = Math.random() * parameters.radius;
      const spinAngle = radius * parameters.spin;
      const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

      const randomY =
        Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness;
      const randomX =
        Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness;
      const randomZ =
        Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness;

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = Math.abs(randomY) * Math.tan(radius);
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      const mixedColor = insideColor.clone().lerp(outsideColor, radius / parameters.radius);
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    newGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    newGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const newMaterial = new THREE.PointsMaterial({
      size: parameters.size,
      sizeAttenuation: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });

    setGeometry(newGeometry)
    setMaterial(newMaterial)
    setPoints(new THREE.Points(newGeometry, newMaterial))
  }, []);

  useFrame((state, delta) => {
    if (points) points.rotation.y += delta * 0.1
  })

  return points ? <primitive object={points} /> : null
};
export default function Demo4() {
  return (
    <Canvas camera={{ position: [0, -50, 0], fov: 75 }} gl={{ powerPreference: 'high-performance', alpha: true }}>
      <Galaxy />
      <OrbitControls enableDamping enableZoom={false} />
    </Canvas>
  );
}
