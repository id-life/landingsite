import { P5CanvasInstance, ReactP5Wrapper, SketchProps } from '@p5-wrapper/react';
import P5 from 'p5';
import { useMemo } from 'react';
import { Particle } from './particle-stuct';

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
  }[];
}) => {
  const wrappedSketch = useMemo(() => {
    return function sketch(p5: P5CanvasInstance<MySketchProps>) {
      // console.log('sketch 函数开始执行');
      let id = 'particle-container';
      let canvas: P5.Renderer;
      const sourceImgs: P5.Image[] = [];
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
      }[] = getSourceImgInfos ? getSourceImgInfos(IS_MOBILE) : [];

      p5.updateWithProps = (props) => {
        activeAnim = props.activeAnim ?? false;
        setImageIdx(props?.imageIdx || 0);
        id = props?.id ?? 'particle-container';
        if (canvas) canvas?.parent(id);
      };

      p5.preload = () => {
        // console.log('p5.preload 开始执行');
        for (let i = 0; i < sourceImgInfos.length; i++) {
          const img = p5.loadImage(sourceImgInfos[i].url);
          const [width, height] = sourceImgInfos[i]?.resize ?? [0, 0];
          const scaleNum = sourceImgInfos[i]?.scaleNum ?? defaultConfig.scaleNum;
          if (width && height) img.resize(width * scaleNum, height * scaleNum);
          else img.resize(img.width * scaleNum, img.height * scaleNum);
          sourceImgs.push(img);
        }
        // console.log('p5.preload 执行完毕');
      };

      p5.setup = () => {
        // console.log('p5.setup 开始执行');
        const ratio = 1280 / 750;
        const width = IS_MOBILE ? 800 : 1280;
        const height = width / ratio;
        canvas = p5.createCanvas(width, height);
        canvas.parent(id);
        if (!IS_MOBILE) setImageIdx(0);
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
        // console.log(`图像尺寸: ${sourceImg.width}x${sourceImg.height}`);
        // console.log(`loadPercentage: ${loadPercentage}, resolution: ${resolution}`);

        // Create an array of indexes from particle array.
        const preParticleIndexes = allParticles.map((_, index) => index);

        let pixelIndex = 0;

        const [imgWidth, imgHeight] = [sourceImg.width, sourceImg.height];
        // console.log('imgWidth', imgWidth, 'imgHeight', imgHeight);

        // Pre-calculate random numbers for better performance
        const randomThreshold = loadPercentage * resolution;

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
            if (p5.random(1.0) > randomThreshold) {
              continue;
            }

            const pixelColor = p5.color(pixelR, pixelG, pixelB);
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
              // console.log('创建了新粒子', newParticle);
            }
            newParticle.target.x = x + p5.width / 2 - sourceImg.width / 2;
            newParticle.target.y = y + p5.height / 2 - sourceImg.height / 2;
            newParticle.endColor = pixelColor;
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
      }
      p5.draw = () => {
        if (!activeAnim || !allParticles?.length) return;
        p5.clear();

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
  return <ReactP5Wrapper sketch={wrappedSketch} activeAnim={activeAnim} imageIdx={imageIdx} id={id} />;
};

export default DynamicParticleGL;
