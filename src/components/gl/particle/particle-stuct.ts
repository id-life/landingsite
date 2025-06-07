import { P5CanvasInstance } from '@p5-wrapper/react';
import P5 from 'p5';
import { MySketchProps } from './DynamicParticleGL';

function generateRandomPos(x: number, y: number, mag: number, p5: P5CanvasInstance<MySketchProps>) {
  const pos = new P5.Vector(x, y);

  const randomDirection = new P5.Vector(p5.random(p5.width), p5.random(p5.height));

  const vel = P5.Vector.sub(randomDirection, pos);
  vel.normalize();
  vel.mult(mag);
  pos.add(vel);

  return pos;
}

type ParticleConfig = {
  closeEnoughTarget: number;
  speed: number;
  mouseSize: number;
  scaleRatio: number;
  particleSize: number;
};

/**
 * particle.js https://openprocessing.org/sketch/2097742
 * A particle that uses a seek behaviour to move to its target.
 * @param {number} x
 * @param {number} y
 */
export class Particle {
  p5: P5CanvasInstance<MySketchProps>;
  pos: P5.Vector;
  vel: P5.Vector;
  acc: P5.Vector;
  target: P5.Vector;
  isKilled: boolean;
  config: ParticleConfig;
  maxSpeed: number;
  maxForce: number;

  currentColor: P5.Color;
  endColor: P5.Color;
  colorBlendRate: number;

  currentSize: number;
  distToTarget: number;

  noiseOffsetX: number;
  noiseOffsetY: number;

  constructor(x: number, y: number, p5: P5CanvasInstance<MySketchProps>, config?: ParticleConfig, isMobile?: boolean) {
    this.p5 = p5;
    this.config = config ?? {
      closeEnoughTarget: 100,
      speed: 3,
      particleSize: isMobile ? 4 : 8,
      mouseSize: 50,
      scaleRatio: 1,
    };
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
    const p5 = this.p5;
    const { closeEnoughTarget, speed, scaleRatio, mouseSize } = this.config;
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
    const p5 = this.p5;
    const { closeEnoughTarget, particleSize } = this.config;
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
    const p5 = this.p5;
    if (!this.isKilled) {
      this.target = generateRandomPos(p5.width / 2, p5.height / 2, p5.max(p5.width, p5.height), p5);
      this.endColor = p5.color(0);
      this.isKilled = true;
    }
  }

  public isOutOfBounds() {
    const p5 = this.p5;
    return this.pos.x < 0 || this.pos.x > p5.width || this.pos.y < 0 || this.pos.y > p5.height;
  }
}
