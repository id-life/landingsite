import { P5CanvasInstance, ReactP5Wrapper, SketchProps } from '@p5-wrapper/react';
import P5 from 'p5';
import { useMemo } from 'react';
import { StaticParticle } from './static-particle';

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
      const sourceImgs: P5.Image[] = [];
      let particles: StaticParticle[] = [];
      const IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
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
        if (canvas) canvas?.parent(id);
      };

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
          particleSize: configParticleSize,
        } = sourceImgInfos[idx] ?? {};
        particleSize = configParticleSize ?? defaultConfig.particleSize;
        const sourceImg = sourceImgs[idx];
        if (!sourceImg) return;

        const [sourceImgWidth, sourceImgHeight] = resize;
        if (sourceImgWidth) sourceImg.resize(sourceImgWidth * scaleNum, sourceImgHeight * scaleNum);
        sourceImg.loadPixels();

        // create an array, include existing particle indexes
        const preParticleIndexes = particles.map((_, index) => index);

        // particle spacing, control particle density, the larger the connect, the larger the spacing
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
          particle.draw(particleSize);
        }

        // remove particles that have been killed or out of bounds
        particles = particles.filter((particle) => !particle.isKilled && !particle.isOutOfBounds());
      };

      return p5;
    };
  }, [getSourceImgInfos]);

  return <ReactP5Wrapper sketch={wrappedSketch} activeAnim={activeAnim} imageIdx={imageIdx} id={id} />;
};

export default StaticParticleGL;
