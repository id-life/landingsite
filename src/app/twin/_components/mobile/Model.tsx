import { AnatomyCamera, currentAnatomyCameraAtom, currentModelAtom, currentModelTypeAtom, PredictionModel } from '@/atoms/twin';
import { Compare } from '@/components/compare/compare';
import { ModelType } from '@/components/twin/model/type';
import { useSupportsWebm } from '@/hooks/useSupportsWebm';
import { useAtomValue } from 'jotai';
import React, { useMemo } from 'react';

export function Model() {
  const currentModel = useAtomValue(currentModelAtom);
  const currentModelType = useAtomValue(currentModelTypeAtom);
  const currentAnatomyCamera = useAtomValue(currentAnatomyCameraAtom);
  const supportsWebm = useSupportsWebm();
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
          return ['https://cdn.id.life/twin/M0-1.webm'];
        } else if (currentModel === PredictionModel.M1) {
          return ['https://cdn.id.life/twin/M0-1.webm', 'https://cdn.id.life/twin/M1-1.webm'];
        } else if (currentModel === PredictionModel.M2) {
          return ['https://cdn.id.life/twin/M0-1.webm', 'https://cdn.id.life/twin/M2-1.webm'];
        } else if (currentModel === PredictionModel.M3) {
          return ['https://cdn.id.life/twin/M0-1.webm', 'https://cdn.id.life/twin/M3-1.webm'];
        }
      }
    }
  }, [currentAnatomyCamera, currentModel, currentModelType]);

  return (
    <div
      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform ${
        currentAnatomyCamera === AnatomyCamera.CAMERA3
          ? ''
          : currentAnatomyCamera === AnatomyCamera.CAMERA4
            ? 'top-[50%]'
            : ''
      }`}
    >
      {currentModelType === ModelType.Anatomy ? (
        currentModel === PredictionModel.M0 ? (
          <img
            src={imgUrl?.[0]}
            alt=""
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
          <img src={imgUrl?.[0]} alt="" className="h-[500px] w-[200px] object-contain object-center" />
        ) : (
          <video src={imgUrl?.[0]} autoPlay muted loop playsInline className="h-[500px] w-[200px] object-cover object-center" />
        )
      ) : (
        <Compare
          firstImage={imgUrl?.[0] || ''}
          secondImage={imgUrl?.[1] || ''}
          firstImageClassName={supportsWebm ? 'object-cover object-center' : 'object-center object-contain'}
          secondImageClassname={supportsWebm ? 'object-cover object-center' : 'object-center object-contain'}
          className="h-[500px] w-[200px]"
          slideMode="hover"
          isVideo={supportsWebm}
        />
      )}
    </div>
  );
}
