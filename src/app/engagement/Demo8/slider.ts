// import gsap from 'gsap';
// import * as THREE from 'three';
//
// export class Slider {
//   constructor() {
//     this.bindAll();
//
//     this.vert = `
//     varying vec2 vUv;
//     void main() {
//       vUv = uv;
//       gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//     }
//     `;
//
//     this.frag = `
//     varying vec2 vUv;
//
//     uniform sampler2D texture1;
//     uniform sampler2D texture2;
//     uniform sampler2D disp;
//
//     uniform float dispPower;
//     uniform float intensity;
//
//     uniform vec2 size;
//     uniform vec2 res;
//
//     vec2 backgroundCoverUv( vec2 screenSize, vec2 imageSize, vec2 uv ) {
//       float screenRatio = screenSize.x / screenSize.y;
//       float imageRatio = imageSize.x / imageSize.y;
//       vec2 newSize = screenRatio < imageRatio
//           ? vec2(imageSize.x * (screenSize.y / imageSize.y), screenSize.y)
//           : vec2(screenSize.x, imageSize.y * (screenSize.x / imageSize.x));
//       vec2 newOffset = (screenRatio < imageRatio
//           ? vec2((newSize.x - screenSize.x) / 2.0, 0.0)
//           : vec2(0.0, (newSize.y - screenSize.y) / 2.0)) / newSize;
//       return uv * screenSize / newSize + newOffset;
//     }
//
//     void main() {
//       vec2 uv = vUv;
//
//       vec4 disp = texture2D(disp, uv);
//       vec2 dispVec = vec2(disp.x, disp.y);
//
//       vec2 distPos1 = uv + (dispVec * intensity * dispPower);
//       vec2 distPos2 = uv + (dispVec * -(intensity * (1.0 - dispPower)));
//
//       vec4 _texture1 = texture2D(texture1, distPos1);
//       vec4 _texture2 = texture2D(texture2, distPos2);
//
//       gl_FragColor = mix(_texture1, _texture2, dispPower);
//     }
//     `;
//
//     this.el = document.querySelector('.js-slider');
//     this.inner = this.el.querySelector('.js-slider__inner');
//
//     this.renderer = null;
//     this.scene = null;
//     this.clock = null;
//     this.camera = null;
//
//     this.images = [
//       '/imgs/engagement/talk-01.webp',
//       '/imgs/engagement/talk-02.webp',
//       '/imgs/engagement/talk-03.webp',
//       '/imgs/engagement/talk-04.webp',
//     ];
//
//     this.data = {
//       current: 0,
//       next: 1,
//       total: this.images.length - 1,
//       delta: 0,
//     };
//
//     this.state = {
//       animating: false,
//       text: false,
//       initial: true,
//     };
//
//     this.textures = null;
//
//     this.init();
//   }
//
//   bindAll() {
//     ['render', 'nextSlide'].forEach((fn) => (this[fn] = this[fn].bind(this)));
//   }
//
//   cameraSetup() {
//     this.camera = new THREE.OrthographicCamera(
//       this.el.offsetWidth / -2,
//       this.el.offsetWidth / 2,
//       this.el.offsetHeight / 2,
//       this.el.offsetHeight / -2,
//       1,
//       1000,
//     );
//
//     this.camera.lookAt(this.scene.position);
//     this.camera.position.z = 1;
//   }
//
//   setup() {
//     this.scene = new THREE.Scene();
//     this.clock = new THREE.Clock(true);
//
//     this.renderer = new THREE.WebGLRenderer({ alpha: true });
//     this.renderer.setPixelRatio(window.devicePixelRatio);
//     this.renderer.setSize(this.el.offsetWidth, this.el.offsetHeight);
//
//     this.inner.appendChild(this.renderer.domElement);
//   }
//
//   loadTextures() {
//     const loader = new THREE.TextureLoader();
//     loader.crossOrigin = '';
//
//     this.textures = [];
//     this.images.forEach((image, index) => {
//       const texture = loader.load(image + '?v=' + Date.now(), this.render);
//
//       texture.minFilter = THREE.LinearFilter;
//       texture.generateMipmaps = false;
//
//       if (index === 0 && this.mat) {
//         this.mat.uniforms.size.value = [texture.image.naturalWidth, texture.image.naturalHeight];
//       }
//
//       this.textures.push(texture);
//     });
//
//     this.disp = loader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/58281/rock-_disp.png', this.render);
//     this.disp.magFilter = this.disp.minFilter = THREE.LinearFilter;
//     this.disp.wrapS = this.disp.wrapT = THREE.RepeatWrapping;
//   }
//
//   createMesh() {
//     this.mat = new THREE.ShaderMaterial({
//       uniforms: {
//         dispPower: { type: 'f', value: 0.0 },
//         intensity: { type: 'f', value: 0.5 },
//         res: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
//         size: { value: new THREE.Vector2(1, 1) },
//         texture1: { type: 't', value: this.textures[0] },
//         texture2: { type: 't', value: this.textures[1] },
//         disp: { type: 't', value: this.disp },
//       },
//       transparent: true,
//       vertexShader: this.vert,
//       fragmentShader: this.frag,
//     });
//
//     const geometry = new THREE.PlaneGeometry(this.el.offsetWidth, this.el.offsetHeight, 1);
//
//     const mesh = new THREE.Mesh(geometry, this.mat);
//
//     this.scene.add(mesh);
//   }
//
//   transitionNext() {
//     gsap.to(this.mat.uniforms.dispPower, {
//       value: 1,
//       duration: 2.5,
//       // ease: Expo.easeInOut,
//       onUpdate: this.render,
//       onComplete: () => {
//         this.mat.uniforms.dispPower.value = 0.0;
//         this.changeTexture();
//         this.render.bind(this);
//         this.state.animating = false;
//       },
//     });
//   }
//
//   prevSlide() {}
//
//   nextSlide() {
//     if (this.state.animating) return;
//
//     this.state.animating = true;
//
//     this.transitionNext();
//
//     this.data.current = this.data.current === this.data.total ? 0 : this.data.current + 1;
//     this.data.next = this.data.current === this.data.total ? 0 : this.data.current + 1;
//   }
//
//   changeTexture() {
//     this.mat.uniforms.texture1.value = this.textures[this.data.current];
//     this.mat.uniforms.texture2.value = this.textures[this.data.next];
//   }
//
//   listeners() {
//     window.addEventListener('wheel', this.nextSlide, { passive: true });
//   }
//
//   render() {
//     this.renderer.render(this.scene, this.camera);
//   }
//
//   init() {
//     this.setup();
//     this.cameraSetup();
//     this.loadTextures();
//     this.createMesh();
//     this.render();
//     this.listeners();
//   }
// }
