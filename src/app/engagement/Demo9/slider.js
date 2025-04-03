import * as twgl from 'twgl.js';
import gsap from 'gsap';
import * as m3 from 'm3.js';


class WebGL {
  constructor() {
    this.canvas = document.querySelector('#canvas');
    this.gl = canvas.getContext('webgl');
    this.textures = [
      '/imgs/engagement/talk-01.webp',
      '/imgs/engagement/talk-02.webp',
      '/imgs/engagement/talk-03.webp',
      '/imgs/engagement/talk-04.webp',
    ];

    this.isClicked = false;
    this.index = 0;

    this.ease = 1;
    this.duration = 1;

    this.update = this.update.bind(this);

    this.init();
  }

  init() {
    twgl.setDefaults({
      textureColor: [0, 0, 0, 0], // make initial color transparent black
    });

    this.textLoaded = [];

    for (let tex of this.textures) {
      this.textLoaded.push(
        twgl.createTexture(this.gl, {
          src: tex,
        }),
      );
    }

    this.originalImage = { width: 1, height: 1 }; // replaced after loading
    const text0 = twgl.createTexture(
      this.gl,
      {
        src: this.textures[0],
      },
      (err, texture, source) => {
        this.originalImage = source;
      },
    );

    this.uniforms = {
      u_text0: this.textLoaded[0],
      u_text1: this.textLoaded[1],
      u_matrix: '',
      u_res: [this.gl.canvas.clientWidth, this.gl.canvas.clientHeight],
      u_anim: 0,
    };

    // compile shaders, link program, lookup location
    this.programInfo = twgl.createProgramInfo(this.gl, [
      `
     attribute vec2 position;
  attribute vec2 texcoord;

  uniform mat3 u_matrix;

  varying vec2 v_texcoord;

  void main() {
     gl_Position = vec4(u_matrix * vec3(position, 1), 1);
     v_texcoord = texcoord;
  }
  `,
      `
  precision mediump float;

  uniform float u_time;
  uniform vec2 u_res;
  uniform vec2 u_mouse;
  uniform float u_anim;

  // our textures
  uniform sampler2D u_text0;
  uniform sampler2D u_text1;

  // the texcoords passed in from the vertex shader.
  varying vec2 v_texcoord;

  void main() {
     vec2 uv = v_texcoord;
    
     float displaceAmount = 0.3;
     float blend0 = u_anim;
     float blend1 = 1. - u_anim;

     vec4 depth0 = texture2D(u_text0, uv);
     vec4 depth1 = texture2D(u_text1, uv);

     float t0 = depth0.r * displaceAmount * blend0 * 2.;
     float t1 = depth1.r * displaceAmount * blend1 * 2.;
    
     vec4 color0 = texture2D(u_text0, vec2(uv.x, uv.y - t0)) * blend1;  
     vec4 color1 = texture2D(u_text1, vec2(uv.x, uv.y - t1)) * blend0;
    
     gl_FragColor = color0.bbra * blend0 + color0 + color1.bbra * blend1 + color1;
  }
  `,
    ]);

    // calls gl.createBuffer, gl.bindBuffer, gl.bufferData for a quad
    this.bufferInfo = twgl.primitives.createXYQuadBufferInfo(this.gl);

    this.update();
  }

  currentTexture(index) {
    this.isClicked = true;

    this.uniforms.u_text1 = this.textLoaded[index];

    gsap.fromTo(
      this.uniforms,
      { u_anim: 0 },
      {
        u_anim: 1,
        ease: this.ease,
        onUpdate: () => {},
        onComplete: () => {
          this.uniforms.u_text0 = this.textLoaded[index];
          this.isClicked = false;
        },
      },
    );
  }

  update() {
    twgl.resizeCanvasToDisplaySize(this.gl.canvas);

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.gl.useProgram(this.programInfo.program);

    // calls gl.bindBuffer, gl.enableVertexAttribArray, gl.vertexAttribPointer
    twgl.setBuffersAndAttributes(this.gl, this.programInfo, this.bufferInfo);

    const canvasAspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
    const imageAspect = this.originalImage.width / this.originalImage.height;
    let mat = m3.scaling(imageAspect / canvasAspect, -1);
    // this assumes we want to fill vertically
    let horizontalDrawAspect = imageAspect / canvasAspect;
    let verticalDrawAspect = -1;
    // does it fill horizontally?

    if (horizontalDrawAspect < 1) {
      // no it does not so scale so we fill horizontally and
      // adjust vertical to match
      verticalDrawAspect /= horizontalDrawAspect;
      horizontalDrawAspect = 1;
    }
    mat = m3.scaling(horizontalDrawAspect, verticalDrawAspect);

    this.uniforms.u_matrix = mat;

    // calls gl.activeTexture, gl.bindTexture, gl.uniformXXX
    twgl.setUniforms(this.programInfo, this.uniforms);

    // calls gl.drawArrays or gl.drawElements
    twgl.drawBufferInfo(this.gl, this.bufferInfo);

    requestAnimationFrame(this.update);
  }

  draw() {}
}

// Here's how to modify the Slider class to use scroll events instead of click events

export class Slider {
  constructor(opts) {
    this.slider = document.querySelector(opts.el);
    this.containerControls = this.slider.querySelector('.slider-controls__circles');
    this.controls = this.containerControls.querySelectorAll('.slider-controls__item');

    this.duration = opts.duration;
    this.ease = opts.ease;

    this.lastIndex = 0;
    this.index = 0;

    // Add scroll-related properties
    this.scrollTimeout = null;
    this.scrollThreshold = opts.scrollThreshold || 100; // Adjust sensitivity
    this.lastScrollPosition = 0;

    this.init();
  }

  init() {
    this.webgl = new WebGL();
    this.webgl.ease = this.ease;
    this.webgl.duration = this.duration;

    this.initEvents();
  }

  initEvents() {
    // Replace click event with scroll event
    window.addEventListener('scroll', (e) => this.handleScroll(e));
  }

  handleScroll(e) {
    // Clear previous timeout to prevent multiple rapid executions
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    // Set a timeout to debounce the scroll event
    this.scrollTimeout = setTimeout(() => {
      const currentScrollPosition = window.scrollY;

      // Determine scroll direction
      if (Math.abs(currentScrollPosition - this.lastScrollPosition) < this.scrollThreshold) {
        return; // Not enough scrolling to trigger a change
      }

      // Calculate new index based on scroll direction
      if (currentScrollPosition > this.lastScrollPosition) {
        // Scrolling down - move to next slide
        this.index = Math.min(this.index + 1, this.controls.length - 1);
      } else {
        // Scrolling up - move to previous slide
        this.index = Math.max(this.index - 1, 0);
      }

      // Update the last scroll position
      this.lastScrollPosition = currentScrollPosition;

      // Only update if the index has changed
      if (this.lastIndex !== this.index && !this.webgl.isClicked) {
        this.updateSlide();
      }
    }, 50); // Small delay to debounce scroll events
  }

  updateSlide() {
    this.webgl.currentTexture(this.index);

    this.controls.forEach((control, i) => {
      if (i === this.index) {
        control.classList.add('active');
      } else {
        control.classList.remove('active');
      }
    });

    this.lastIndex = this.index;
  }
}

// Example usage:
// const slider = new Slider({
//   el: '.slider',
//   duration: 1.5,
//   ease: 'power2.inOut',
//   scrollThreshold: 100 // Optional: adjust sensitivity
// });

// console.log("Slider class modified to use scroll events instead of click events");

// new Slider({
//   el: '.slider',
//   duration: 1,
//   ease: 'Power2.easeInOut',
// });
