import * as THREE from 'three';
import { RefObject } from 'react';

/**
 * Sets a property on each object of an array, one object per frame. `live` (optional) is asked before each step: a
 * later change of the same objects makes it false, so an older change stops instead of finishing over the newer one.
 */
export const changeArrayData = (array: any[], key: string, value: any, index = 0, live?: () => boolean) => {
  if (index >= array.length) return;
  if (live && !live()) return;

  array[index][key] = value;
  array[index].traverse((object: any) => {
    if (object.isMesh) {
      object[key] = value;
    }
  });
  requestAnimationFrame(() => {
    changeArrayData(array, key, value, index + 1, live);
  });
};

type ComponentMethod = (...args: any[]) => any;

type ComponentWithMethods = {
  [key: string]: ComponentMethod;
};

export const pollComponentMethod = <T extends ComponentWithMethods>(
  componentRef: any,
  methodName: keyof T,
  // The arguments, or a function giving them when the method is finally called (the state of that moment).
  args: any[] | (() => any[]) = [],
  maxAttempts: number = 10,
  interval: number = 100,
): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    let attempts = 0;

    const tryExecute = (): boolean => {
      if (componentRef.current && typeof componentRef.current[methodName] === 'function') {
        const result = componentRef.current[methodName](...(typeof args === 'function' ? args() : args));
        resolve(result);
        return true;
      }

      attempts++;

      if (attempts >= maxAttempts) {
        console.warn(`Failed to execute ${String(methodName)} after ${maxAttempts} attempts`);
        return true;
      }

      return false;
    };

    if (!tryExecute()) {
      const intervalId = setInterval(() => {
        if (tryExecute()) {
          clearInterval(intervalId);
        }
      }, interval);
    }
  });
};
