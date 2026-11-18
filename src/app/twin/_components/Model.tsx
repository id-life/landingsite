import { AnatomyCamera, currentAnatomyCameraAtom, currentModelAtom, currentModelTypeAtom, PredictionModel } from '@/atoms/twin';
import { Compare } from '@/components/compare/compare';
import { ModelType } from '@/components/twin/model/type';
import { useAlphaClips } from '@/hooks/useSupportsWebm';
import { cn } from '@/utils';
import { useAtomValue } from 'jotai';
import Image, { getImageProps } from 'next/image';
import React, { useEffect, useMemo, useRef } from 'react';

// Intrinsic sizes of the anatomy stills shown on their own (they render at their natural size).
const BODY_SIZE: Record<string, [number, number]> = {
  '/imgs/twin/model/body/04.png': [392, 617],
  '/imgs/twin/model/body/05.png': [468, 413],
};
const bodySize = (src: string) => BODY_SIZE[src] ?? [396, 990];

// First frame of M0-1.webm, served through the image optimizer (AVIF or WebP, alpha kept): shown
// at once while the clip has not started.
const M0_POSTER = getImageProps({ src: '/imgs/twin/model/poster/M0-1.png', alt: '', width: 480, height: 1060 }).props.src;

/**
 * `active`: the twin page is the current page. The clip loads nothing until then (preload none,
 * no autoplay) and pauses when the visitor leaves.
 */
