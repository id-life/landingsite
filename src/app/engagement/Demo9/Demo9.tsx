// import { useRef, useEffect, useState } from 'react'
// import twgl from 'twgl.js'
// import  * as gsap from 'gsap'
//
// const textures = [
//   "https://i.ibb.co/vZC7swG/wolf.jpg",
//   "https://i.ibb.co/YPDnfw1/214676.jpg",
//   "https://i.ibb.co/GPvQw0f/fox.jpg",
//   "https://i.ibb.co/2nLqZkx/deer-minimalism-vector-background-nature-93845-1920x1080.jpg"
// ]
//
// const Slider = () => {
//   const canvasRef = useRef(null)
//   const [currentIndex, setCurrentIndex] = useState(0)
//   const [isAnimating, setIsAnimating] = useState(false)
//   const webglRef = useRef({
//     uniforms: null,
//     textLoaded: [],
//     originalImage: { width: 1, height: 1 }
//   })
//
//   // 初始化WebGL
//   useEffect(() => {
//     const canvas = canvasRef.current
//     const gl = canvas.getContext('webgl')
//     let animationFrameId
//
//     // 初始化着色器和程序
//     const vs = `
//       attribute vec4 position;
//       uniform mat3 u_matrix;
//       varying vec2 v_texcoord;
//       void main() {
//         vec3 clipSpace = u_matrix * vec3(position.xy, 1);
//         gl_Position = vec4(clipSpace, 1);
//         v_texcoord = position.xy * 0.5 + 0.5;
//       }`
//
//     const fs = `
//       precision mediump float;
//       uniform sampler2D u_text0;
//       uniform sampler2D u_text1;
//       uniform float u_anim;
//       varying vec2 v_texcoord;
//       void main() {
//         vec4 color0 = texture2D(u_text0, v_texcoord);
//         vec4 color1 = texture2D(u_text1, v_texcoord);
//         gl_FragColor = mix(color0, color1, u_anim);
//       }`
//
//     // 加载纹理和初始化WebGL
//     const loadTextures = async () => {
//       const textLoaded = await Promise.all(
//         textures.map(tex => twgl.createTexture(gl, { src: tex }))
//       )
//
//       // 获取第一个纹理的尺寸
//       twgl.createTexture(gl, { src: textures[0] }, (err, texture, source) => {
//         webglRef.current.originalImage = source
//       })
//
//       const programInfo = twgl.createProgramInfo(gl, [vs, fs])
//       const bufferInfo = twgl.primitives.createXYQuadBufferInfo(gl)
//
//       webglRef.current = {
//         gl,
//         programInfo,
//         bufferInfo,
//         textLoaded,
//         uniforms: {
//           u_text0: textLoaded[0],
//           u_text1: textLoaded[1],
//           u_matrix: twgl.m3.identity(),
//           u_anim: 0
//         }
//       }
//
//       // 启动渲染循环
//       const update = () => {
//         const { gl, programInfo, bufferInfo, uniforms } = webglRef.current
//         twgl.resizeCanvasToDisplaySize(gl.canvas)
//         gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
//         gl.clearColor(0, 0, 0, 0)
//         gl.clear(gl.COLOR_BUFFER_BIT)
//
//         // 计算缩放矩阵
//         const canvasAspect = gl.canvas.clientWidth / gl.canvas.clientHeight
//         const imageAspect = webglRef.current.originalImage.width /
//           webglRef.current.originalImage.height
//         let mat = twgl.m3.scaling([imageAspect / canvasAspect, -1])
//
//         // 更新uniforms并渲染
//         uniforms.u_matrix = mat
//         twgl.setUniforms(programInfo, uniforms)
//         twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo)
//         twgl.drawBufferInfo(gl, bufferInfo)
//
//         animationFrameId = requestAnimationFrame(update)
//       }
//       update()
//     }
//
//     loadTextures()
//
//     return () => {
//       cancelAnimationFrame(animationFrameId)
//       gl.getExtension('WEBGL_lose_context')?.loseContext()
//     }
//   }, [])
//
//   // 处理切换纹理
//   const switchTexture = (index) => {
//     if (isAnimating || index === currentIndex) return
//
//     setIsAnimating(true)
//     const prevTexture = webglRef.current.uniforms.u_text0
//     webglRef.current.uniforms.u_text1 = webglRef.current.textLoaded[index]
//
//     gsap.to(webglRef.current.uniforms, 1, {
//       u_anim: 1,
//       duration:1,
//       // ease: Expo.easeInOut,
//       onComplete: () => {
//         webglRef.current.uniforms.u_text0 = webglRef.current.textLoaded[index]
//         webglRef.current.uniforms.u_anim = 0
//         setIsAnimating(false)
//         setCurrentIndex(index)
//       }
//     })
//   }
//
//   return (
//     <div className="slider">
//       <canvas ref={canvasRef} className="canvas" />
//
//       <div className="slider-controls__circles">
//         {textures.map((_, i) => (
//           <div
//             key={i}
//             className={`slider-controls__item ${currentIndex === i ? 'active' : ''}`}
//             onClick={() => switchTexture(i)}
//           />
//         ))}
//       </div>
//
//       <div className="slider-content__text">
//         {textures.map((_, i) => (
//           <div
//             key={i}
//             className={`slider-content__text__item ${currentIndex === i ? 'current' : 'bottom'}`}
//           >
//             Image {i + 1}
//           </div>
//         ))}
//       </div>
//
//       <div className="slider-controls__numbers">
//         {textures.map((_, i) => (
//           <div
//             key={i}
//             className={`
//               slider-controls__number
//               ${i < currentIndex ? 'top' : ''}
//               ${i > currentIndex ? 'bottom' : ''}
//               ${i === currentIndex ? 'current' : ''}
//             `}
//           >
//             {i + 1}
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }
//
// export default Slider

import { useEffect } from 'react';
import { Slider } from '@/app/engagement/Demo9/slider';

export default function Demo9() {
  useEffect(() => {
    new Slider({
      el: '.slider',
      duration: 1,
      ease: 'Power2.easeInOut',
      scrollThreshold: 300,
    });
  }, []);
  return (
    <div className="slider h-[37.5rem] w-[67.5rem]">
      <canvas id="canvas" className="h-[37.5rem] w-[67.5rem]"></canvas>
      <div className="slider-content container-fluid bm-difference">
        <div className="slider-controls">
          <div className="slider-controls__circles">
            <div data-control className="slider-controls__item active"></div>
            <div data-control className="slider-controls__item"></div>
            <div data-control className="slider-controls__item"></div>
            <div data-control className="slider-controls__item"></div>
            <div className="slider-controls__point"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
