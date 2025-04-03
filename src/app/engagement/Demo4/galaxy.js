// import * as THREE from "https://cdn.skypack.dev/three@0.149.0";

import * as dat from "https://cdn.skypack.dev/dat.gui@0.7.9";
import { OrbitControls } from "https://unpkg.com/three@0.149.0/examples/jsm/controls/OrbitControls.js";

/**
 * Base
 */
// Debug
const gui = new dat.GUI({
 width: 350
});
gui.close();
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Texture
// const textureLoader= new THREE.TextureLoader();
// const texture = (textureLoader.load('/textures/particles/9.png') ;

// Galaxy
const parameters = {};
parameters.count = 100000;
parameters.size = 0.01;
parameters.radius = 20;
parameters.branches = 10;
parameters.spin = 5;
parameters.randomness = 10;
parameters.randomnessPower = 0; //try 0... cool af
parameters.innerColor = "#ff6030";
parameters.outerColor = "#070041";

let geometry = null;
let material = null;
let points = null;

const generateGalaxy = () => {
 if (points !== null) {
  geometry.dispose();
  material.dispose();
  scene.remove(points);
 }

 geometry = new THREE.BufferGeometry();

 const positions = new Float32Array(parameters.count * 3);
 const colors = new Float32Array(parameters.count * 3);

 const insideColor = new THREE.Color(parameters.innerColor);
 const outsideColor = new THREE.Color(parameters.outerColor);

 insideColor.lerp(outsideColor, 0.05);

 for (let i = 0; i < parameters.count; i++) {
  const i3 = i * 3;

  const radius = Math.random() * parameters.radius;
  const spinAngle = radius * parameters.spin;
  const branchAngle =
   ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

  const randomY =
   Math.pow(Math.random(), parameters.randomnessPower) *
   (Math.random() < 0.5 ? 1 : -1) *
   parameters.randomness;
  const randomX =
   Math.pow(Math.random(), parameters.randomnessPower) *
   (Math.random() < 0.5 ? 1 : -1) *
   parameters.randomness;
  const randomZ =
   Math.pow(Math.random(), parameters.randomnessPower) *
   (Math.random() < 0.5 ? 1 : -1) *
   parameters.randomness;

  positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX;
  positions[i3 + 1] = Math.abs(randomY) * Math.tan(radius); //try changing  operations signs for cooler effect
  positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

  //color

  const mixedColor = insideColor.clone();
  mixedColor.lerp(outsideColor, radius / parameters.radius);

  colors[i3 + 0] = mixedColor.r;
  colors[i3 + 1] = mixedColor.g;
  colors[i3 + 2] = mixedColor.b;
 }

 geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

 geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

 // Materials
 material = new THREE.PointsMaterial({
  size: parameters.size,
  sizeAttenuation: true,
  transparent: true,
  // alphaMap : texture,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true
 });

 // Points
 points = new THREE.Points(geometry, material);

 scene.add(points);
};

generateGalaxy();

// console.log(sc)
gui
 .add(parameters, "count", 1000, 500000, 1000)
 .name("Galaxy Count")
 .onFinishChange(generateGalaxy);
gui
 .add(parameters, "size", 0.01, 0.1, 0.001)
 .name("Galaxy Size")
 .onFinishChange(generateGalaxy);
gui
 .add(parameters, "radius", 1, 20, 1)
 .name("Galaxy Radius")
 .onFinishChange(generateGalaxy);
gui
 .add(parameters, "branches", 3, 10, 1)
 .name("Galaxy Branches")
 .onFinishChange(generateGalaxy);
gui
 .add(parameters, "spin", -5, 5, 1)
 .name("Galaxy Spin")
 .onFinishChange(generateGalaxy);
gui
 .add(parameters, "randomness", 0, 10, 0.1)
 .name("Galaxy Randomness")
 .onFinishChange(generateGalaxy);
gui
 .add(parameters, "randomnessPower", 0, 10, 0.1)
 .name("Galaxy Randomness Power")
 .onFinishChange(generateGalaxy);
gui
 .addColor(parameters, "innerColor")
 .name("Galaxy Inside Color")
 .onFinishChange(generateGalaxy);
gui
 .addColor(parameters, "outerColor")
 .name("Galaxy Outside Color")
 .onFinishChange(generateGalaxy);
/**
 * Sizes
 */
const sizes = {
 width: window.innerWidth,
 height: window.innerHeight
};

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
 75,
 sizes.width / sizes.height,
 0.1,
 1000
);
camera.position.x = 0;
camera.position.y = -50;
camera.position.z = 0;
// gui.add(camera.position,'z',-100,50,1)
camera.lookAt(points);
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
 canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

window.addEventListener("resize", () => {
 // Update sizes
 sizes.width = window.innerWidth;
 sizes.height = window.innerHeight;

 // Update camera
 camera.aspect = sizes.width / sizes.height;
 camera.updateProjectionMatrix();

 // Update renderer
 renderer.setSize(sizes.width, sizes.height);
 renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Controls
var controls;
controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
// controls.autoRotate = true

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
 const elapsedTime = clock.getElapsedTime();

 // Update Points
 points.rotation.y = elapsedTime * 0.1;

 // Update controls
 controls.update();

 // Render
 renderer.render(scene, camera);

 // Call tick again on the next frame
 window.requestAnimationFrame(tick);
};

tick();
