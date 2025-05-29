import { P5CanvasInstance, ReactP5Wrapper, SketchProps } from '@p5-wrapper/react';
import P5 from 'p5';
import { useMemo } from 'react';

export const fundLogoLength = 2;

type MySketchProps = SketchProps & {
  activeAnim: boolean;
  imageIdx: number;
  id?: string;
};

const StaticParticleGL = ({
  activeAnim = false,
  imageIdx,
  id = 'particle-container',
  getSourceImgInfos,
}: {
  activeAnim?: boolean;
  imageIdx: number;
  id?: string;
  getSourceImgInfos?: (isMobile: boolean) => {
    scaleNum?: number;
    resize?: number[];
    url: string;
    loadPercentage?: number;
    resolution?: number;
  }[];
}) => {
  const wrappedSketch = useMemo(() => {
    return function sketch(p5: P5CanvasInstance<MySketchProps>) {
      let id = 'particle-container';
      let canvas: P5.Renderer;
      const sourceImgs: P5.Image[] = [];
      let particles: AnimatedParticle[] = [];
      const IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const defaultConfig = {
        scaleNum: 1,
        loadPercentage: 0.015,
        resolution: IS_MOBILE ? 15 : 5,
      };
      const closeEnoughTarget = 100;
      const speed = 3;
      const particleSize = IS_MOBILE ? 3 : 8;
      let currentImageIdx = 0;
      let isAnimActive: boolean = activeAnim;
      const sourceImgInfos: {
        scaleNum?: number;
        resize?: number[];
        url: string;
        loadPercentage?: number;
        resolution?: number;
      }[] = getSourceImgInfos ? getSourceImgInfos(IS_MOBILE) : [];

      p5.updateWithProps = (props) => {
        if (props.activeAnim !== undefined) {
          isAnimActive = props.activeAnim;
        }
        if (props.imageIdx !== undefined && props.imageIdx !== currentImageIdx) {
          currentImageIdx = props.imageIdx;
          setImageIdx(currentImageIdx);
        }
        id = props?.id ?? 'particle-container';
        if (canvas) canvas?.parent(id);
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
       * AnimatedParticle class - particle can move from current position to target position
       */
      class AnimatedParticle {
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

        // mark particle is stable in target position
        isStable: boolean;

        constructor(x: number, y: number) {
          // initial position
          this.pos = new P5.Vector(x, y);
          this.vel = new P5.Vector(0, 0);
          this.acc = new P5.Vector(0, 0);
          // target position
          this.target = new P5.Vector(0, 0);
          this.isKilled = false;
          this.isStable = false;

          this.maxSpeed = p5.random(0.5, 2);
          this.maxForce = p5.random(8, 15);

          this.currentColor = p5.color(0);
          this.endColor = p5.color(0);
          this.colorBlendRate = p5.random(0.01, 0.05);

          this.currentSize = 0;
          this.distToTarget = 0;
        }

        move() {
          this.distToTarget = p5.dist(this.pos.x, this.pos.y, this.target.x, this.target.y);

          // static status
          if (this.distToTarget < 1) {
            this.isStable = true;
            this.pos.x = this.target.x;
            this.pos.y = this.target.y;
            this.vel.mult(0); // stop move
            return;
          }

          // continue move
          if (this.isKilled || !this.isStable) {
            // slow down
            let proximityMult = 1;
            if (this.distToTarget < closeEnoughTarget) {
              proximityMult = this.distToTarget / closeEnoughTarget;
              this.vel.mult(0.9);
            } else {
              proximityMult = 1;
              this.vel.mult(0.95);
            }

            // turn to target
            if (this.distToTarget > 1) {
              const steer = P5.Vector.sub(this.target, this.pos);
              steer.normalize();
              steer.mult(this.maxSpeed * proximityMult * speed);
              this.acc.add(steer);
            }

            // apply move
            this.vel.add(this.acc);
            this.vel.limit(this.maxForce * speed);
            this.pos.add(this.vel);
            this.acc.mult(0);
          }
        }

        draw() {
          // color blend
          this.currentColor = p5.lerpColor(this.currentColor, this.endColor, this.colorBlendRate);

          // determine particle size
          let targetSize;
          if (this.isKilled) {
            targetSize = 0; // killed particle
          } else if (this.isStable) {
            targetSize = particleSize; // stable particle
          } else {
            // when close to target, particle size increase
            targetSize = p5.map(p5.min(this.distToTarget, closeEnoughTarget), closeEnoughTarget, 0, 0, particleSize);
          }

          this.currentSize = p5.lerp(this.currentSize, targetSize, 0.1);

          // draw method: stable particle use fill point, move particle use stroke point
          if (this.isStable && !this.isKilled) {
            p5.noStroke();
            p5.fill(this.currentColor);
            p5.ellipse(this.pos.x, this.pos.y, this.currentSize, this.currentSize);
          } else {
            p5.noFill();
            p5.stroke(this.currentColor);
            p5.strokeWeight(this.currentSize);
            p5.point(this.pos.x, this.pos.y);
          }
        }

        updateTarget(x: number, y: number, color: P5.Color) {
          // when target position change, set particle to non-stable status
          if (this.target.x !== x || this.target.y !== y) {
            this.isStable = false;
          }
          this.target.x = x;
          this.target.y = y;
          this.endColor = color;
          this.isKilled = false;
        }

        kill() {
          if (!this.isKilled) {
            this.target = generateRandomPos(p5.width / 2, p5.height / 2, p5.max(p5.width, p5.height));
            this.endColor = p5.color(0, 0); // fully transparent
            this.isKilled = true;
            this.isStable = false;
          }
        }

        isOutOfBounds() {
          return this.pos.x < 0 || this.pos.x > p5.width || this.pos.y < 0 || this.pos.y > p5.height;
        }
      }

      p5.preload = () => {
        for (let i = 0; i < sourceImgInfos.length; i++) {
          const img = p5.loadImage(sourceImgInfos[i].url);
          const [width, height] = sourceImgInfos[i]?.resize ?? [0, 0];
          const scaleNum = sourceImgInfos[i]?.scaleNum ?? defaultConfig.scaleNum;
          if (width && height) img.resize(width * scaleNum, height * scaleNum);
          else img.resize(img.width * scaleNum, img.height * scaleNum);
          sourceImgs.push(img);
        }
      };

      p5.setup = () => {
        const ratio = 1280 / 750;
        const width = IS_MOBILE ? 800 : 1280;
        const height = width / ratio;
        canvas = p5.createCanvas(width, height);
        canvas.parent(id);
        // both mobile and desktop should set initial image index
        setImageIdx(currentImageIdx);
      };

      function setImageIdx(idx: number) {
        const {
          scaleNum = defaultConfig.scaleNum,
          loadPercentage = defaultConfig.loadPercentage,
          resolution = defaultConfig.resolution,
          resize = [0, 0],
        } = sourceImgInfos[idx] ?? {};

        const sourceImg = sourceImgs[idx];
        if (!sourceImg) return;

        const [sourceImgWidth, sourceImgHeight] = resize;
        if (sourceImgWidth) sourceImg.resize(sourceImgWidth * scaleNum, sourceImgHeight * scaleNum);
        sourceImg.loadPixels();

        // create an array, include existing particle indexes
        const preParticleIndexes = particles.map((_, index) => index);

        // particle spacing, control particle density, the larger the value, the larger the spacing
        const spacing = Math.ceil(1 / (loadPercentage * resolution));

        const [imgWidth, imgHeight] = [sourceImg.width, sourceImg.height];

        // store new particle position and color
        const newPositions: { x: number; y: number; color: P5.Color }[] = [];

        // traverse image pixels, collect valid pixel positions by interval
        for (let y = 0; y < imgHeight; y += spacing) {
          for (let x = 0; x < imgWidth; x += spacing) {
            // calculate current pixel index in pixels array
            const i = (y * imgWidth + x) * 4;

            if (i < sourceImg.pixels.length) {
              const pixelR = sourceImg.pixels[i];
              const pixelG = sourceImg.pixels[i + 1];
              const pixelB = sourceImg.pixels[i + 2];
              const pixelA = sourceImg.pixels[i + 3];

              // if pixel is not transparent, add to new position list
              if (pixelA > 128) {
                const pixelColor = p5.color(pixelR, pixelG, pixelB, pixelA);
                const targetX = x + p5.width / 2 - sourceImg.width / 2;
                const targetY = y + p5.height / 2 - sourceImg.height / 2;

                newPositions.push({
                  x: targetX,
                  y: targetY,
                  color: pixelColor,
                });
              }
            }
          }
        }

        // determine how many new particles are needed
        const newParticlesNeeded = Math.max(0, newPositions.length - preParticleIndexes.length);

        // create new particles
        for (let i = 0; i < newParticlesNeeded; i++) {
          const randomX = p5.random(p5.width);
          const randomY = p5.random(p5.height);
          particles.push(new AnimatedParticle(randomX, randomY));
        }

        // update all particles target position
        for (let i = 0; i < newPositions.length; i++) {
          const { x, y, color } = newPositions[i];

          if (i < particles.length) {
            particles[i].updateTarget(x, y, color);
          }
        }

        // kill extra particles
        for (let i = newPositions.length; i < particles.length; i++) {
          particles[i].kill();
        }
      }

      p5.draw = () => {
        if (!isAnimActive) return;
        p5.clear();
        p5.background(255, 0); // transparent background

        // move and draw all particles
        const len = particles.length;
        for (let i = len - 1; i >= 0; i--) {
          const particle = particles[i];
          particle.move();
          particle.draw();
        }

        // remove particles that have been killed or out of bounds
        particles = particles.filter((particle) => !particle.isKilled && !particle.isOutOfBounds());
      };

      return p5;
    };
  }, [activeAnim, getSourceImgInfos]);

  return <ReactP5Wrapper sketch={wrappedSketch} activeAnim={activeAnim} imageIdx={imageIdx} id={id} />;
};

export default StaticParticleGL;
