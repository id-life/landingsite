import * as THREE from 'three';

export const FluidShader = {
  uniforms: {
    tDiffuse: { value: null },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uTime: { value: 0 },
    uRadius: { value: 0.3 },
    uStrength: { value: 0.15 },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uVelocity: { value: new THREE.Vector2(0, 0) },
  },

  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 uMouse;
    uniform float uTime;
    uniform float uRadius;
    uniform float uStrength;
    uniform vec2 uResolution;
    uniform vec2 uVelocity;
    varying vec2 vUv;

    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    vec2 fade(vec2 t) {
      return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
    }

    float perlinNoise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      vec2 u = fade(f);

      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));

      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    float fbm(vec2 st) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      for(int i = 0; i < 4; i++) {
        value += amplitude * perlinNoise(st * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }

    void main() {
      vec2 uv = vUv;
      vec2 center = uMouse;
      float dist = distance(center, uv);

      // 计算速度场影响
      vec2 velocity = normalize(uv - center) * 0.02;

      // 添加涡度
      float angle = atan(velocity.y, velocity.x);
      float vorticity = sin(angle * 2.0 + uTime) * 0.2;
      velocity = vec2(
        velocity.x * cos(vorticity) - velocity.y * sin(vorticity),
        velocity.x * sin(vorticity) + velocity.y * cos(vorticity)
      );

      // 使用fbm创建自然的水波纹
      float noise1 = fbm((uv - center) * 8.0 + uTime * 0.2);
      float noise2 = fbm((uv - center) * 6.0 - uTime * 0.1);

      // 创建流体运动
      vec2 noiseVec = vec2(
        noise1 * 2.0 - 1.0,
        noise2 * 2.0 - 1.0
      ) * 0.1;

      // 添加惯性
      vec2 inertia = velocity * (1.0 + noise1 * 0.3);

      // 组合所有效果
      float strength = 1.0 - smoothstep(0.0, uRadius * 1.2, dist);
      vec2 offset = (inertia + noiseVec) * strength * uStrength;

      // 添加波纹效果
      float ripple = sin(dist * 20.0 - uTime * 1.0) * 0.5 + 0.5;
      ripple *= exp(-dist * 8.0); // 波纹衰减
      offset *= (1.0 + ripple * 0.2);

      // 平滑过渡
      offset *= smoothstep(uRadius, 0.0, dist);

      vec2 distortedUV = uv - offset;
      vec4 color = texture2D(tDiffuse, distortedUV);

      // 添加水波光效
      float highlight = ripple * strength * 0.1;
      vec3 waterColor = vec3(0.2, 0.3, 0.4);
      vec3 highlightColor = vec3(0.8, 0.85, 0.9);
      color.rgb += waterColor * (noise1 * 0.1) + highlightColor * highlight;

      gl_FragColor = color;
      gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(1.0 / 2.2));
    }
  `,
};