export function Model({ active }: { active: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentModel = useAtomValue(currentModelAtom);
  const currentModelType = useAtomValue(currentModelTypeAtom);
  const currentAnatomyCamera = useAtomValue(currentAnatomyCameraAtom);
  // The clips play where the browser draws them with their transparency (useAlphaClips); elsewhere the stills stand in.
  const { playable: supportsWebm, url: clip } = useAlphaClips();
  const imgUrl = useMemo(() => {
    if (currentModelType === ModelType.Anatomy) {
      if (currentModel === PredictionModel.M0) {
        switch (currentAnatomyCamera) {
          case AnatomyCamera.CAMERA0:
            return ['/imgs/twin/model/body/01.png'];
          case AnatomyCamera.CAMERA1:
            return ['/imgs/twin/model/body/02.png'];
          case AnatomyCamera.CAMERA2:
            return ['/imgs/twin/model/body/03.png'];
          case AnatomyCamera.CAMERA3:
            return ['/imgs/twin/model/body/04.png'];
          case AnatomyCamera.CAMERA4:
            return ['/imgs/twin/model/body/05.png'];
          default:
            return ['/imgs/twin/model/body/01.png'];
        }
      } else if (currentModel === PredictionModel.M1) {
        switch (currentAnatomyCamera) {
          case AnatomyCamera.CAMERA0:
            return ['/imgs/twin/model/body/01.png', '/imgs/twin/model/M1/01.png'];
          case AnatomyCamera.CAMERA5:
            return ['/imgs/twin/model/M1/02-01.png', '/imgs/twin/model/M1/02-02.png'];
          case AnatomyCamera.CAMERA6:
            return ['/imgs/twin/model/M1/03-01.png', '/imgs/twin/model/M1/03-02.png'];
          default:
            return ['/imgs/twin/model/body/01.png', '/imgs/twin/model/M1/01.png'];
        }
      } else if (currentModel === PredictionModel.M2) {
        switch (currentAnatomyCamera) {
          case AnatomyCamera.CAMERA7:
            return ['/imgs/twin/model/body/01.png', '/imgs/twin/model/M2/01.png'];
          case AnatomyCamera.CAMERA8:
            return ['/imgs/twin/model/M2/02-01.png', '/imgs/twin/model/M2/02-02.png'];
          case AnatomyCamera.CAMERA9:
            return ['/imgs/twin/model/M2/03-01.png', '/imgs/twin/model/M2/03-02.png'];
          default:
            return ['/imgs/twin/model/body/01.png', '/imgs/twin/model/M2/01.png'];
        }
      } else if (currentModel === PredictionModel.M3) {
        switch (currentAnatomyCamera) {
          case AnatomyCamera.CAMERA10:
            return ['/imgs/twin/model/M3/02-01.png', '/imgs/twin/model/M3/02-02.png'];
          default:
            return ['/imgs/twin/model/body/01.png', '/imgs/twin/model/M3/01.png'];
        }
      }
    } else {
      if (!supportsWebm) {
        if (!currentModel || currentModel === PredictionModel.M0) {
          return ['/imgs/twin/model/safari/M0.png'];
        } else if (currentModel === PredictionModel.M1) {
          return ['/imgs/twin/model/safari/M0.png', '/imgs/twin/model/safari/M1.png'];
        } else if (currentModel === PredictionModel.M2) {
          return ['/imgs/twin/model/safari/M0.png', '/imgs/twin/model/safari/M2.png'];
        } else if (currentModel === PredictionModel.M3) {
          return ['/imgs/twin/model/safari/M0.png', '/imgs/twin/model/safari/M3.png'];
        }
      } else {
        if (!currentModel || currentModel === PredictionModel.M0) {
          return [clip('https://resources.id.life/twin/M0-1.webm')];
        } else if (currentModel === PredictionModel.M1) {
          return [clip('https://resources.id.life/twin/M0-1.webm'), clip('https://resources.id.life/twin/M1-1.webm')];
        } else if (currentModel === PredictionModel.M2) {
          return [clip('https://resources.id.life/twin/M0-1.webm'), clip('https://resources.id.life/twin/M2-1.webm')];
        } else if (currentModel === PredictionModel.M3) {
          return [clip('https://resources.id.life/twin/M0-1.webm'), clip('https://resources.id.life/twin/M3-1.webm')];
        }
      }
    }
  }, [clip, currentAnatomyCamera, currentModel, currentModelType, supportsWebm]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (active) video.play().catch(() => {});
    else video.pause();
  }, [active, imgUrl]);

  return (
    <div
      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform ${
        currentAnatomyCamera === AnatomyCamera.CAMERA4 ? 'top-[50%]' : ''
      }`}
    >
      {currentModelType === ModelType.Anatomy ? (
        currentModel === PredictionModel.M0 ? (
          <Image
            src={imgUrl?.[0] ?? ''}
            alt=""
            width={bodySize(imgUrl?.[0] ?? '')[0]}
            height={bodySize(imgUrl?.[0] ?? '')[1]}
            className={`object-cover object-center ${
              currentAnatomyCamera === AnatomyCamera.CAMERA3
                ? 'transform-center'
                : currentAnatomyCamera === AnatomyCamera.CAMERA4
                  ? 'top-10'
                  : ''
            }`}
          />
        ) : (
          <Compare
            firstImage={imgUrl?.[0] || ''}
            secondImage={imgUrl?.[1] || ''}
            firstImageClassName="object-cover object-center"
            secondImageClassname="object-cover object-center"
            className="h-[500px] w-[200px]"
            slideMode="hover"
          />
        )
      ) : currentModel === PredictionModel.M0 ? (
        !supportsWebm ? (
          <div className="relative h-[500px] w-[200px]">
            <Image src={imgUrl?.[0] ?? ''} alt="" fill sizes="200px" className="object-contain object-center" />
          </div>
        ) : (
          <div className="relative h-[500px] w-[220px]">
            <video
              ref={videoRef}
              src={imgUrl?.[0]}
              poster={M0_POSTER}
              preload="none"
              muted
              loop
              playsInline
              className="h-full w-full object-cover object-center"
            />
          </div>
        )
      ) : (
        <Compare
          firstImage={imgUrl?.[0] || ''}
          secondImage={imgUrl?.[1] || ''}
          firstImageClassName={supportsWebm ? 'object-cover object-center' : 'object-center object-contain'}
          secondImageClassname={supportsWebm ? 'object-cover object-center' : 'object-center object-contain'}
          className={cn('h-[500px]', {
            'w-[220px]': supportsWebm,
            'w-[200px]': !supportsWebm,
          })}
          slideMode="hover"
          isVideo={supportsWebm}
        />
      )}
    </div>
  );
}
