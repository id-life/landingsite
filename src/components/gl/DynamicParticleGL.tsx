import { P5CanvasInstance, ReactP5Wrapper, SketchProps } from '@p5-wrapper/react';
import P5 from 'p5';

type MySketchProps = SketchProps & {
  activeAnim: boolean;
};
function sketch(p5: P5CanvasInstance<MySketchProps>) {
  // console.log('sketch 函数开始执行');
  let sourceImg: P5.Image;
  const allParticles: any[] = [];
  const IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const scaleNum = IS_MOBILE ? 1.2 : 2.2;
  const loadPercentage = 0.0007;
  const closeEnoughTarget = 100;
  const resolution = IS_MOBILE ? 15 : 5;
  const speed = 3;
  const particleSize = IS_MOBILE ? 6 : 8;
  const mouseSize = 50;
  const scaleRatio = 1;
  let activeAnim = false;

  p5.updateWithProps = (props) => {
    // console.log('props', props);
    if (props.activeAnim) {
      activeAnim = true;
    } else activeAnim = false;
  };

  function generateRandomPos(x: number, y: number, mag: number) {
    const pos = new P5.Vector(x, y);

    const randomDirection = new P5.Vector(p5.random(p5.width), p5.random(p5.height));

    const vel = P5.Vector.sub(randomDirection, pos);
    vel.normalize();
    vel.mult(mag);
    pos.add(vel);

    return pos;
  }
  /**
      particle.js https://openprocessing.org/sketch/2097742 
      A particle that uses a seek behaviour to move to its target.
      @param {number} x
      @param {number} y
      */
  class Particle {
    pos: P5.Vector;
    vel: P5.Vector;
    acc: P5.Vector;
    target: P5.Vector;
    isKilled: boolean;

    maxSpeed: number;
    maxForce: number;

    currentColor: P5.Color;
    endColor: P5.Color;
    colorBlendRate: number;

    currentSize: number;
    distToTarget: number;

    noiseOffsetX: number;
    noiseOffsetY: number;

    constructor(x: number, y: number) {
      this.pos = new P5.Vector(x, y);
      this.vel = new P5.Vector(0, 0);
      this.acc = new P5.Vector(0, 0);
      this.target = new P5.Vector(0, 0);
      this.isKilled = false;

      this.maxSpeed = p5.random(0.25, 2); // How fast it can move per frame.
      this.maxForce = p5.random(8, 15); // Its speed limit.

      this.currentColor = p5.color(0);
      this.endColor = p5.color(0);
      this.colorBlendRate = p5.random(0.01, 0.05);

      this.currentSize = 0;

      // Saving as class const so it doesn't need to calculate twice.
      this.distToTarget = 0;

      this.noiseOffsetX = p5.random(1000); // 噪声偏移量X
      this.noiseOffsetY = p5.random(1000); // 噪声偏移量Y
      // console.log('this.pos', this.pos);
    }
    public move() {
      // 添加基于噪声的轻微扰动
      const noiseScale = 0.005; // 噪声的缩放系数
      const noiseStrength = 0.6; // 噪声的强度
      this.acc.add(
        p5.noise(this.noiseOffsetX + this.pos.x * noiseScale, this.pos.y * noiseScale) * noiseStrength - noiseStrength / 2,
        p5.noise(this.noiseOffsetY + this.pos.y * noiseScale, this.pos.x * noiseScale) * noiseStrength - noiseStrength / 2,
      );

      this.distToTarget = p5.dist(this.pos.x, this.pos.y, this.target.x, this.target.y);

      // If it's close enough to its target, the slower it'll get
      // so that it can settle.
      let proximityMult = 1;
      if (this.distToTarget < closeEnoughTarget) {
        proximityMult = this.distToTarget / closeEnoughTarget;
        this.vel.mult(0.9);
      } else {
        proximityMult = 1;
        this.vel.mult(0.95);
      }

      // Steer towards its target.
      if (this.distToTarget > 1) {
        const steer = P5.Vector.sub(this.target, this.pos);
        steer.normalize();
        steer.mult(this.maxSpeed * proximityMult * speed);
        this.acc.add(steer);
      }

      const scaledMouseX = p5.mouseX / scaleRatio;
      const scaledMouseY = p5.mouseY / scaleRatio;

      const mouseDist = p5.dist(this.pos.x, this.pos.y, scaledMouseX, scaledMouseY);

      // Interact with mouse.
      let push = new P5.Vector(0, 0);
      if (mouseDist < mouseSize) {
        if (p5.mouseIsPressed) {
          // Push towards mouse.
          push = new P5.Vector(scaledMouseX, scaledMouseY);
          push.sub(new P5.Vector(this.pos.x, this.pos.y));
        } else {
          // Push away from mouse.
          push = new P5.Vector(this.pos.x, this.pos.y);
          push.sub(new P5.Vector(scaledMouseX, scaledMouseY));
        }
        push.normalize();
        push.mult((mouseSize - mouseDist) * 0.05);
        this.acc.add(push);
      }

      // Move it.
      this.vel.add(this.acc);
      this.vel.limit(this.maxForce * speed);
      this.pos.add(this.vel);
      this.acc.mult(0);
      this.noiseOffsetX += 0.01;
      this.noiseOffsetY += 0.01;
    }
    public draw() {
      if (!activeAnim) return;
      this.currentColor = p5.lerpColor(this.currentColor, this.endColor, this.colorBlendRate);
      p5.stroke(this.currentColor);

      let targetSize = 2;
      if (!this.isKilled) {
        // Size is bigger the closer it is to its target.
        targetSize = p5.map(p5.min(this.distToTarget, closeEnoughTarget), closeEnoughTarget, 0, 0, particleSize);
      } else {
        targetSize = 2;
      }

      this.currentSize = p5.lerp(this.currentSize, targetSize, 0.1);
      p5.strokeWeight(this.currentSize);
      p5.point(this.pos.x, this.pos.y);
    }

    public kill() {
      if (!this.isKilled) {
        this.target = generateRandomPos(p5.width / 2, p5.height / 2, p5.max(p5.width, p5.height));
        this.endColor = p5.color(0);
        this.isKilled = true;
      }
    }

    public isOutOfBounds() {
      return this.pos.x < 0 || this.pos.x > p5.width || this.pos.y < 0 || this.pos.y > p5.height;
    }
  }

  p5.preload = () => {
    // console.log('p5.preload 开始执行');
    sourceImg = p5.loadImage('/imgs/id-logo.png');
    sourceImg.resize(256, 150);
    // console.log('p5.preload 执行完毕');
  };

  p5.setup = () => {
    // console.log('p5.setup 开始执行');
    const canvas = p5.createCanvas(1280, 750);
    canvas.parent('particle-container');
    sourceImg.resize(sourceImg.width * scaleNum, sourceImg.height * scaleNum);
    resetImage();
    // console.log('p5.setup 执行完毕');
  };

  function resetImage() {
    // console.log('开始重置图像');
    sourceImg.loadPixels();
    // console.log(`图像尺寸: ${sourceImg.width}x${sourceImg.height}`);
    // console.log(`loadPercentage: ${loadPercentage}, resolution: ${resolution}`);

    // Create an array of indexes from particle array.
    const particleIndexes = [];
    for (let i = 0; i < allParticles.length; i++) {
      particleIndexes.push(i);
    }

    let pixelIndex = 0;

    const imgWidth = sourceImg.width,
      imgHeight = sourceImg.height;
    // console.log('imgWidth', imgWidth, 'imgHeight', imgHeight);
    // Go through each pixel of the image.
    for (let y = 0; y < imgHeight; y++) {
      for (let x = 0; x < imgWidth; x++) {
        // Get the pixel's color.
        const pixelR = sourceImg.pixels[pixelIndex++];
        const pixelG = sourceImg.pixels[pixelIndex++];
        const pixelB = sourceImg.pixels[pixelIndex++];
        const pixelA = sourceImg.pixels[pixelIndex++];
        // 检查像素是否透明
        if (pixelA < 128) {
          // 如果 alpha 值小于 128，我们认为它是透明的
          continue; // 跳过这个像素，不为其创建粒子
        }
        // Give it small odds that we'll assign a particle to this pixel.
        if (p5.random(1.0) > loadPercentage * resolution) {
          continue;
        }

        const pixelColor = p5.color(pixelR, pixelG, pixelB);
        let newParticle: Particle;
        if (!particleIndexes?.length) {
          // Create a new particle.
          newParticle = new Particle(p5.width / 2, p5.height / 2);

          allParticles.push(newParticle);
          newParticle.target.x = x + p5.width / 2 - sourceImg.width / 2;
          newParticle.target.y = y + p5.height / 2 - sourceImg.height / 2;
          newParticle.endColor = pixelColor;
          // console.log('创建了新粒子', newParticle);
        }
      }
    }
    // console.log('particleIndexes', particleIndexes, ' allParticles', allParticles);
    // Kill off any left over particles that aren't assigned to anything.
    if (particleIndexes.length > 0) {
      for (let i = 0; i < particleIndexes.length; i++) {
        allParticles[particleIndexes[i]].kill();
      }
    }

    // console.log(`创建了 ${allParticles.length} 个粒子`);
  }
  p5.draw = () => {
    if (!activeAnim) return;
    p5.clear();

    for (let i = allParticles.length - 1; i > -1; i--) {
      allParticles[i].move();
      allParticles[i].draw();

      if (allParticles[i].isKilled && allParticles[i].isOutOfBounds()) {
        allParticles.splice(i, 1);
      }
    }

    if (p5.frameCount % 60 === 0) {
      // console.log(`当前粒子数量: ${allParticles.length}`);
    }
  };

  // 其他辅助函数和 Particle 类的定义...

  return p5;
}

const DynamicParticleGL = ({ activeAnim }: { activeAnim?: boolean }) => {
  return <ReactP5Wrapper sketch={sketch} activeAnim={activeAnim} />;
};

export default DynamicParticleGL;