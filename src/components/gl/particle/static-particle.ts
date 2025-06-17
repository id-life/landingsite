import { P5CanvasInstance } from '@p5-wrapper/react';
import P5 from 'p5';
import { StaticSketchProps } from './StaticParticleGL';
import { generateRandomPos } from './particle-stuct';

type ParticleConfig = {
  closeEnoughTarget: number;
  speed: number;
  particleSize: number;
};
/**
 * StaticParticle class - particle can move from current position to target position
 */
export class StaticParticle {
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
  p5: P5CanvasInstance<StaticSketchProps>;

  // mark particle is stable in target position
  isStable: boolean;

  constructor(x: number, y: number, p5: P5CanvasInstance<StaticSketchProps>, isMobile?: boolean, config?: ParticleConfig) {
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
    this.p5 = p5;
    this.config = config ?? {
      closeEnoughTarget: 100,
      speed: 3,
      particleSize: isMobile ? 3 : 5,
    };
  }

  move() {
    const p5 = this.p5;
    const { closeEnoughTarget, speed } = this.config;
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

  draw(drawParticleSize?: number) {
    const p5 = this.p5;
    const { closeEnoughTarget, particleSize } = this.config;

    // color blend
    this.currentColor = p5.lerpColor(this.currentColor, this.endColor, this.colorBlendRate);

    // determine particle size
    let targetSize;
    if (this.isKilled) {
      targetSize = 0; // killed particle
    } else if (this.isStable) {
      targetSize = drawParticleSize ?? particleSize; // stable particle
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
    const p5 = this.p5;
    if (!this.isKilled) {
      this.target = generateRandomPos(p5.width / 2, p5.height / 2, p5.max(p5.width, p5.height), p5);
      this.endColor = p5.color(0, 0); // fully transparent
      this.isKilled = true;
      this.isStable = false;
    }
  }

  isOutOfBounds() {
    const p5 = this.p5;

    return this.pos.x < 0 || this.pos.x > p5.width || this.pos.y < 0 || this.pos.y > p5.height;
  }
}
