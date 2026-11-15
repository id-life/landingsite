import { P5Canvas, P5CanvasInstance, SketchProps } from './P5Canvas';
import P5 from 'p5';
import { useMemo } from 'react';
import { Particle } from './particle-stuct';
import { loadParticlePoints, ParticlePoints, samplePixels } from './particle-points';
import { isReducedMotion } from '@/motion/preference';

export const fundLogoLength = 2;

export type MySketchProps = SketchProps & {
  activeAnim: boolean;
  imageIdx: number;
  id?: string;
};

const DynamicParticleGL = ({
  activeAnim,
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
    forceColor?: [number, number, number];
    instantColor?: boolean;
  }[];
}) => {
  const wrappedSketch = useMemo(() => {
    return function sketch(p5: P5CanvasInstance<MySketchProps>) {
      let id = 'particle-container';
      let canvas: P5.Renderer;
      // The canvas lives in the section's container (id). Setup now runs at once (no image preload), possibly before
      // that container is rendered: keep it where p5 made it until the container exists (props re-parent it).
      const moveToContainer = () => {
        const target = canvas && document.getElementById(id);
        if (target && canvas.elt.parentElement !== target) canvas.parent(target);
      };
      const allParticles: Particle[] = [];
      const IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const defaultConfig = {
        scaleNum: 1,
        loadPercentage: 0.0007,
        resolution: IS_MOBILE ? 15 : 5,
      };
      let activeAnim = false;
      const sourceImgInfos: {
        scaleNum?: number;
        resize?: number[];
        url: string;
        loadPercentage?: number;
        resolution?: number;
        forceColor?: [number, number, number];
        instantColor?: boolean;
      }[] = getSourceImgInfos ? getSourceImgInfos(IS_MOBILE) : [];
      // PERF-05: each logo's points, precomputed at build time (particle-points.ts); no stencil image is downloaded.
      let pointSets: (ParticlePoints | null)[] | null = null;
      let pendingIdx: number | null = null;

      p5.updateWithProps = (props) => {
        activeAnim = props.activeAnim ?? false;
        setImageIdx(props?.imageIdx || 0);
        id = props?.id ?? 'particle-container';
        moveToContainer();
      };

      loadParticlePoints('dynamic', IS_MOBILE, sourceImgInfos).then((sets) => {
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
            const threshold =
              (info.loadPercentage ?? defaultConfig.loadPercentage) * (info.resolution ?? defaultConfig.resolution);
            sets[idx] = samplePixels(
              img.pixels,
              img.width,
              img.height,
              (_x, _y, alpha) => alpha >= 128 && p5.random(1.0) <= threshold,
            );
            if (pendingIdx === idx) setImageIdx(idx);
          });
        });
        if (pendingIdx !== null) setImageIdx(pendingIdx);
      });

      p5.setup = () => {
        const ratio = 1280 / 750;
        const width = IS_MOBILE ? 800 : 1280;
        const height = width / ratio;
        // p5 defaults to the full devicePixelRatio: a 3x phone allocated 2400x1406 per canvas (six of them).
        // The canvas is drawn about 390 CSS px wide there, so 1.5x already matches the screen's pixels.
        p5.pixelDensity(Math.min(window.devicePixelRatio || 1, IS_MOBILE ? 1.5 : 2));
        canvas = p5.createCanvas(width, height);
        moveToContainer();
        // An index asked for before the canvas existed is applied now; desktop starts on the idle shape.
        if (pendingIdx !== null) setImageIdx(pendingIdx);
        else if (!IS_MOBILE) setImageIdx(0);
      };

      function setImageIdx(idx: number) {
        const { forceColor, instantColor } = sourceImgInfos[idx] ?? {};
        const points = pointSets?.[idx];
        if (!points || !canvas) {
          pendingIdx = idx;
          return;
        }
        pendingIdx = null;

        // Create an array of indexes from particle array.
        const preParticleIndexes = allParticles.map((_, index) => index);

        for (let i = 0; i < points.count; i++) {
          const x = points.xy[i * 2];
          const y = points.xy[i * 2 + 1];
          const pixelColor = forceColor
            ? p5.color(...forceColor)
            : p5.color(points.rgba[i * 4], points.rgba[i * 4 + 1], points.rgba[i * 4 + 2]);
          let newParticle: Particle;
          if (preParticleIndexes.length > 0) {
            // Re-use existing particle - optimized random selection
            const randomIndex = Math.floor(p5.random(preParticleIndexes.length));
            const index = preParticleIndexes[randomIndex];
            preParticleIndexes[randomIndex] = preParticleIndexes[preParticleIndexes.length - 1];
            preParticleIndexes.pop();
            newParticle = allParticles[index];
          } else {
            // Create a new particle.
            newParticle = new Particle(p5.width / 2, p5.height / 2, p5, IS_MOBILE);
            allParticles.push(newParticle);
          }
          newParticle.target.x = x + p5.width / 2 - points.width / 2;
          newParticle.target.y = y + p5.height / 2 - points.height / 2;
          newParticle.endColor = pixelColor;
          if (instantColor) {
            newParticle.currentColor = pixelColor;
          }
        }
        // Kill off any left over particles that aren't assigned to anything.
        const preLen = preParticleIndexes.length;
        if (preLen > 0) {
          for (let i = 0; i < preLen; i++) {
            const index = preParticleIndexes[i];
            allParticles[index].kill();
            allParticles[index].endColor = p5.color(0);
          }
        }
        // Reduced motion: P5Canvas does not loop; draw the settled logo once.
        if (isReducedMotion()) p5.redraw();
      }
      p5.draw = () => {
        if (canvas && canvas.elt.parentElement?.id !== id) moveToContainer();
        if (!activeAnim || !allParticles?.length) return;
        p5.clear();

        // Reduced motion (MOT-02): one still frame of the finished logo, no flight, wander or fade.
        if (isReducedMotion()) {
          let kept = 0;
          for (const particle of allParticles) {
            if (particle.isKilled) continue;
            particle.settle();
            particle.draw();
            allParticles[kept++] = particle;
          }
          allParticles.length = kept;
          return;
        }

        let writeIndex = 0;

        for (let readIndex = 0; readIndex < allParticles.length; readIndex++) {
          const particle = allParticles[readIndex];

          particle.move();
          particle.draw();

          if (!particle.isKilled && !particle.isOutOfBounds()) {
            if (writeIndex !== readIndex) {
              allParticles[writeIndex] = allParticles[readIndex];
            }
            writeIndex++;
          }
        }

        // Truncate array to new length
        allParticles.length = writeIndex;
      };

      return p5;
    };
  }, [getSourceImgInfos]);
  return <P5Canvas sketch={wrappedSketch} activeAnim={activeAnim} imageIdx={imageIdx} id={id} />;
};

export default DynamicParticleGL;
