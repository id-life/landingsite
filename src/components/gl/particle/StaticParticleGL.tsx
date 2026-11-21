import { P5Canvas, P5CanvasInstance, SketchProps } from './P5Canvas';
import P5 from 'p5';
import { useMemo } from 'react';
import { StaticParticle } from './static-particle';
import { loadParticlePoints, ParticlePoints, samplePixels } from './particle-points';
import { isReducedMotion } from '@/motion/preference';
import { particlePhoneBudget } from './particle-device';

export const fundLogoLength = 2;

export type StaticSketchProps = SketchProps & {
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
    return function sketch(p5: P5CanvasInstance<StaticSketchProps>) {
      let id = 'particle-container';
      let canvas: P5.Renderer;
      // The canvas lives in the section's container (id). Setup now runs at once (no image preload), possibly before
      // that container is rendered: keep it where p5 made it until the container exists (props re-parent it).
      const moveToContainer = () => {
        const target = canvas && document.getElementById(id);
        if (target && canvas.elt.parentElement !== target) canvas.parent(target);
      };
      let particles: StaticParticle[] = [];
      const IS_MOBILE = particlePhoneBudget();
      const defaultConfig = {
        scaleNum: 1,
        loadPercentage: IS_MOBILE ? 0.01 : 0.02,
        resolution: IS_MOBILE ? 15 : 5,
        particleSize: IS_MOBILE ? 3 : 5,
      };
      let particleSize = defaultConfig.particleSize;
      let currentImageIdx = 0;
      let isAnimActive: boolean = false;
      const sourceImgInfos: {
        scaleNum?: number;
        resize?: number[];
        url: string;
        loadPercentage?: number;
        resolution?: number;
        particleSize?: number;
      }[] = getSourceImgInfos ? getSourceImgInfos(IS_MOBILE) : [];

      p5.updateWithProps = (props) => {
        isAnimActive = props.activeAnim ?? false;
        if (props.imageIdx !== undefined && props.imageIdx !== currentImageIdx) {
          currentImageIdx = props.imageIdx;
          setImageIdx(currentImageIdx);
        }
        id = props?.id ?? 'particle-container';
        moveToContainer();
      };

      // PERF-05: each logo's points, precomputed at build time (particle-points.ts); no stencil image is downloaded.
      let pointSets: (ParticlePoints | null)[] | null = null;
      loadParticlePoints('static', IS_MOBILE, sourceImgInfos).then((sets) => {
        pointSets = sets;
        // A logo without precomputed points samples its image, as the sketch always did.
        sets.forEach((set, idx) => {
          if (set) return;
          const info = sourceImgInfos[idx];
          p5.loadImage(info.url, (img) => {
            const [w, h] = info.resize ?? [0, 0];
            const scaleNum = info.scaleNum ?? defaultConfig.scaleNum;
            if (w && h) img.resize(w * scaleNum, h * scaleNum);
            img.loadPixels();
            const spacing = Math.ceil(
              1 / ((info.loadPercentage ?? defaultConfig.loadPercentage) * (info.resolution ?? defaultConfig.resolution)),
            );
            sets[idx] = samplePixels(img.pixels, img.width, img.height, (_x, _y, alpha) => alpha > 128, spacing);
            if (idx === currentImageIdx) setImageIdx(idx);
          });
        });
        setImageIdx(currentImageIdx);
      });

      p5.setup = () => {
        const ratio = 1280 / 750;
        const width = IS_MOBILE ? 800 : 1280;
        const height = width / ratio;
        canvas = p5.createCanvas(width, height);
        moveToContainer();
        // both mobile and desktop should set initial image index
        setImageIdx(currentImageIdx);
      };

      function setImageIdx(idx: number) {
        const { particleSize: configParticleSize } = sourceImgInfos[idx] ?? {};
        const points = pointSets?.[idx];
        if (!points || !canvas) return;
        particleSize = configParticleSize ?? defaultConfig.particleSize;

        // create an array, include existing particle indexes
        const preParticleIndexes = particles.map((_, index) => index);

        // store new particle position and color
        const newPositions: { x: number; y: number; color: P5.Color }[] = [];
        for (let i = 0; i < points.count; i++) {
          newPositions.push({
            x: points.xy[i * 2] + p5.width / 2 - points.width / 2,
            y: points.xy[i * 2 + 1] + p5.height / 2 - points.height / 2,
            color: p5.color(points.rgba[i * 4], points.rgba[i * 4 + 1], points.rgba[i * 4 + 2], points.rgba[i * 4 + 3]),
          });
        }

        // determine how many new particles are needed
        const newParticlesNeeded = Math.max(0, newPositions.length - preParticleIndexes.length);

        // create new particles
        for (let i = 0; i < newParticlesNeeded; i++) {
          const randomX = p5.random(p5.width);
          const randomY = p5.random(p5.height);
          particles.push(new StaticParticle(randomX, randomY, p5, IS_MOBILE));
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
        // Reduced motion: P5Canvas does not loop; draw the settled logo once.
        if (isReducedMotion()) p5.redraw();
      }

      p5.draw = () => {
        if (canvas && canvas.elt.parentElement?.id !== id) moveToContainer();
        if (!isAnimActive || !particles?.length) return;
        p5.clear();
        p5.background(255, 0); // transparent background

        // Reduced motion (MOT-02): one still frame of the finished logo, no flight, no fade.
        if (isReducedMotion()) {
          particles = particles.filter((particle) => !particle.isKilled);
          for (const particle of particles) {
            particle.settle(particleSize);
            particle.draw(particleSize);
          }
          return;
        }

        // move and draw all particles
        const len = particles.length;
        for (let i = len - 1; i >= 0; i--) {
          const particle = particles[i];
          particle.move();
          particle.draw(particleSize);
        }

        // remove particles that have been killed or out of bounds
        particles = particles.filter((particle) => !particle.isKilled && !particle.isOutOfBounds());
      };

      return p5;
    };
  }, [getSourceImgInfos]);

  return <P5Canvas sketch={wrappedSketch} activeAnim={activeAnim} imageIdx={imageIdx} id={id} />;
};

export default StaticParticleGL;
